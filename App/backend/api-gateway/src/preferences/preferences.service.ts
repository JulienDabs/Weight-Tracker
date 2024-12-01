import { Injectable, Logger } from '@nestjs/common';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, map } from 'rxjs';
import { handleHttpError } from 'src/utils/errorHandler';

@Injectable()
export class PreferencesService {

  private readonly preferenceUrl: String;
  private readonly logger = new Logger(PreferencesService.name);

  constructor (
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.preferenceUrl = this.configService.get<string>('URL_PREFERENCES');

    if(!this.preferenceUrl) {
      this.logger.error('URL_PREFERENCE not found in environment variables');
      throw new Error('URL_PREFERENCE not found in environment variables');
    }
  }



  create(createPreferenceDto: CreatePreferenceDto) {
    return 'This action adds a new preference';
  }

  findAll() {
    return `This action returns all preferences`;
  }

  findOne(id: number) {
   try {
    const url = `${this.preferenceUrl}/${id}`; 
    return this.httpService.get(url).pipe(
      map((response) => response.data),
    ) ; 
  } catch (error) {
    handleHttpError(error, 'find a preference by user')
  }
}

  update(id: number, updatePreferenceDto: UpdatePreferenceDto) {
    return `This action updates a #${id} preference`;
  }

  remove(id: number) {
    return `This action removes a #${id} preference`;
  }
}
