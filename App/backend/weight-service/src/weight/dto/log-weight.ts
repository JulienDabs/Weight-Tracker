import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsPositive } from 'class-validator';

export class LogWeightDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  weight: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  userId: number;

  @IsDate()
  @Type(() => Date)
  date: Date;
}
