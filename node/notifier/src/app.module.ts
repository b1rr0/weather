import { Module } from '@nestjs/common';
import { WeatherNotificationController } from './controllers/app.controller';
import { MailsModule } from './domens/mails/mails.module';
import { MailtraDemoApiService } from './domens/mails/resend.service';
import { WeatherModule } from './domens/weather/weather.module';
import { AsyncHandlingService } from './utility/async_handling/async_hendling.service';
import { AsyncHandlingModule } from './utility/async_handling/async_hendling.module';
@Module({
  imports: [MailsModule, WeatherModule, AsyncHandlingModule],
  controllers: [WeatherNotificationController],
  providers: [
    {
      provide: 'MailsService',
      useClass: MailtraDemoApiService,
    },
    AsyncHandlingService,
  ],
})
export class AppModule {}
