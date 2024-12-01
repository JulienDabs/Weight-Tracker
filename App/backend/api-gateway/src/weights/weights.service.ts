import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateWeightDto } from './dto/create-weight.dto';
import { UpdateWeightDto } from './dto/update-weight.dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { handleHttpError } from 'src/utils/errorHandler';

@Injectable()
export class WeightService {
  private readonly weightServiceUrl: string;
  private readonly logger = new Logger(WeightService.name);

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.weightServiceUrl = this.configService.get<string>('URL_WEIGHT');
    if (!this.weightServiceUrl) {
      this.logger.error(
        'URL_WEIGHT is not defined in the environment variables.',
      );
      throw new Error('Service configuration error: URL_WEIGHT is not defined');
    }
  }

  async createWeight(userId: string, createWeightDto: CreateWeightDto) {
    try {
      console.log('createWeightDto', createWeightDto);
      

      const url = `${this.weightServiceUrl}/${userId}`;
      const response = await firstValueFrom(
        this.httpService.post(url, createWeightDto),
      );
      return response.data;
    } catch (error) {
      handleHttpError(error, 'createWeight');
    }
  }

  async getAllWeights(userId: string) {
    try {
      const url = `${this.weightServiceUrl}/user/${userId}`;
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      handleHttpError(error, 'getAllWeights');
    }
  }

  async getWeightById(id: string) {
    try {
      const url = `${this.weightServiceUrl}/${id}`;
      const response = await axios.get(url); // Using axios directly

      console.log('Response from Axios' + response);
      return response.data; // Returning the data from the response
    } catch (error) {
      //console.log(error)
      handleHttpError(error, 'getWeightById');
    }
  }

  async updateWeight(id: string, updateWeightDto: UpdateWeightDto) {
    try {
      const url = `${this.weightServiceUrl}/${id}`;
      const response = await firstValueFrom(
        this.httpService.patch(url, updateWeightDto),
      );
      return response.data;
    } catch (error) {
      handleHttpError(error, 'updateWeight');
    }
  }

  async deleteWeight(id: string) {
    try {
      const url = `${this.weightServiceUrl}/${id}`;
      const response = await firstValueFrom(this.httpService.delete(url));
      return response.data;
    } catch (error) {
      handleHttpError(error, 'deleteWeight');
    }
  }
}
