import { Injectable } from '@nestjs/common';
import { RecentWeatherRepository as RecentWeatherRedisRepository } from './recent.weather.repo';
import Redlock from 'redlock';
import { redLock } from '../../config/redis.config';
import { WeatherapiService } from '../weatherapi.service';
@Injectable()
export class WeatherProcessorService {
  private redlock: Redlock;
  private readonly LOCK_PREFIX = 'weather:lock:';
  private readonly LOCK_EXPIRATION_TIME = 5000;

  constructor(
    private readonly recentWeatherRedisRepository: RecentWeatherRedisRepository,
    private readonly weatherapiService: WeatherapiService,
  ) {
    this.redlock = redLock;
  }

  async getData(key: string) {
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

      await this.recentWeatherRedisRepository.setByCity(key, {
        key,
        value: weatherData,
      });
      return JSON.stringify(weatherData);
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
