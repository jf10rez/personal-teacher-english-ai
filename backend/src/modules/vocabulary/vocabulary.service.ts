import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VocabularySet } from './schemas/vocabulary-set.schema';
import { GenerateVocabularyDto } from './dto/generate-vocabulary.dto';
import { GeminiService } from '../../gemini/gemini.service';
import { generateVocabularyPrompt } from '../prompts/vocabulary.prompt';

@Injectable()
export class VocabularyService {
  constructor(
    @InjectModel(VocabularySet.name) private vocabModel: Model<VocabularySet>,
    private geminiService: GeminiService,
  ) { }

  async generate(userId: string, dto: GenerateVocabularyDto) {
    const prompt = generateVocabularyPrompt({ count: dto.count, context: dto.context, level: dto.level });
    const result = await this.geminiService.generateJson(
      'You are a vocabulary expert. Respond ONLY with valid JSON.',
      prompt
    );

    const vocabSet = await this.vocabModel.create({
      userId,
      context: dto.context,
      words: result.words,
    });

    return vocabSet;
  }

  async getUserSets(userId: string) {
    return this.vocabModel.find({ userId }).sort({ createdAt: -1 });
  }

  async markWord(userId: string, setId: string, wordIndex: number) {
    const set = await this.vocabModel.findOne({ _id: setId, userId });
    if (!set) throw new Error('Vocabulary set not found');
    set.words[wordIndex].mastered = true;
    await set.save();
    return set;
  }
}
