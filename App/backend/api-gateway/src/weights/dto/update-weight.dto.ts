import { PartialType } from '@nestjs/mapped-types';
import { CreateWeightDto } from '../dto/create-weight.dto';

export class UpdateWeightDto extends PartialType(CreateWeightDto) {}
