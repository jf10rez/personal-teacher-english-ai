import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LearningPlan } from './schemas/learning-plan.schema';
import { GeneratePlanDto } from './dto/generate-plan.dto';
import { GeminiService } from '../gemini/gemini.service';
import { generateCoachPrompt } from '../modules/prompts';

@Injectable()
export class LearningPlanService {
  constructor(
    @InjectModel(LearningPlan.name) private planModel: Model<LearningPlan>,
    private geminiService: GeminiService,
  ) { }

  async generate(userId: string, dto: GeneratePlanDto) {
    const prompt = generateCoachPrompt({
      level: dto.level,
      goal: dto.goal,
      dailyMinutes: dto.dailyMinutes,
      weeks: dto.weeks,
    });

    const result = await this.geminiService.generateJson(
      'You are an expert English learning coach. Respond ONLY with valid JSON.',
      prompt
    );

    await this.planModel.deleteMany({ userId, active: true });

    const plan = await this.planModel.create({
      userId,
      days: result.days,
      weeklyCheckpoints: result.weeklyCheckpoints,
      startDate: new Date(),
      active: true,
    });

    return plan;
  }

  async getActive(userId: string) {
    return this.planModel.findOne({ userId, active: true });
  }

  async completeDay(userId: string, dayNumber: number) {
    const plan = await this.planModel.findOne({ userId, active: true });
    if (!plan) throw new Error('No active plan found');

    const day = plan.days.find(d => d.dayNumber === dayNumber);
    if (!day) throw new Error('Day not found');

    day.tasks.forEach(task => task.completed = true);
    await plan.save();
    return plan;
  }
}
