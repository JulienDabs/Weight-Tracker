import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateWeightDto {
  @ApiProperty({ description: 'The date of the weight entry' })
  @IsDate()
  date: Date;

  @ApiProperty({ description: 'The weight value in kilograms' })
  @IsNumber()
  weight: number;

  @ApiProperty({ description: 'The ID of the user' })
  @IsString()
  userId: string;
}

