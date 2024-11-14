import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WeightService } from './weight.service';
import { CreateWeightDto } from './dto/create-weight.dto';
import { UpdateWeightDto } from './dto/update-weight.dto';

@Controller('weight')
export class WeightController {
  constructor(private readonly weightService: WeightService) {}

  @Post()
  create(@Body() createWeightDto: CreateWeightDto) {
    return this.weightService.create(createWeightDto);
  }

  @Get()
  findAll() {
    return this.weightService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.weightService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWeightDto: UpdateWeightDto) {
    return this.weightService.update(+id, updateWeightDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weightService.remove(+id);
  }
}
