import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProgressDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  module: string;

  @ApiProperty({ minimum: 0, maximum: 100 })
  @IsNumber()
  score: number;

  @ApiProperty()
  @IsNumber()
  timeSpent: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  notes?: string;
}
