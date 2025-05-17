import { Injectable } from '@nestjs/common';
import { WeatherDto } from './dto/weather.dto';

@Injectable()
export class WeatherService {
  async getWeather(city: string): Promise<WeatherDto> {
    return Promise.resolve({
      temperature: 20,
      humidity: 50,
      description: 'Sunny',
    });
  }
}
