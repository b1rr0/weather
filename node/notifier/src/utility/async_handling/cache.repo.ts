import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import {
  CACHE_ENTRY_EXPIRATION_TIME,
  redisClient,
} from '../../config/redis.config';

@Injectable()
export class CacheRepository {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = redisClient;
  }

  async get(key: string) {
    return this.redisClient.get(key);
  }

  async set(key: string) {
    return this.redisClient.set(key, 'true', 'EX', CACHE_ENTRY_EXPIRATION_TIME);
  }

  async delete(key: string) {
    return this.redisClient.del(key);
  }
}
