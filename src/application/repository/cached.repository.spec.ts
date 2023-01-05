import {
  Entity,
  NotFoundError,
  RepositoryInterface,
  UniqueEntityId,
} from '@root/domain';
import { v4 as uuid } from 'uuid';
import { CacheServiceInterface } from '../service';
import { CachedRepository } from './cached.repository';

interface FakeEntityProps {
  name: string;
}

class FakeEntity extends Entity<FakeEntityProps> {
  constructor(props: FakeEntityProps, id?: string) {
    const idValue = id || uuid();
    const uniqueEntityId = new UniqueEntityId(idValue);
    super(props, uniqueEntityId);
    this.props.name = props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get name(): string {
    return this.props.name;
  }
}

class FakeRepository implements RepositoryInterface<FakeEntity> {
  private entities: FakeEntity[] = [];

  async findAll(): Promise<FakeEntity[]> {
    return this.entities;
  }

  async delete(id: string | UniqueEntityId): Promise<void> {
    const idValue = id instanceof UniqueEntityId ? id.value : id;
    this.entities = this.entities.filter((e) => e.id !== idValue);
  }

  async findById(id: string | UniqueEntityId): Promise<FakeEntity> {
    const idValue = id instanceof UniqueEntityId ? id.value : id;
    const entity = this.entities.find((e) => e.id === idValue);
    if (!entity) {
      throw new NotFoundError();
    }
    return entity;
  }

  async insert(entity: FakeEntity): Promise<void> {
    this.entities.push(entity);
  }

  async bulkInsert(entities: FakeEntity[]): Promise<void> {
    this.entities.push(...entities);
  }

  async update(entity: FakeEntity): Promise<void> {
    const index = this.entities.findIndex((e) => e.id === entity.id);
    if (index === -1) {
      throw new NotFoundError();
    }
    this.entities[index] = entity;
  }
}

class FakeCacheService implements CacheServiceInterface {
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

class FakeCachedRepository extends CachedRepository<FakeEntity> {
  constructor(
    cacheService: CacheServiceInterface,
    repository: RepositoryInterface<FakeEntity>
  ) {
    super(cacheService, repository);
  }
}

describe('CachedRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should cache findAll', async () => {
    const cacheService = new FakeCacheService();
    const repository = new FakeRepository();
    const findAllSpy = jest.spyOn(repository, 'findAll');
    const getSpy = jest.spyOn(cacheService, 'get');
    const cachedRepository = new FakeCachedRepository(cacheService, repository);
    const entity = new FakeEntity(
      { name: 'test' },
      '7c195903-6ef3-43ed-b181-0ccb14876e28'
    );
    await repository.insert(entity);
    const cachedEntities = await cachedRepository.findAll();
    expect(cachedEntities).toEqual([entity]);
    const cachedEntities2 = await cachedRepository.findAll();
    expect(cachedEntities2).toEqual([entity]);
    expect(findAllSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenNthCalledWith(2, 'FakeCachedRepository:_list');
    expect(cacheService).toMatchSnapshot();
  });

  it('should cache findById', async () => {
    const cacheService = new FakeCacheService();
    const repository = new FakeRepository();
    const findByIdSpy = jest.spyOn(repository, 'findById');
    const getSpy = jest.spyOn(cacheService, 'get');
    const cachedRepository = new FakeCachedRepository(cacheService, repository);
    const entity = new FakeEntity(
      { name: 'test' },
      '7c195903-6ef3-43ed-b181-0ccb14876e28'
    );
    await repository.insert(entity);
    const cachedEntity = await cachedRepository.findById(entity.id);
    expect(cachedEntity).toEqual(entity);
    const cachedEntity2 = await cachedRepository.findById(entity.id);
    expect(cachedEntity2).toEqual(entity);
    expect(findByIdSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenNthCalledWith(
      2,
      `FakeCachedRepository:find_id:${entity.id}`
    );
    expect(cacheService).toMatchSnapshot();
  });

  it('should cache insert and invalidate find_all', async () => {
    const cacheService = new FakeCacheService();
    const repository = new FakeRepository();
    const insertSpy = jest.spyOn(repository, 'insert');
    const setSpy = jest.spyOn(cacheService, 'set');
    const deleteSpy = jest.spyOn(cacheService, 'delete');
    const cachedRepository = new FakeCachedRepository(cacheService, repository);
    const entity = new FakeEntity(
      { name: 'test' },
      '7c195903-6ef3-43ed-b181-0ccb14876e28'
    );
    await cachedRepository.insert(entity);
    expect(insertSpy).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenNthCalledWith(
      1,
      `FakeCachedRepository:find_id:${entity.id}`,
      entity
    );
    expect(deleteSpy).toHaveBeenNthCalledWith(1, 'FakeCachedRepository:_list');
    expect(cacheService).toMatchSnapshot();
  });

  it('should cache update and invalidate find_all', async () => {
    const cacheService = new FakeCacheService();
    const repository = new FakeRepository();
    const updateSpy = jest.spyOn(repository, 'update');
    const setSpy = jest.spyOn(cacheService, 'set');
    const deleteSpy = jest.spyOn(cacheService, 'delete');
    const cachedRepository = new FakeCachedRepository(cacheService, repository);
    const entity = new FakeEntity(
      { name: 'test' },
      '7c195903-6ef3-43ed-b181-0ccb14876e28'
    );
    await cachedRepository.insert(entity);
    entity.name = 'test2';
    await cachedRepository.update(entity);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenNthCalledWith(
      2,
      `FakeCachedRepository:find_id:${entity.id}`,
      entity
    );
    expect(deleteSpy).toHaveBeenNthCalledWith(1, 'FakeCachedRepository:_list');
    const cachedEntity = await cachedRepository.findById(entity.id);
    expect(cachedEntity).toEqual(entity);
    expect(cachedEntity.name).toBe('test2');
    expect(cacheService).toMatchSnapshot();
  });

  it('should cache delete and invalidate find_all', async () => {
    const cacheService = new FakeCacheService();
    const repository = new FakeRepository();
    const deleteRepoSpy = jest.spyOn(repository, 'delete');
    const setSpy = jest.spyOn(cacheService, 'set');
    const deleteSpy = jest.spyOn(cacheService, 'delete');
    const cachedRepository = new FakeCachedRepository(cacheService, repository);
    const entity = new FakeEntity(
      { name: 'test' },
      '7c195903-6ef3-43ed-b181-0ccb14876e28'
    );
    await cachedRepository.insert(entity);
    await cachedRepository.delete(entity.id);
    expect(deleteRepoSpy).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenNthCalledWith(
      1,
      `FakeCachedRepository:find_id:${entity.id}`,
      entity
    );
    expect(deleteSpy).toHaveBeenNthCalledWith(1, 'FakeCachedRepository:_list');
    expect(deleteSpy).toHaveBeenNthCalledWith(
      2,
      `FakeCachedRepository:find_id:${entity.id}`
    );
    expect(() => cachedRepository.findById(entity.id)).rejects.toThrowError(
      NotFoundError
    );
    expect(cacheService).toMatchSnapshot();
  });

  it('should cache bulkInsert and invalidate find_all', async () => {
    const cacheService = new FakeCacheService();
    const repository = new FakeRepository();
    const bukInsertSpy = jest.spyOn(repository, 'bulkInsert');
    const setSpy = jest.spyOn(cacheService, 'set');
    const deleteSpy = jest.spyOn(cacheService, 'delete');
    const cachedRepository = new FakeCachedRepository(cacheService, repository);
    const entity = new FakeEntity(
      { name: 'test' },
      '7c195903-6ef3-43ed-b181-0ccb14876e28'
    );
    const entity2 = new FakeEntity(
      { name: 'test2' },
      '088f6493-f1d4-47ec-b922-7c7a6655f02e'
    );
    await cachedRepository.bulkInsert([entity, entity2]);
    expect(bukInsertSpy).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenNthCalledWith(
      1,
      `FakeCachedRepository:find_id:${entity.id}`,
      entity
    );
    expect(setSpy).toHaveBeenNthCalledWith(
      2,
      `FakeCachedRepository:find_id:${entity2.id}`,
      entity2
    );
    expect(deleteSpy).toHaveBeenNthCalledWith(1, 'FakeCachedRepository:_list');
    expect(cacheService).toMatchSnapshot();
  });
});
