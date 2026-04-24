import { Injectable } from '@nestjs/common';
import { GeminiService } from '../../gemini/gemini.service';
import { generateNaturalnessPrompt } from '../prompts/naturalness.prompt';

@Injectable()
export class NaturalnessService {
  constructor(private geminiService: GeminiService) { }

  async analyze(text: string, tone: string = 'casual') {
    const prompt = generateNaturalnessPrompt({ text, tone });
    return this.geminiService.generateJson(
      'You are an English language expert. Respond ONLY with valid JSON.',
      prompt
    );
  }
}
