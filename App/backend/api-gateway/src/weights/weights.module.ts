import { Module } from '@nestjs/common';
import { WeightService } from './weights.service';
import { WeightController } from './weights.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [WeightController],
  providers: [WeightService],
})
export class WeightsModule {}
