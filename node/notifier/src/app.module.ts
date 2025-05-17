import { Module } from '@nestjs/common';
import { WeatherNotificationController } from './controllers/app.controller';
import { MailsModule } from './domens/mails/mails.module';
import { ResendService } from './domens/mails/resend.service';
import { WeatherModule } from './domens/weather/weather.module';
@Module({
  imports: [MailsModule, WeatherModule],
  controllers: [WeatherNotificationController],
  providers: [
    {
      provide: 'MailsService',
      useClass: ResendService,
    },
  ],
})
export class AppModule {}
