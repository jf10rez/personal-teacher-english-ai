import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ImmersionService } from './immersion.service';
import { GenerateImmersionDto } from './dto/generate-immersion.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('modules/immersion')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('modules/immersion')
export class ImmersionController {
  constructor(private service: ImmersionService) {}

  @Post('generate')
  generate(@Body() dto: GenerateImmersionDto) {
    return this.service.generate(dto.interest, dto.level, dto.minutesPerDay);
  }
}
