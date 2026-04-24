import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class VocabularySet extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  context: string;

  @Prop({
    type: [{
      word: String,
      meaning: String,
      example: String,
      pronunciation: String,
      collocation: String,
      memoryTrick: String,
      mastered: { type: Boolean, default: false }
    }]
  })
  words: Array<{
    word: string;
    meaning: string;
    example: string;
    pronunciation: string;
    collocation: string;
    memoryTrick: string;
    mastered: boolean;
  }>;
}

export const VocabularySetSchema = SchemaFactory.createForClass(VocabularySet);
