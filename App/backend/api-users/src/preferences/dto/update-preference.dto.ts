import { PartialType } from '@nestjs/swagger';
import { CreatePreferencesDTO } from './create-preference.dto';

export class UpdatePreferenceDto extends PartialType(CreatePreferencesDTO) {}
