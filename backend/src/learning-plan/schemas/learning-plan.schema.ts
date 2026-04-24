import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
class Task {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: false })
  completed: boolean;
}

@Schema({ _id: false })
class Day {
  @Prop({ required: true })
  dayNumber: number;

  @Prop({ type: [Task], default: [] })
  tasks: Task[];
}

@Schema({ _id: false })
class WeeklyCheckpoint {
  @Prop({ required: true })
  week: number;

  @Prop({ required: true })
  summary: string;

  @Prop({ required: true })
  miniTestScore: number;
}

@Schema({ timestamps: true })
export class LearningPlan extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [Day], default: [] })
  days: Day[];

  @Prop({ type: [WeeklyCheckpoint], default: [] })
  weeklyCheckpoints: WeeklyCheckpoint[];

  @Prop({ required: true })
  startDate: Date;

  @Prop({ default: true })
  active: boolean;
}

export const LearningPlanSchema = SchemaFactory.createForClass(LearningPlan);
