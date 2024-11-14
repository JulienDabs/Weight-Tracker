import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { WeightService } from './weight.service';
import { CreateWeightDto } from './dto/create-weight.dto';
import { UpdateWeightDto } from './dto/update-weight.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('weight')
export class WeightController {
  constructor(private readonly weightService: WeightService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new Weight' })
  @ApiBody({ type: CreateWeightDto })
  @ApiResponse({ status: 201, description: 'The Weight has been successfully created.', type: CreateWeightDto })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createWeightDto: CreateWeightDto) {
    return this.weightService.create(createWeightDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Weights' })
  @ApiResponse({ status: 200, description: 'Return all Weights.', type: [CreateWeightDto] })
  findAll() {
    return this.weightService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Weight by id' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Return the Weight.', type: CreateWeightDto })
  @ApiResponse({ status: 404, description: 'Weight not found.' })
  findOne(@Param('id') id: string) {
    return this.weightService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Weight' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: UpdateWeightDto })
  @ApiResponse({ status: 200, description: 'The Weight has been successfully updated.', type: UpdateWeightDto })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Weight not found.' })
  update(@Param('id') id: string, @Body() updateWeightDto: UpdateWeightDto) {
    return this.weightService.update(+id, updateWeightDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Weight' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'The Weight has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Weight not found.' })
  remove(@Param('id') id: string) {
    return this.weightService.remove(+id);
  }
}
