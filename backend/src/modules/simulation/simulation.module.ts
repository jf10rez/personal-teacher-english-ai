import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SimulationService } from './simulation.service';
import { SimulationController } from './simulation.controller';
import { SimulationSession, SimulationSessionSchema } from './schemas/simulation-session.schema';
import { GeminiModule } from '../../gemini/gemini.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SimulationSession.name, schema: SimulationSessionSchema }]),
    GeminiModule,
  ],
  controllers: [SimulationController],
  providers: [SimulationService],
})
export class SimulationModule {}
