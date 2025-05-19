import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { WeatherDto } from './dto/weather.dto';
import axios from 'axios';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly GET_WEATHER_URL = `${process.env.WEATHER_SERVICE_URL}/weather`;

  async getWeather(city: string): Promise<WeatherDto> {
    this.logger.debug(`Getting weather data for city: ${city}`);
    try {
      const response = await this.fetchWeatherData(city);
      this.logger.log(`Successfully retrieved weather data for ${city}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error getting weather data for ${city}`);
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
