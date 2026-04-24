import { Module } from '@nestjs/common';
import { PronunciationService } from './pronunciation.service';
import { PronunciationController } from './pronunciation.controller';
import { GeminiModule } from '../../gemini/gemini.module';

@Module({
  imports: [GeminiModule],
  controllers: [PronunciationController],
  providers: [PronunciationService],
})
export class PronunciationModule {}
