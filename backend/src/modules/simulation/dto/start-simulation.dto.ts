import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartSimulationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  situation: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsNumber()
  difficulty: number;
}
