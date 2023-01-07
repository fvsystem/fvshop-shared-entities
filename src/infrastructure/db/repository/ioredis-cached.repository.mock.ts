/* istanbul ignore file */

import { EntityMock, RepositoryInterface } from '@root/domain';
import { RedisOptions } from 'ioredis';
import { CachedRepositoryIoRedis } from './db.cached-repository.ioredis';

export class CachedRepositoryIoRedisMock extends CachedRepositoryIoRedis<EntityMock> {
  constructor(
    options: RedisOptions,
    repository: RepositoryInterface<EntityMock>
  ) {
    super(options, repository);
  }
}
