import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY is not defined');
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateText(systemPrompt: string, userPrompt: string): Promise<string> {
    const result = await this.model.generateContent({
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
      ],
      generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
    });
    return result.response.text();
  }

  async generateJson(systemPrompt: string, userPrompt: string): Promise<any> {
    const text = await this.generateText(systemPrompt, userPrompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to parse JSON response from Gemini');
    return JSON.parse(jsonMatch[0]);
  }

  async *streamChat(systemPrompt: string, history: Array<{ role: string; content: string }>): AsyncIterable<string> {
    const chat = this.model.startChat({
      history: [{ role: 'user', parts: [{ text: systemPrompt }] }, ...history.map(h => ({ role: h.role, parts: [{ text: h.content }] }))],
      generationConfig: { temperature: 0.8, maxOutputTokens: 2048 },
    });

    const result = await chat.sendMessageStream('');
    for await (const chunk of result.stream) {
      yield chunk.text();
    }
  }
}
