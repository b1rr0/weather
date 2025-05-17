import { Module } from '@nestjs/common';
import { WeatherController } from './controllers/weather.controller';
import { WeatherModule } from './domens/weather/weather.module';

@Module({
  imports: [WeatherModule],
  controllers: [WeatherController],
  providers: [WeatherModule],
})
export class AppModule {}
