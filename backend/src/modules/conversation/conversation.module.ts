import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { ConversationGateway } from './conversation.gateway';
import { ConversationSession, ConversationSessionSchema } from './schemas/conversation-session.schema';
import { GeminiModule } from '../../gemini/gemini.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ConversationSession.name, schema: ConversationSessionSchema }]),
    GeminiModule,
  ],
  controllers: [ConversationController],
  providers: [ConversationService, ConversationGateway],
  exports: [ConversationService],
})
export class ConversationModule {}
