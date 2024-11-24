import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { WeightService } from './weights.service';
import { CreateWeightDto } from './dto/create-weight.dto';
import { UpdateWeightDto } from './dto/update-weight.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('gateway/weight')
export class WeightController {
  constructor(private readonly weightService: WeightService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create a new Weight via the Gateway' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: String })
  @ApiResponse({
    status: 201,
    description: 'The Weight has been successfully created.',
  })
  async createWeight(
    @Param('userId') userId: string,
    @Body() createWeightDto: CreateWeightDto,
  ) {
    return this.weightService.createWeight(userId, createWeightDto);
  }

  @Get('/user/:userId')
  @ApiOperation({ summary: 'Get all Weights for a user via the Gateway' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: String })
  @ApiResponse({
    status: 200,
    description: 'Return all Weights for a user.',
  })
  async getAllWeights(@Param('userId') userId: string) {
    return this.weightService.getAllWeights(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Weight by ID via the Gateway' })
  @ApiParam({ name: 'id', description: 'ID of the weight record', type: String })
  @ApiResponse({
    status: 200,
    description: 'Return the Weight.',
  })
  async getWeightById(@Param('id') id: string) {
    return this.weightService.getWeightById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Weight via the Gateway' })
  @ApiParam({ name: 'id', description: 'ID of the weight record', type: String })
  @ApiResponse({
    status: 200,
    description: 'The Weight has been successfully updated.',
  })
  async updateWeight(
    @Param('id') id: string,
    @Body() updateWeightDto: UpdateWeightDto,
  ) {
    return this.weightService.updateWeight(id, updateWeightDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Weight via the Gateway' })
  @ApiParam({ name: 'id', description: 'ID of the weight record', type: String })
  @ApiResponse({
    status: 200,
    description: 'The Weight has been successfully deleted.',
  })
  async deleteWeight(@Param('id') id: string) {
    return this.weightService.deleteWeight(id);
  }
}
