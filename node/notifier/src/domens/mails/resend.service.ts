import { Injectable } from '@nestjs/common';
import { CreateEmailOptions, Resend } from 'resend';
import { MailsService } from './mails.service';
import { WeatherWithCityDto } from '../weather/dto/weather.dto';

@Injectable()
export class ResendService implements MailsService {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend('re_KMywtJJ1_PnK5y8QcZ2DG5wRJbHymFb42');
  }

  async sendWeatherMail(
    email: string,
    weather: WeatherWithCityDto,
  ): Promise<void> {
    const subject = 'Weather Notification';
    const content = `<p>Hello ${email},</p>
    <p>The weather in ${weather.city} is ${weather.temperature}°C and ${weather.description}</p>
    <p>Thank you</p>
    `;
    await this.sendMail(email, subject, content);
  }

  async sendRegistrationMail(email: string, token: string): Promise<void> {
    const subject = 'Registration Notification';
    const content = `<p>Hello ${email},</p>
    <p>Your token is ${token}</p>
    <p>Please use it to login</p>
    <p>Thank you</p>
    `;
    await this.sendMail(email, subject, content);
  }

  private async sendMail(
    email: string,
    subject: string,
    content: string,
  ): Promise<void> {
    const mailOptions: CreateEmailOptions = {
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: subject,
      html: content,
    };
    await this.resend.emails.send(mailOptions);
  }
}
