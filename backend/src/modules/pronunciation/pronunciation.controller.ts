import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PronunciationService } from './pronunciation.service';
import { GeneratePronunciationDto } from './dto/generate-pronunciation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('modules/pronunciation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('modules/pronunciation')
export class PronunciationController {
  constructor(private service: PronunciationService) {}

  @Post('generate')
  generate(@Body() dto: GeneratePronunciationDto) {
    return this.service.generate(dto.level, dto.text);
  }
}
