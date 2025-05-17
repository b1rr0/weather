import { Module } from '@nestjs/common';
import { RecentWeatherRepository } from './recent.weather.repo';
import { WeatherapiService } from '../weatherapi.service';
import { WeatherProcessorService } from './weather.processorService.service';
@Module({
  providers: [
    WeatherProcessorService,
    RecentWeatherRepository,
    WeatherapiService,
  ],
  exports: [
    WeatherProcessorService,
    RecentWeatherRepository,
    WeatherapiService,
  ],
})
export class WeatherModule {}
