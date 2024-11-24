import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'firstname of the user' })
  @IsString()
  firstname?: string;

  @ApiProperty({ example: 'Wayne', description: 'lastname of the user' })
  @IsString()
  lastname?: string;

  @ApiProperty({
    example: 'john.wayne@example.com',
    description: 'email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'password of the user' })
  @IsString()
  password: string;

  @ApiProperty({ example: 180, description: 'height in cm of the user' })
  @IsNumber()
  height?: number;

  @ApiProperty({ example: 'MALE', description: 'Sex of the user' })
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({
    example: '1990-05-15',
    description: 'Birthdate of the user',
  })
  @IsDate()
  birthday?: Date;

  @IsOptional()
  profileCompleted?: boolean;
}
