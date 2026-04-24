import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LearningPlanService } from './learning-plan.service';
import { GeneratePlanDto } from './dto/generate-plan.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('learning-plan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('learning-plan')
export class LearningPlanController {
  constructor(private service: LearningPlanService) {}

  @Post('generate')
  generate(@CurrentUser() user: any, @Body() dto: GeneratePlanDto) {
    return this.service.generate(user.sub, dto);
  }

  @Get('active')
  getActive(@CurrentUser() user: any) {
    return this.service.getActive(user.sub);
  }

  @Patch('day/:dayNumber/complete')
  completeDay(@CurrentUser() user: any, @Param('dayNumber') dayNumber: string) {
    return this.service.completeDay(user.sub, parseInt(dayNumber));
  }
}
