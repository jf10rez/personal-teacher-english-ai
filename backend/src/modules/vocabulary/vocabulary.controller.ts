import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { VocabularyService } from './vocabulary.service';
import { GenerateVocabularyDto } from './dto/generate-vocabulary.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('modules/vocabulary')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('modules/vocabulary')
export class VocabularyController {
  constructor(private service: VocabularyService) {}

  @Post('generate')
  generate(@CurrentUser() user: any, @Body() dto: GenerateVocabularyDto) {
    return this.service.generate(user.sub, dto);
  }

  @Get('history')
  getHistory(@CurrentUser() user: any) {
    return this.service.getUserSets(user.sub);
  }

  @Patch(':setId/word/:wordIndex/master')
  markMastered(@Param('setId') setId: string, @Param('wordIndex') wordIndex: string) {
    return this.service.markWord('', setId, parseInt(wordIndex));
  }
}
