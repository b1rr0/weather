import { Redis } from 'ioredis';

const { REDIS_HOST } = process.env;

/**
 * Redis client instance, created for caching.\
 */
export const redisClient: Redis = new Redis({
  host: REDIS_HOST ?? 'localhost',
  port: 6379,
});

/**
 * Expiration time for each entry saved in the cache, in seconds.
 * 900 seconds equals 15 minutes
 */
export const CACHE_ENTRY_EXPIRATION_TIME: number = 900;
