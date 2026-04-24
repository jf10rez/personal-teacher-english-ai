import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GeneratePronunciationDto {
  @ApiProperty({ enum: ['beginner', 'intermediate', 'advanced'] })
  @IsNotEmpty()
  level: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  text?: string;
}
