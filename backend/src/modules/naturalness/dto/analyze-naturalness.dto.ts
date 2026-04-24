import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeNaturalnessDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({ default: 'casual', enum: ['casual', 'polite', 'professional'] })
  @IsOptional()
  tone?: string;
}
