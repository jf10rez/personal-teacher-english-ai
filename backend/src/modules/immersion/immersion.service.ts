import { Injectable } from '@nestjs/common';
import { GeminiService } from '../../gemini/gemini.service';
import { generateImmersionPrompt } from '../prompts/immersion.prompt';

@Injectable()
export class ImmersionService {
  constructor(private geminiService: GeminiService) { }

  async generate(interest: string, level: string, minutesPerDay: number) {
    const prompt = generateImmersionPrompt({ interest, level, minutesPerDay });
    return this.geminiService.generateJson(
      'You are an immersion learning expert. Respond ONLY with valid JSON.',
      prompt
    );
  }
}
