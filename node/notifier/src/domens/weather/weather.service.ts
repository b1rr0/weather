import { Injectable } from '@nestjs/common';
import { WeatherWithCityDto } from './dto/weather.dto';

@Injectable()
export class WeatherService {
  async getWeather(city: string): Promise<WeatherWithCityDto> {
    return Promise.resolve({
      temperature: 20,
      humidity: 50,
      description: 'Sunny',
      city: city,
    });
  }
}
