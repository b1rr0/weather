import { BadRequestException, Injectable } from '@nestjs/common';
import { WeatherDto, WeatherWithCityDto } from './dto/weather.dto';
import axios from 'axios';
@Injectable()
export class WeatherService {
  private readonly WEATHER_SERVICE_URL = process.env.WEATHER_SERVICE_URL;
  private readonly GET_WEATHER_URL = `${this.WEATHER_SERVICE_URL}/weather`;

  async getWeather(city: string): Promise<WeatherWithCityDto> {
    try {
      const response = await this.fetchWeatherData(city);
      return { ...response, city: city };
    } catch (error) {
      this.handleWeatherError(error);
    }
  }

  private async fetchWeatherData(city: string): Promise<WeatherDto> {
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
