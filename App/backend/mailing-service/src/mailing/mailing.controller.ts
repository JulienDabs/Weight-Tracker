import { Controller, Post, Body, Get } from '@nestjs/common';
import { MailingService } from './mailing.service';

@Controller('mailing')
export class MailingController {
  constructor(private readonly mailingService: MailingService) {}

  @Post('send-verification-email')
  
  async sendVerificationEmail(@Body() body: { email: string; token: string }) {
    await this.mailingService.sendVerificationEmail(body.email, body.token);
    return { message: 'Verification email sent successfully' };
  }
}
