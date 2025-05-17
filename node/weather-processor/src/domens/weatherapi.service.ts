import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { WeatherDto } from './weather/dto/weather.dto';

@Injectable()
export class WeatherapiService {
  private readonly API_KEY = 'd5edf1e564154fbc88b224149251405';
  private readonly BASE_URL = 'http://api.weatherapi.com/v1/current.json';

  async calculateWeather(city: string): Promise<WeatherDto> {
    try {
      const response = await axios.get(`${this.BASE_URL}`, {
        params: {
          q: city,
          key: this.API_KEY,
          aqi: 'no',
        },
      });

      const weatherData: WeatherDto = {
        temperature: response.data.current.temp_c,
        humidity: response.data.current.humidity,
        description: response.data.current.condition.text,
      };

      return weatherData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('error', error);
        if (
          error.response?.status === 400 ||
          error.response?.data?.error?.code === 1006
        ) {
          throw new NotFoundException('No matching location found.');
        }
      }
      throw error;
    }
  }
}
