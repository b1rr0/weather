import { BadRequestException, Injectable } from '@nestjs/common';
import { WeatherDto } from './dto/weather.dto';
import axios from 'axios';

@Injectable()
export class WeatherService {
  private readonly WEATHER_SERVICE_URL = 'http://localhost:3333';
  private readonly GET_WEATHER_URL = `${this.WEATHER_SERVICE_URL}/weather`;

  async getWeather(city: string): Promise<WeatherDto> {
    try {
      const response = await this.fetchWeatherData(city);
      return response.data;
    } catch (error) {
      this.handleWeatherError(error);
    }
  }

  private async fetchWeatherData(city: string) {
    return axios.get(this.GET_WEATHER_URL, {
      params: { city },
    });
  }

  private handleWeatherError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      if (
        error.response?.status === 404 ||
        error.response?.data?.error?.code === 1006
      ) {
        throw new BadRequestException('No matching location found.');
      }
    }
    throw error;
  }
}
