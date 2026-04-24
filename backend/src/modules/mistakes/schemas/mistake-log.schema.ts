import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class MistakeLog extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ConversationSession' })
  sessionId: Types.ObjectId;

  @Prop({ required: true })
  pattern: string;

  @Prop({
    type: [{
      wrong: String,
      correct: String,
      explanation: String
    }]
  })
  examples: Array<{ wrong: string; correct: string; explanation: string }>;

  @Prop([String])
  drills: string[];

  @Prop({ default: 1 })
  frequency: number;

  @Prop({ type: Date, default: Date.now })
  lastSeen: Date;
}

export const MistakeLogSchema = SchemaFactory.createForClass(MistakeLog);
