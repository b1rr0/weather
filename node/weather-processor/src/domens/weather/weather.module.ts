import { Module } from '@nestjs/common';
import { WeatherProcessorService } from './weather.processorService.service';
import { RecentWeatherRepository } from './recent.weather.repo';
import { WeatherapiService } from '../weatherapi.service';

@Module({
  providers: [
    WeatherProcessorService,
    RecentWeatherRepository,
    WeatherapiService,
  ],
})
export class WeatherModule {}
