import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class LearningPlan extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    type: [{
      dayNumber: Number,
      tasks: [{ type: String, description: String, completed: { type: Boolean, default: false } }]
    }]
  })
  days: Array<{ dayNumber: number; tasks: Array<{ type: string; description: string; completed: boolean }> }>;

  @Prop({
    type: [{
      week: Number,
      summary: String,
      miniTestScore: Number
    }]
  })
  weeklyCheckpoints: Array<{ week: number; summary: string; miniTestScore: number }>;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ default: true })
  active: boolean;
}

export const LearningPlanSchema = SchemaFactory.createForClass(LearningPlan);
