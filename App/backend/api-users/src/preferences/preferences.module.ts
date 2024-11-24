import { Module } from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { PreferencesController } from './preferences.controller';
import { PrismaService } from 'src/prisma.service';
import { CommonModule } from 'src/common/module/common.module';

@Module({
  controllers: [PreferencesController],
  exports: [PreferencesService],
  providers: [PreferencesService, PrismaService],
  imports: [CommonModule],
})
export class PreferencesModule {}
