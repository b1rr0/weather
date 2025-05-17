import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { WeatherModule } from './domens/weather/weather.module';

@Module({
  controllers: [AppController],
  providers: [WeatherModule],
})
export class AppModule {}
