import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class SimulationSession extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  situation: string;

  @Prop({ required: true })
  difficulty: number;

  @Prop({
    type: [{
      role: { type: String, enum: ['user', 'assistant'] },
      content: String,
      corrections: [{ original: String, corrected: String, explanation: String }],
      timestamp: { type: Date, default: Date.now }
    }]
  })
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    corrections?: Array<{ original: string; corrected: string; explanation: string }>;
    timestamp: Date;
  }>;

  @Prop({ default: true })
  isActive: boolean;
}

export const SimulationSessionSchema = SchemaFactory.createForClass(SimulationSession);
