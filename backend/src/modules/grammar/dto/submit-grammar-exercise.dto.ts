import { IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitGrammarExerciseDto {
  @ApiProperty()
  @IsNotEmpty()
  topic: string;

  @ApiProperty()
  @IsNotEmpty()
  level: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  weakPoints: string[];
}
