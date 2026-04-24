import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateGrammarDto {
  @ApiProperty()
  @IsNotEmpty()
  topic: string;

  @ApiProperty({ enum: ['beginner', 'intermediate', 'advanced'] })
  @IsNotEmpty()
  level: string;
}
