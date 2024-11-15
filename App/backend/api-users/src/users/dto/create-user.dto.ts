import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { IsEmail, IsEnum, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'firstname of the user' })
  @IsString()
  firstname: string;

  @ApiProperty({ example: 'Wayne', description: 'lastname of the user' })
  @IsString()
  lastname: string;

  @ApiProperty({
    example: 'john.wayne@example.com',
    description: 'email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'password of the user' })
  @IsString()
  password: string;

  @ApiProperty({
    example: 95.5,
    description: 'Current weight in kg of the user',
  })
  @IsNumber()
  currentWeight: number;

  @ApiProperty({ example: 180, description: 'height in cm of the user' })
  @IsNumber()
  height: number;

  @ApiProperty({
    example: 2,
    description: 'Activity level of the user (1-3)',
    minimum: 1,
    maximum: 3,
  })
  @Min(1)
  @Max(3)
  @IsNumber()
  active: number;

  @ApiProperty({
    example: '120/80',
    description: 'blood pressure of the user',
    required: false,
  })
  @IsString()
  bloodPressure?: string;

  @ApiProperty({ example: 75, description: 'weight goal of the user' })
  @IsNumber()
  weightGoal: number;

  @ApiProperty({
    example: 'some-random-token',
    description: 'Verification token',
  })
  @IsString()
  token: string;

   @ApiProperty({ example: 'MALE', description: 'Sex of the user' })
   @IsEnum(Gender)
   gender: Gender
}
