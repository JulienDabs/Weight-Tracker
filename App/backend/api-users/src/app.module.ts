<<<<<<< HEAD
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
=======
import { Module, Logger } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/module/common.module';

@Module({
  imports: [CommonModule,UsersModule, AuthModule],
  controllers: [],  // Remove AppController if it's deleted
  providers: [Logger],  // Remove AppService if it's deleted, keep Logger
})
export class AppModule {}
>>>>>>> mailing-service
