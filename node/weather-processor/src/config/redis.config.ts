import { ConfigModule } from '@nestjs/config';
import { Redis } from 'ioredis';
import Redlock from 'redlock';

ConfigModule.forRoot();

const { REDIS_HOST } = process.env;

/**
 * Redis client instance, created for caching.\
 */
export const redisClient: Redis = new Redis({
  host: REDIS_HOST ?? 'localhost',
  port: 6379,
});

/**
 * Redlock instance, created for locking.
 */
export const redLock = new Redlock([redisClient], {
  driftFactor: 0.01,
  retryCount: 10,
  retryDelay: 200,
  retryJitter: 200,
});

/**
 * Expiration time for each entry saved in the cache, in seconds.
 * 900 seconds equals 15 minutes
 */
export const CACHE_ENTRY_EXPIRATION_TIME: number = 900;