import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailingService {
  private transporter;

  constructor() {
    // Configure the transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, // Replace with your SMTP host
      port: parseInt(process.env.MAIL_PORT), // Replace with your SMTP port
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME, // Your SMTP user
        pass: process.env.MAIL_PASSWORD, // Your SMTP password
      },
     
      tls: {
        rejectUnauthorized: false,
      },
    });
    
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `http://localhost:3000/auth/verify-email?email=${email}&token=${token}`;

    const mailOptions = {
      from: '"Better Me" <betterme@jmdwebdev.com>',
      to:email,
      subject: 'Vérification Email',
      html: `<p>Merci de cliquer sur le lien <a href="${verificationUrl}">suivant</a> pour vérifer votre Email .</p>`,
    };
   
  //   this.transporter.verify(function (error, success) {
  //   if (error) {
  //     console.error('SMTP connection error:', error);
  //   } else {
  //     console.log('SMTP server is ready to take messages', success);
  //   }
  //  })

    await this.transporter.sendMail(mailOptions);
  }

  async sendWeightReminderEmail(email: string): Promise<void> {
    const mailOptions = {
      from: '"Better Me" <betterme@jmdwebdev.com>',
      to: email,
      subject: 'Rappel de mise à jour de votre poids',
      html: `<p>N'oubliez pas d'entrer votre poid toutes les semaines pour un suivi plus efficace !</p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
