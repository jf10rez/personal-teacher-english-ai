import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MistakesService } from './mistakes.service';
import { MistakesController } from './mistakes.controller';
import { MistakeLog, MistakeLogSchema } from './schemas/mistake-log.schema';
import { GeminiModule } from '../../gemini/gemini.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MistakeLog.name, schema: MistakeLogSchema }]),
    GeminiModule,
  ],
  controllers: [MistakesController],
  providers: [MistakesService],
})
export class MistakesModule {}
