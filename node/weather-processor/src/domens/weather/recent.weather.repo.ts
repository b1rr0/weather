import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import {
  CACHE_ENTRY_EXPIRATION_TIME,
  redisClient,
} from '../../config/redis.config';

@Injectable()
export class RecentWeatherRepository {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = redisClient;
  }

  async getByCity(city: string) {
    return this.redisClient.get(city);
  }

  async setByCity(city: string, data: any) {
    return this.redisClient.set(
      city,
      JSON.stringify(data),
      'EX',
      CACHE_ENTRY_EXPIRATION_TIME,
    );
  }
}
