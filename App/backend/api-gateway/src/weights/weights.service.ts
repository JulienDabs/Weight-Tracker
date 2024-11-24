import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateWeightDto } from './dto/create-weight.dto';
import { UpdateWeightDto } from './dto/update-weight.dto';

@Injectable()
export class WeightService {
  private readonly weightServiceUrl = process.env.URL_WEIGHT; // Load from .env

  constructor(private readonly httpService: HttpService) {}

  async createWeight(userId: string, createWeightDto: CreateWeightDto) {
    try {
      const url = `http://weight-service:3003/weight/${userId}`;
      
      const response = await firstValueFrom(
        this.httpService.post(url, createWeightDto),
      );
      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  async getAllWeights(userId: string) {
    try {
      const url = `${this.weightServiceUrl}/user/${userId}`;
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  async getWeightById(id: string) {
    try {
      const url = `${this.weightServiceUrl}/${id}`;
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      this.handleHttpError(error);
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
      this.handleHttpError(error);
    }
  }

  async deleteWeight(id: string) {
    try {
      const url = `${this.weightServiceUrl}/${id}`;
      const response = await firstValueFrom(this.httpService.delete(url));
      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  private handleHttpError(error: any) {
    if (error.response) {
      // Handle HTTP response errors
      throw new HttpException(
        error.response.data || 'Internal Server Error',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else if (error.request) {
      // Handle request errors (e.g., service unreachable)
      throw new HttpException(
        'Service Unreachable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    } else {
      // Handle other errors
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
