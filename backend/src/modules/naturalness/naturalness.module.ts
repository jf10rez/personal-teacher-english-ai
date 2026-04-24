import { Module } from '@nestjs/common';
import { NaturalnessService } from './naturalness.service';
import { NaturalnessController } from './naturalness.controller';
import { GeminiModule } from '../../gemini/gemini.module';

@Module({
  imports: [GeminiModule],
  controllers: [NaturalnessController],
  providers: [NaturalnessService],
})
export class NaturalnessModule {}
