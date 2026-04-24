import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MistakesService } from './mistakes.service';
import { AnalyzeMistakesDto } from './dto/analyze-mistakes.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('modules/mistakes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('modules/mistakes')
export class MistakesController {
  constructor(private service: MistakesService) {}

  @Post('generate')
  analyze(@CurrentUser() user: any, @Body() dto: AnalyzeMistakesDto) {
    return this.service.analyze(user.sub, dto.text, dto.level);
  }

  @Get('my-mistakes')
  getMyMistakes(@CurrentUser() user: any) {
    return this.service.getUserMistakes(user.sub);
  }

  @Get('progress')
  getProgress(@CurrentUser() user: any) {
    return this.service.getProgressReport(user.sub);
  }
}
