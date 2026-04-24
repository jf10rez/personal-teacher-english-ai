import { Injectable } from '@nestjs/common';
import { GeminiService } from '../../gemini/gemini.service';
import { generateThinkingPrompt } from '../prompts/thinking.prompt';

@Injectable()
export class ThinkingService {
  constructor(private geminiService: GeminiService) { }

  async generate(level: string) {
    const prompt = generateThinkingPrompt({ level });
    return this.geminiService.generateJson(
      'You are an English teaching expert. Respond ONLY with valid JSON.',
      prompt
    );
  }
}
