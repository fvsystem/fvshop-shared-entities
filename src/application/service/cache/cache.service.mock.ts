/* istanbul ignore file */

import { CacheServiceInterface } from './cache.service.interface';

export class CacheServiceMock implements CacheServiceInterface {
  private cache: Record<string, any> = {};

  async get<T = unknown>(key: string): Promise<T | null> {
    const value = this.cache[key];
    if (value) {
      return value as T;
    }
    return null;
  }

  async set<T = unknown>(
    key: string,
    value: T,
    ttlInSeconds?: number
  ): Promise<void> {
    this.cache[key] = value;
  }

  async delete(key: string): Promise<void> {
    this.cache[key] = undefined;
  }

  async clear(): Promise<void> {
    this.cache = {};
  }
}
