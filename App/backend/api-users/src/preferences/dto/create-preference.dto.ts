import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class CreatePreferencesDTO {
  @ApiProperty({
    description: 'The ID of the user associated with these preferences',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description:
      'Indicates if the terms and conditions have been complied with',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  tcComplied: boolean;

  @ApiProperty({
    description: 'The date when the terms and conditions were complied with',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDate()
  @IsNotEmpty()
  tcCompliedDate: Date;

  @ApiProperty({
    description: 'Indicates if the user is verified',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean = false;

  @ApiProperty({
    description: 'Indicates if the profile is completed',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  profileCompleted?: boolean = false;
}
