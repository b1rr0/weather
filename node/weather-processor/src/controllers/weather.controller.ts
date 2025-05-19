import { Controller, Get, Query } from '@nestjs/common';
import { WeatherProcessorService } from '../domens/weather/weather.processor.service';

@Controller()
export class WeatherController {
  constructor(private readonly appService: WeatherProcessorService) {}

  @Get('weather')
  async getWeather(@Query('city') city: string) {
    return this.appService.getData(city);
  }
}
