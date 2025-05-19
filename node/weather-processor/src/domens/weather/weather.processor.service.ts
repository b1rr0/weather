import { Injectable } from '@nestjs/common';
import { RecentWeatherRepository as RecentWeatherRedisRepository } from './recent.weather.repo';
import Redlock from 'redlock';
import { redLock } from '../../config/redis.config';
import { WeatherapiService } from '../weatherapi.service';
import { WeatherDto } from './dto/weather.dto';
@Injectable()
export class WeatherProcessorService {
  private redlock: Redlock;
  private readonly LOCK_PREFIX = 'city:lock:';
  private readonly LOCK_EXPIRATION_TIME = 5000;

  constructor(
    private readonly recentWeatherRedisRepository: RecentWeatherRedisRepository,
    private readonly weatherapiService: WeatherapiService,
  ) {
    this.redlock = redLock;
  }

  async getData(key: string): Promise<WeatherDto> {
    const cachedData = await this.recentWeatherRedisRepository.getByCity(key);

    if (cachedData) {
      return cachedData;
    }
    const lock = await this.createLock(key);

    try {
      const doubleCheckData =
        await this.recentWeatherRedisRepository.getByCity(key);
      if (doubleCheckData) {
        return doubleCheckData;
      }

      const weatherData = await this.weatherapiService.calculateWeather(key);
      const weatherResponse: WeatherDto = {
        temperature: weatherData.temperature,
        description: weatherData.description,
        humidity: weatherData.humidity,
      };

      await this.recentWeatherRedisRepository.setByCity(key, weatherResponse);
      return weatherResponse;
    } finally {
      await lock.release();
    }
  }

  private async createLock(key: string) {
    const lockKey = `${this.LOCK_PREFIX}${key}`;
    const lock = await this.redlock.acquire(
      [lockKey],
      this.LOCK_EXPIRATION_TIME,
    );
    return lock;
  }
}
