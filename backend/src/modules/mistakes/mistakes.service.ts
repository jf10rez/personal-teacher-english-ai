import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MistakeLog } from './schemas/mistake-log.schema';
import { GeminiService } from '../../gemini/gemini.service';
import { generateMistakesPrompt } from '../prompts/mistakes.prompt';

@Injectable()
export class MistakesService {
  constructor(
    @InjectModel(MistakeLog.name) private mistakeModel: Model<MistakeLog>,
    private geminiService: GeminiService,
  ) { }

  async analyze(userId: string, text: string, level: string) {
    const prompt = generateMistakesPrompt({ text, level });
    const result = await this.geminiService.generateJson(
      'You are an error analysis expert. Respond ONLY with valid JSON.',
      prompt
    );

    const logs: MistakeLog[] = [];
    for (const pattern of result.errorPatterns) {
      const existing = await this.mistakeModel.findOne({ userId, pattern: pattern.pattern });
      if (existing) {
        existing.frequency += 1;
        existing.lastSeen = new Date();
        existing.examples.push(...pattern.examples);
        await existing.save();
        logs.push(existing);
      } else {
        const log = await this.mistakeModel.create({
          userId,
          pattern: pattern.pattern,
          examples: pattern.examples,
          drills: [pattern.drill],
          frequency: 1,
          lastSeen: new Date(),
        });
        logs.push(log);
      }
    }

    return { errorPatterns: result.errorPatterns, doThisNotThat: result.doThisNotThat, rewrittenVersion: result.rewrittenVersion, focusForNextSession: result.focusForNextSession, logs };
  }

  async getUserMistakes(userId: string) {
    return this.mistakeModel.find({ userId }).sort({ frequency: -1 });
  }

  async getProgressReport(userId: string) {
    const mistakes = await this.mistakeModel.find({ userId }).sort({ lastSeen: -1 });
    const totalPatterns = mistakes.length;
    const totalErrors = mistakes.reduce((sum, m) => sum + m.frequency, 0);
    const mostFrequent = mistakes.slice(0, 5);

    return { totalPatterns, totalErrors, mostFrequent, recentMistakes: mistakes.slice(0, 10) };
  }
}
