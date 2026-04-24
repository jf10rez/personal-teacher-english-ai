import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ConversationSession extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  module: string;

  @Prop({ required: true })
  topic: string;

  @Prop({ required: true })
  level: string;

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

export const ConversationSessionSchema = SchemaFactory.createForClass(ConversationSession);
