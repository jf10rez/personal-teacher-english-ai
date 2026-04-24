import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService {
  private client: GoogleGenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY is not defined');
    this.client = new GoogleGenAI({ apiKey });
  }

  async generateText(systemPrompt: string, userPrompt: string): Promise<string> {
    const response = await this.client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${systemPrompt}\n\n${userPrompt}`,
      config: { temperature: 0.7, maxOutputTokens: 4096 },
    });
    return response.text || '';
  }

  async generateJson(systemPrompt: string, userPrompt: string): Promise<any> {
    const response = await this.client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${systemPrompt}\n\n${userPrompt}`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    });
    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to parse JSON response from Gemini');
    return JSON.parse(jsonMatch[0]);
  }

  async *streamChat(systemPrompt: string, history: Array<{ role: string; content: string }>): AsyncIterable<string> {
    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...history.map(h => ({ role: h.role, parts: [{ text: h.content }] })),
    ];

    const response = await this.client.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: contents as any,
      config: { temperature: 0.8, maxOutputTokens: 2048 },
    });

    for await (const chunk of response) {
      yield chunk.text || '';
    }
  }
}
