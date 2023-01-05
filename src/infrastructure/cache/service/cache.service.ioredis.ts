import Redis, { RedisOptions } from 'ioredis';
import { CacheServiceInterface } from '@root/application';

export class CacheServiceIoRedis implements CacheServiceInterface {
  private readonly redis: Redis;

  constructor(options: RedisOptions) {
    this.redis = new Redis(options);
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async set<T = unknown>(
    key: string,
    value: T,
    ttlInSeconds?: number
  ): Promise<void> {
    if (ttlInSeconds) {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttlInSeconds);
    } else {
      await this.redis.set(key, JSON.stringify(value));
    }
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async clear(): Promise<void> {
    await this.redis.flushall();
  }
}
