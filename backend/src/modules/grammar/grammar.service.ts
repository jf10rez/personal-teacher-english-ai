import { Injectable } from '@nestjs/common';
import { GeminiService } from '../../gemini/gemini.service';
import { generateGrammarPrompt } from '../prompts/grammar.prompt';

@Injectable()
export class GrammarService {
  constructor(private geminiService: GeminiService) { }

  async generate(topic: string, level: string) {
    const prompt = generateGrammarPrompt({ topic, level });
    return this.geminiService.generateJson(
      'You are a grammar expert teaching English to Spanish speakers. Respond ONLY with valid JSON.',
      prompt
    );
  }

  async generateFollowUp(topic: string, level: string, weakPoints: string[]) {
    const prompt = `Generate 5 new grammar exercises for "${topic}" at ${level} level focusing on these weak points: ${weakPoints.join(', ')}.

Respond as JSON:
{
  "exercises": [
    { "question": "exercise", "answer": "correct answer", "difficulty": "easy|medium|hard" }
  ]
}

Respond ONLY with valid JSON.`;

    return this.geminiService.generateJson(
      'You are a grammar expert. Respond ONLY with valid JSON.',
      prompt
    );
  }
}
