import { Module, Logger } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/module/common.module';
import { PreferencesModule } from './preferences/preferences.module';

@Module({
  imports: [CommonModule,UsersModule, AuthModule, PreferencesModule],
  controllers: [],  // Remove AppController if it's deleted
  providers: [Logger],  // Remove AppService if it's deleted, keep Logger
})
export class AppModule {}