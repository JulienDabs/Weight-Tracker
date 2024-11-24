import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateWeightDto {
  @ApiProperty({ description: 'The weight value in kilograms' })
  @IsNumber()
  weight: number;

  @ApiProperty({ description: 'The ID of the user' })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Blood pressure in the format "systolic/diastolic"',
    required: false,
  })
  @IsOptional()
  @IsString()
  bloodPressure?: string;

  @ApiProperty({
    description: 'Heart rate in beats per minute',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  heartRate?: number;

  @ApiProperty({
    description: 'Waist measurement in centimeters',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  waist?: number;

  @ApiProperty({
    description: 'Hip measurement in centimeters',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  hip?: number;

  @ApiProperty({
    description: 'Chest measurement in centimeters',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  chest?: number;

  @ApiProperty({
    description: 'Thigh measurement in centimeters',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  thigh?: number;

  @ApiProperty({
    description: 'Body Mass Index (BMI)',
  })
  @IsNumber()
  bmi: number; // Make this required to match Prisma schema

  @ApiProperty({
    description: 'Activity level of the user (1-3)',
    example: 2,
    minimum: 1,
    maximum: 3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(3)
  active?: number;

  @ApiProperty({
    description: 'Number of weeks to reach the weight goal',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  weeksToReachGoal?: number;

  @ApiProperty({
    description: 'The desired weight goal in kilograms',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  weightGoal?: number;

  @ApiProperty({
    description: 'Projected BMI at the weight goal',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  projectedBmi?: number;
}
