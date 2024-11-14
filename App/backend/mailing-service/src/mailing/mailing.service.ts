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

    const logo = ""

    const mailOptions = {
      from: '"Better Me" <nepasrepondre@betterme.com>',
      to: email,
      subject: 'Vérification Email',
      html: `
            <div style="font-family: 'Roboto', Arial, sans-serif; line-height: 1.5; color: #696969; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E1E4E8; border-radius: 8px;">
                <div style="text-align: center;">
                    <img src="../../assets/img/logo-png.png" alt="Better Me Logo" style="max-width: 150px; margin-bottom: 20px;">
                </div>
                <h2 style="color: #5ab5e5;">Vérification de votre Email</h2>
                <p>Bonjour,</p>
                <p>Merci de vous être inscrit à <strong>Better Me</strong>. Pour finaliser votre inscription et vérifier votre adresse email, veuillez cliquer sur le lien ci-dessous :</p>
                <p style="text-align: center; margin: 20px 0;">
                    <a href="${verificationUrl}" style="background-color: #5ab5e5; color: #FFFFFF; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Vérifier mon Email</a>
                </p>
                <p>Si vous n'avez pas créé de compte, veuillez ignorer cet email.</p>
                <p>Merci,</p>
                <p>L'équipe <strong>Better Me</strong></p>
            </div>
        `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendWeightReminderEmail(email: string): Promise<void> {
    const mailOptions = {
        from: '"Better Me" <betterme@jmdwebdev.com>',
        to: email,
        subject: 'Rappel de mise à jour de votre poids',
        html: `
            <div style="font-family: 'Roboto', Arial, sans-serif; line-height: 1.5; color: #2C3E50; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E1E4E8; border-radius: 8px;">
                <div style="text-align: center;">
                    <img src="../../assets/img/logo-png.png" alt="Better Me Logo" style="max-width: 150px; margin-bottom: 20px;">
                </div>
                <h2 style="color: #E74C3C;">Rappel de mise à jour de votre poids</h2>
                <p>Bonjour,</p>
                <p>N'oubliez pas d'entrer votre poids toutes les semaines pour un suivi plus efficace et pour rester motivé dans votre parcours de santé !</p>
                <p style="text-align: center; margin: 20px 0;">
                    <a href="http://localhost:3000/dashboard" style="background-color: #E74C3C; color: #FFFFFF; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Mettre à jour mon poids</a>
                </p>
                <p>Nous sommes là pour vous soutenir à chaque étape.</p>
                <p>Merci,</p>
                <p>L'équipe <strong>Better Me</strong></p>
            </div>
        `,
    };

    await this.transporter.sendMail(mailOptions);
}

}
