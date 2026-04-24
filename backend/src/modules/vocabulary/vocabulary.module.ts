import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VocabularyService } from './vocabulary.service';
import { VocabularyController } from './vocabulary.controller';
import { VocabularySet, VocabularySetSchema } from './schemas/vocabulary-set.schema';
import { GeminiModule } from '../../gemini/gemini.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: VocabularySet.name, schema: VocabularySetSchema }]),
    GeminiModule,
  ],
  controllers: [VocabularyController],
  providers: [VocabularyService],
})
export class VocabularyModule {}
