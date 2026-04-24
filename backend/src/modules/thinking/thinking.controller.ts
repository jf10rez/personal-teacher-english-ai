import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ThinkingService } from './thinking.service';
import { GenerateThinkingDto } from './dto/generate-thinking.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('modules/thinking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('modules/thinking')
export class ThinkingController {
  constructor(private service: ThinkingService) {}

  @Post('generate')
  generate(@Body() dto: GenerateThinkingDto) {
    return this.service.generate(dto.level);
  }
}
