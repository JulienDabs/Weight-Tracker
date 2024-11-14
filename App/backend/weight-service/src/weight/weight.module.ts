import { Module } from '@nestjs/common';
import { WeightService } from './weight.service';
import { WeightController } from './weight.controller';
import { CommonModule } from 'src/common/module/common.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [WeightController],
  exports: [WeightService],
  providers: [WeightService, PrismaService],
  imports: [CommonModule]
})
export class WeightModule {}
