import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NaturalnessService } from './naturalness.service';
import { AnalyzeNaturalnessDto } from './dto/analyze-naturalness.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('modules/naturalness')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('modules/naturalness')
export class NaturalnessController {
  constructor(private service: NaturalnessService) {}

  @Post('generate')
  analyze(@Body() dto: AnalyzeNaturalnessDto) {
    return this.service.analyze(dto.text, dto.tone);
  }
}
