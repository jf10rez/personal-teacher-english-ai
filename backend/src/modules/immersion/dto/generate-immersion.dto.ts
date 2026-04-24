import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateImmersionDto {
  @ApiProperty()
  @IsNotEmpty()
  interest: string;

  @ApiProperty({ enum: ['beginner', 'intermediate', 'advanced'] })
  @IsNotEmpty()
  level: string;

  @ApiProperty({ minimum: 5 })
  @IsNumber()
  @Min(5)
  minutesPerDay: number;
}
