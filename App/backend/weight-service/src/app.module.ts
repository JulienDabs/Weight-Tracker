import { Logger, Module } from '@nestjs/common';
import { WeightModule } from './weight/weight.module';
import { CommonModule } from './common/module/common.module';

@Module({
  imports: [CommonModule,WeightModule],
  controllers: [],
  providers: [Logger],
})
export class AppModule {}
