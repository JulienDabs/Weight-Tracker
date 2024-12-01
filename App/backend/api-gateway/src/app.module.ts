import { Logger, Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { WeightsModule } from './weights/weights.module';
import { AuthModule } from './auth/auth.module';
import { PreferencesModule } from './preferences/preferences.module';
import { ConfigModule } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    
    UsersModule, 
    WeightsModule, 
    AuthModule, 
    PreferencesModule
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule {}