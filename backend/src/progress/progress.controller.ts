import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private service: ProgressService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateProgressDto) {
    return this.service.create(user.sub, dto);
  }

  @Get('summary')
  getSummary(@CurrentUser() user: any) {
    return this.service.getSummary(user.sub);
  }

  @Get('mistakes')
  getMistakes(@CurrentUser() user: any) {
    return this.service.getMistakes(user.sub);
  }
}
