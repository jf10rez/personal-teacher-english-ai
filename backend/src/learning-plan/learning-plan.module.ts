import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LearningPlanService } from './learning-plan.service';
import { LearningPlanController } from './learning-plan.controller';
import { LearningPlan, LearningPlanSchema } from './schemas/learning-plan.schema';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LearningPlan.name, schema: LearningPlanSchema }]),
    GeminiModule,
  ],
  controllers: [LearningPlanController],
  providers: [LearningPlanService],
  exports: [LearningPlanService],
})
export class LearningPlanModule {}
