import { Module } from '@nestjs/common';
import { ThinkingService } from './thinking.service';
import { ThinkingController } from './thinking.controller';
import { GeminiModule } from '../../gemini/gemini.module';

@Module({
  imports: [GeminiModule],
  controllers: [ThinkingController],
  providers: [ThinkingService],
})
export class ThinkingModule {}
