import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ConversationService } from './conversation.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('conversations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationController {
  constructor(private service: ConversationService) {}

  @Post()
  createSession(@CurrentUser() user: any, @Body() dto: CreateSessionDto) {
    return this.service.createSession(user.sub, dto.topic, dto.level);
  }

  @Post(':id/message')
  sendMessage(@Param('id') id: string, @Body() dto: SendMessageDto) {
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
