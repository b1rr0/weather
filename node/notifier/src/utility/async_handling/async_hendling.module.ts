import { Module } from '@nestjs/common';
import { CacheRepository } from './cache.repo';
import { AsyncHandlingService } from './async_hendling.service';
import { WeatherService } from 'src/domens/weather/weather.service';
import { MailtraDemoApiService } from 'src/domens/mails/mailtra.demo.service';
@Module({
  imports: [],
  providers: [
    CacheRepository,
    AsyncHandlingService,
    WeatherService,
    {
      provide: 'MailsService',
      useClass: MailtraDemoApiService,
    },
  ],
  exports: [
    CacheRepository,
    AsyncHandlingService,
    WeatherService,
    {
      provide: 'MailsService',
      useClass: MailtraDemoApiService,
    },
  ],
})
export class AsyncHandlingModule {}
