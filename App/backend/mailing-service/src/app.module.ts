import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailingModule } from './mailing/mailing.module';

@Module({
  imports: [MailingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
