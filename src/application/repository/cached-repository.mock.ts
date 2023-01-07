/* istanbul ignore file */

import { EntityMock, RepositoryInterface } from '@root/domain';
import { CacheServiceInterface } from '../service';
import { CachedRepository } from './cached.repository';

export class CachedRepositoryMock extends CachedRepository<EntityMock> {
  constructor(
    cacheService: CacheServiceInterface,
    repository: RepositoryInterface<EntityMock>
  ) {
    super(cacheService, repository);
  }
}
