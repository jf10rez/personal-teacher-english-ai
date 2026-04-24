import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateThinkingDto {
  @ApiProperty({ enum: ['beginner', 'intermediate', 'advanced'] })
  @IsNotEmpty()
  level: string;
}
