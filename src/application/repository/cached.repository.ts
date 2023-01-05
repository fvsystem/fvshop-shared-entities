import { Entity, RepositoryInterface, UniqueEntityId } from '@root/domain';
import { CacheServiceInterface } from '../service';

export abstract class CachedRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  protected readonly repository: RepositoryInterface<E>;

  protected readonly cache: CacheServiceInterface;

  protected readonly cacheKey: string;

  constructor(
    cache: CacheServiceInterface,
    repository: RepositoryInterface<E>
  ) {
    this.cache = cache;
    this.repository = repository;
    this.cacheKey = this.constructor.name;
  }

  async findAll(): Promise<E[]> {
    const list = await this.cache.get<E[]>(`${this.cacheKey}:_list`);
    if (list) {
      return list;
    }
    const entities = this.repository.findAll();
    await this.cache.set(`${this.cacheKey}:_list`, entities);
    return entities;
  }

  async update(entity: E): Promise<void> {
    await this.repository.update(entity);
    await Promise.all([
      this.cache.set(
        `${this.cacheKey}:find_id:${entity.id.toString()}`,
        entity
      ),
      this.cache.delete(`${this.cacheKey}:_list`),
    ]);
  }

  async delete(id: string | UniqueEntityId): Promise<void> {
    await this.repository.delete(id);
    await Promise.all([
      this.cache.delete(`${this.cacheKey}:find_id:${id.toString()}`),
      this.cache.delete(`${this.cacheKey}:_list`),
    ]);
  }

  async insert(entity: E): Promise<void> {
    await this.repository.insert(entity);
    await Promise.all([
      this.cache.set(
        `${this.cacheKey}:find_id:${entity.id.toString()}`,
        entity
      ),
      this.cache.delete(`${this.cacheKey}:_list`),
    ]);
  }

  async bulkInsert(entities: E[]): Promise<void> {
    await this.repository.bulkInsert(entities);
    await Promise.all([
      ...entities.map(async (entity) => {
        this.cache.set(
          `${this.cacheKey}:find_id:${entity.id.toString()}`,
          entity
        );
      }),
      this.cache.delete(`${this.cacheKey}:_list`),
    ]);
  }

  async findById(id: string | UniqueEntityId): Promise<E> {
    const entity = await this.cache.get<E>(
      `${this.cacheKey}:find_id:${id.toString()}`
    );
    if (entity) {
      return entity;
    }
    const entityFromDB = await this.repository.findById(id);
    await this.cache.set(
      `${this.cacheKey}:find_id:${id.toString()}`,
      entityFromDB
    );
    return entityFromDB;
  }
}
