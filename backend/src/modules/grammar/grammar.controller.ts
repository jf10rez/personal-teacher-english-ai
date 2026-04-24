import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GrammarService } from './grammar.service';
import { GenerateGrammarDto } from './dto/generate-grammar.dto';
import { SubmitGrammarExerciseDto } from './dto/submit-grammar-exercise.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('modules/grammar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('modules/grammar')
export class GrammarController {
  constructor(private service: GrammarService) {}

  @Post('generate')
  generate(@Body() dto: GenerateGrammarDto) {
    return this.service.generate(dto.topic, dto.level);
  }

  @Post('follow-up')
  followUp(@Body() dto: SubmitGrammarExerciseDto) {
    return this.service.generateFollowUp(dto.topic, dto.level, dto.weakPoints);
  }
}
