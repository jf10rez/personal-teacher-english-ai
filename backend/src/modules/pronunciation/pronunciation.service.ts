import { Injectable } from '@nestjs/common';
import { GeminiService } from '../../gemini/gemini.service';
import { generatePronunciationPrompt } from '../prompts/pronunciation.prompt';

@Injectable()
export class PronunciationService {
  constructor(private geminiService: GeminiService) { }

  async generate(level: string, text?: string) {
    const prompt = generatePronunciationPrompt({ level, text });
    return this.geminiService.generateJson(
      'You are a pronunciation coach for Spanish speakers. Respond ONLY with valid JSON.',
      prompt
    );
  }
}
