import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Module({
  imports: [],
  controllers: [],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
