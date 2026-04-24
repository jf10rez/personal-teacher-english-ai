import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateVocabularyDto {
  @ApiProperty({ enum: [30, 50, 100] })
  @IsNumber()
  count: number;

  @ApiProperty()
  @IsNotEmpty()
  context: string;

  @ApiProperty({ enum: ['beginner', 'intermediate', 'advanced'] })
  @IsNotEmpty()
  level: string;
}
