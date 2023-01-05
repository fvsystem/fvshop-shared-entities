import { CachedRepository } from '@root/application/repository';
import { Entity, RepositoryInterface } from '@root/domain';
import { CacheServiceIoRedis } from '@root/infrastructure/cache';
import { RedisOptions } from 'ioredis';

export abstract class CachedRepositoryIoRedis<
  E extends Entity
> extends CachedRepository<E> {
  constructor(options: RedisOptions, repository: RepositoryInterface<E>) {
    const cache = new CacheServiceIoRedis(options);
    super(cache, repository);
  }
}
