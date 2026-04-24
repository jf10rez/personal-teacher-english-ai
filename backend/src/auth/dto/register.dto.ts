import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ default: 'beginner' })
  @IsOptional()
  level?: 'beginner' | 'intermediate' | 'advanced';

  @ApiProperty()
  @IsOptional()
  goal?: string;

  @ApiProperty({ default: 30 })
  @IsOptional()
  dailyMinutes?: number;
}
