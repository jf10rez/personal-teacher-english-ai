import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendSimulationMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;
}
