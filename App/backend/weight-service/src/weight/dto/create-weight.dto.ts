import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWeightDto {
  @ApiProperty({ description: 'The date of the weight entry' })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  date: Date;

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
    description: 'Waist measurement in centimeters or inches',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  waist?: number;

  @ApiProperty({
    description: 'Hip measurement in centimeters or inches',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  hip?: number;

  @ApiProperty({
    description: 'Chest measurement in centimeters or inches',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  chest?: number;

  @ApiProperty({
    description: 'Thigh measurement in centimeters or inches',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  thigh?: number;

  @ApiProperty({
    description: 'Body Mass Index (BMI) calculated based on weight and height',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  bmi: number; // Optional, if not always provided

  @ApiProperty({
    description: 'Activity level of the user, where higher numbers indicate more activity',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  active?: number; // Optional, if not always provided

  @ApiProperty({
    description: 'Nbr of week to reach the desired goal'
  })
  @IsNumber()
  weeksToReachGoal: number;
}
