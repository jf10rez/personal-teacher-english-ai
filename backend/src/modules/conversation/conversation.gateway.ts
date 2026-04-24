import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConversationService } from './conversation.service';
import { GeminiService } from '../../gemini/gemini.service';
import { generateConversationSystemPrompt } from '../prompts/conversation.prompt';

@WebSocketGateway({ cors: { origin: '*' }, namespace: 'conversation' })
export class ConversationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private sessions: Map<string, { userId: string; topic: string; level: string; history: Array<{ role: string; content: string }> }> = new Map();

  constructor(
    private conversationService: ConversationService,
    private geminiService: GeminiService,
  ) { }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.sessions.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinSession')
  async handleJoinSession(client: Socket, payload: { userId: string; topic: string; level: string }) {
    const session = await this.conversationService.createSession(payload.userId, payload.topic, payload.level);

    this.sessions.set(client.id, {
      userId: payload.userId,
      topic: payload.topic,
      level: payload.level,
      history: session.messages.map(m => ({ role: m.role, content: m.content })),
    });

    client.emit('sessionStarted', { sessionId: session._id, messages: session.messages });
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: { content: string }) {
    const sessionData = this.sessions.get(client.id);
    if (!sessionData) return;

    const systemPrompt = generateConversationSystemPrompt({ topic: sessionData.topic, level: sessionData.level });
    sessionData.history.push({ role: 'user', content: payload.content });

    let fullResponse = '';
    for await (const chunk of this.geminiService.streamChat(systemPrompt, sessionData.history)) {
      fullResponse += chunk;
      client.emit('messageChunk', { chunk });
    }

    sessionData.history.push({ role: 'model', content: fullResponse });

    client.emit('messageComplete', { content: fullResponse });
  }

  @SubscribeMessage('endSession')
  async handleEndSession(client: Socket) {
    this.sessions.delete(client.id);
    client.emit('sessionEnded');
  }
}
