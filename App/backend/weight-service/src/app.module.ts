import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeightModule } from './weight/weight.module';

@Module({
  imports: [WeightModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
