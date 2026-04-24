import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConversationSession } from './schemas/conversation-session.schema';
import { GeminiService } from '../../gemini/gemini.service';
import { generateConversationSystemPrompt } from '../prompts/conversation.prompt';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(ConversationSession.name) private sessionModel: Model<ConversationSession>,
    private geminiService: GeminiService,
  ) { }

  async createSession(userId: string, topic: string, level: string) {
    const systemPrompt = generateConversationSystemPrompt({ topic, level });
    const initialResponse = await this.geminiService.generateText(systemPrompt, 'Start the conversation.');

    return this.sessionModel.create({
      userId,
      module: 'conversation',
      topic,
      level,
      messages: [{ role: 'assistant', content: initialResponse, timestamp: new Date() }],
      isActive: true,
    });
  }

  async sendMessage(sessionId: string, content: string) {
    const session = await this.sessionModel.findById(sessionId);
    if (!session || !session.isActive) throw new Error('Session not found or inactive');

    session.messages.push({ role: 'user', content, timestamp: new Date() });

    const systemPrompt = generateConversationSystemPrompt({ topic: session.topic, level: session.level });
    const history = session.messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', content: m.content }));

    const response = await this.geminiService.generateText(systemPrompt, content);

    session.messages.push({ role: 'assistant', content: response, timestamp: new Date() });
    await session.save();

    return { message: { role: 'assistant', content: response, timestamp: new Date() } };
  }

  async endSession(sessionId: string) {
    return this.sessionModel.findByIdAndUpdate(sessionId, { isActive: false }, { new: true });
  }

  async getSession(sessionId: string) {
    return this.sessionModel.findById(sessionId);
  }

  async getHistory(userId: string) {
    return this.sessionModel.find({ userId }).sort({ createdAt: -1 }).limit(20);
  }
}
