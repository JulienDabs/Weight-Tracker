import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  @IsString()
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  firstname: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  @IsString()
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastname: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'The password of the user',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(32, { message: 'Password must not exceed 32 characters' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password is too weak. It should contain at least one uppercase letter, one lowercase letter, and one number or special character',
  })
  password: string;

  @ApiProperty({
    example: 95.5,
    description: 'Current weight in kg of the user ',
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
  active: number;

  @ApiProperty({
    example: '120/8',
    description: 'blood pressure of the user',
    required: false,
  })
  @IsString()
  bloodPressure?: string;

  @ApiProperty({ example: 75, description: 'weight goal of the user' })
  @IsNumber()
  weightGoal: number;

  
  token: string;
}
