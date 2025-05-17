import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import {
  CACHE_ENTRY_EXPIRATION_TIME,
  redisClient,
} from '../../config/redis.config';
import { WeatherDto } from './dto/weather.dto';

@Injectable()
export class RecentWeatherRepository {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = redisClient;
  }

  async getByCity(city: string): Promise<WeatherDto | null> {
    const data = await this.redisClient.get(city);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  }

  async setByCity(city: string, data: WeatherDto) {
    return this.redisClient.set(
      city,
      JSON.stringify(data),
      'EX',
      CACHE_ENTRY_EXPIRATION_TIME,
    );
  }
}
