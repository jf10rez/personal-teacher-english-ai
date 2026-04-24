import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress } from './schemas/progress.schema';
import { CreateProgressDto } from './dto/create-progress.dto';

@Injectable()
export class ProgressService {
  constructor(@InjectModel(Progress.name) private progressModel: Model<Progress>) {}

  async create(userId: string, dto: CreateProgressDto) {
    return this.progressModel.create({ userId, date: new Date(), ...dto });
  }

  async getSummary(userId: string) {
    const progress = await this.progressModel.find({ userId }).sort({ date: -1 }).limit(30);

    const byModule: Record<string, { totalScore: number; count: number; avgScore: number; totalTime: number }> = {};
    for (const p of progress) {
      if (!byModule[p.module]) {
        byModule[p.module] = { totalScore: 0, count: 0, avgScore: 0, totalTime: 0 };
      }
      byModule[p.module].totalScore += p.score;
      byModule[p.module].count += 1;
      byModule[p.module].totalTime += p.timeSpent;
    }

    for (const key of Object.keys(byModule)) {
      byModule[key].avgScore = Math.round(byModule[key].totalScore / byModule[key].count);
    }

    return { byModule, recentActivity: progress.slice(0, 10) };
  }

  async getMistakes(userId: string) {
    return this.progressModel.find({ userId, module: 'mistakes' }).sort({ date: -1 }).limit(20);
  }
}
