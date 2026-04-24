import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GeneratePlanDto {
  @ApiProperty({ enum: ['beginner', 'intermediate', 'advanced'] })
  @IsNotEmpty()
  @IsEnum(['beginner', 'intermediate', 'advanced'])
  level: 'beginner' | 'intermediate' | 'advanced';

  @ApiProperty()
  @IsNotEmpty()
  goal: string;

  @ApiProperty({ minimum: 5 })
  @IsNumber()
  @Min(5)
  dailyMinutes: number;

  @ApiProperty({ minimum: 1, maximum: 12 })
  @IsNumber()
  @Min(1)
  weeks: number;
}
