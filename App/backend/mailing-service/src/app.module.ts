import { Logger, Module } from '@nestjs/common';
import { MailingModule } from './mailing/mailing.module';

@Module({
  imports: [MailingModule],
  controllers: [],
  providers: [Logger],
})
export class AppModule {}
