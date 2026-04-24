import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Progress extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  module: string;

  @Prop({ default: 0 })
  score: number;

  @Prop({ default: 0 })
  timeSpent: number;

  @Prop()
  notes: string;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
