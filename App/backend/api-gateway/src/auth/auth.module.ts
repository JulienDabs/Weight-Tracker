import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    HttpModule.register({
      // Optional: Add any global Axios configuration here
      timeout: 50000,
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService] // Export the service if it will be used in other modules
})
export class AuthModule {}