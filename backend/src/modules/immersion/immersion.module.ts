import { Module } from '@nestjs/common';
import { ImmersionService } from './immersion.service';
import { ImmersionController } from './immersion.controller';
import { GeminiModule } from '../../gemini/gemini.module';

@Module({
  imports: [GeminiModule],
  controllers: [ImmersionController],
  providers: [ImmersionService],
})
export class ImmersionModule {}
