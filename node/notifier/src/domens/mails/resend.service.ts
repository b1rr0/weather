import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailsService } from './mails.service';
import { WeatherWithCityDto } from '../weather/dto/weather.dto';

@Injectable()
export class MailtraDemoApiService implements MailsService {
  private readonly transport: nodemailer.Transporter;
  logger = new Logger(MailtraDemoApiService.name);

  constructor() {
    this.transport = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '18db126378bbd8',
        pass: '7106eed43b0fa3',
      },
    });
  }

  async sendWeatherMail(
    email: string,
    weather: WeatherWithCityDto,
  ): Promise<void> {
    const subject = 'Weather Notification';
    const content = `<p>Hello ${email},</p>
    <p>The weather in ${weather.city} is ${weather.temperature}°C ${weather.humidity}% and ${weather.description}</p>
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
    const mailOptions = {
      from: 'Acme <noreply@example.com>',
      to: email,
      subject: subject,
      html: content,
    };
    // thats work with DemoApi so u cant see real message:(
    this.logger.debug(mailOptions);
    await this.transport.sendMail(mailOptions);
  }
}
