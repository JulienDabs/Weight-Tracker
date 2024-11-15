import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
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
  @ApiResponse({
    status: 201,
    description: 'The Weight has been successfully created.',
    type: CreateWeightDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createWeightDto: CreateWeightDto) {
    return this.weightService.create(createWeightDto);
  }

  @Get('/user/:userid') // Correctly specify the route parameter
  @ApiOperation({ summary: 'Get all Weights from a user' })
  @ApiParam({ name: 'userid', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Return all Weights from a user.',
    type: [CreateWeightDto],
  })
  @ApiResponse({ status: 404, description: 'Weight not found.' })
  findAll(@Param('userid') userid: string) {
    return this.weightService.findAllByUserId(+userid);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Weight by id' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Return the Weight.',
    type: CreateWeightDto,
  })
  @ApiResponse({ status: 404, description: 'Weight not found.' })
  findOne(@Param('id') id: string) {
    return this.weightService.findOne(id);
  }
  @Get('bmi/:weight/:height')
  @ApiOperation({ summary: 'Calculate BMI based on weight and height' })
  @ApiParam({
    name: 'weight',
    description: 'The weight of the user in kilograms',
    type: Number,
  })
  @ApiParam({
    name: 'height',
    description: 'The height of the user in centimeters',
    type: Number,
  })
  getBMI(@Param('weight') weight: string, @Param('height') height: string): number {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (isNaN(weightNum) || isNaN(heightNum)) {
      throw new Error('Invalid input. Weight and height must be numbers.');
    }

    return this.weightService.calculateBMI(weightNum, heightNum);
  }
  


  @Patch(':id')
  @ApiOperation({ summary: 'Update a Weight' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: UpdateWeightDto })
  @ApiResponse({
    status: 200,
    description: 'The Weight has been successfully updated.',
    type: UpdateWeightDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Weight not found.' })
  update(@Param('id') id: string, @Body() updateWeightDto: UpdateWeightDto) {
    return this.weightService.update(id, updateWeightDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Weight' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The Weight has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Weight not found.' })
  remove(@Param('id') id: string) {
    return this.weightService.remove(id);
  }
}
