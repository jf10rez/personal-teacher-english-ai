import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SimulationService } from './simulation.service';
import { StartSimulationDto } from './dto/start-simulation.dto';
import { SendSimulationMessageDto } from './dto/send-simulation-message.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('modules/simulation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('modules/simulation')
export class SimulationController {
  constructor(private service: SimulationService) {}

  @Post('start')
  start(@CurrentUser() user: any, @Body() dto: StartSimulationDto) {
    return this.service.start(user.sub, dto.situation, dto.difficulty);
  }

  @Post(':id/message')
  sendMessage(@Param('id') id: string, @Body() dto: SendSimulationMessageDto) {
    return this.service.sendMessage(id, dto.content);
  }

  @Post(':id/end')
  endSession(@Param('id') id: string) {
    return this.service.endSession(id);
  }

  @Get(':id')
  getSession(@Param('id') id: string) {
    return this.service.getSession(id);
  }

  @Get('history')
  getHistory(@CurrentUser() user: any) {
    return this.service.getHistory(user.sub);
  }
}
