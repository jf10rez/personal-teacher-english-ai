import { Module } from '@nestjs/common';
import { GrammarService } from './grammar.service';
import { GrammarController } from './grammar.controller';
import { GeminiModule } from '../../gemini/gemini.module';

@Module({
  imports: [GeminiModule],
  controllers: [GrammarController],
  providers: [GrammarService],
})
export class GrammarModule {}
