import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { CommonModule } from 'src/common/module/common.module';
import { PreferencesModule } from 'src/preferences/preferences.module';

@Module({
  controllers: [UsersController],
  exports: [UsersService],
  providers: [UsersService, PrismaService],
  imports: [CommonModule, PreferencesModule]
})
export class UsersModule {}
