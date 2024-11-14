import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { CommonModule } from 'src/common/module/common.module';

@Module({
  controllers: [UsersController],
  exports: [UsersService],
  providers: [UsersService, PrismaService],
  imports: [CommonModule]
})
export class UsersModule {}
