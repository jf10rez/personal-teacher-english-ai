import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LearningPlanModule } from './learning-plan/learning-plan.module';
import { GeminiModule } from './gemini/gemini.module';
import { ThinkingModule } from './modules/thinking/thinking.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { NaturalnessModule } from './modules/naturalness/naturalness.module';
import { VocabularyModule } from './modules/vocabulary/vocabulary.module';
import { GrammarModule } from './modules/grammar/grammar.module';
import { PronunciationModule } from './modules/pronunciation/pronunciation.module';
import { ImmersionModule } from './modules/immersion/immersion.module';
import { SimulationModule } from './modules/simulation/simulation.module';
import { MistakesModule } from './modules/mistakes/mistakes.module';
import { ProgressModule } from './progress/progress.module';
import { WebSocketModule } from './websocket/websocket.module';
import { PromptsModule } from './modules/prompts/prompts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    LearningPlanModule,
    GeminiModule,
    ThinkingModule,
    ConversationModule,
    NaturalnessModule,
    VocabularyModule,
    GrammarModule,
    PronunciationModule,
    ImmersionModule,
    SimulationModule,
    MistakesModule,
    ProgressModule,
    WebSocketModule,
    PromptsModule,
  ],
})
export class AppModule { }
