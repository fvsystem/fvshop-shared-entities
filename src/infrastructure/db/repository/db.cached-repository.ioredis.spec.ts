import {
  Entity,
  NotFoundError,
  RepositoryInterface,
  UniqueEntityId,
} from '@root/domain';
import { RedisOptions } from 'ioredis';
import { v4 as uuid } from 'uuid';
import { CachedRepositoryIoRedis } from './db.cached-repository.ioredis';

const mockGet = jest.fn();
const mockDel = jest.fn();
const mockFlushall = jest.fn();
const mockSet = jest.fn();

jest.mock('ioredis', () =>
  jest.fn().mockImplementation(() => ({
    get: mockGet,
    set: mockSet,
    del: mockDel,
    flushall: mockFlushall,
  }))
);

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

class FakeCachedRepositoryIoRedis extends CachedRepositoryIoRedis<FakeEntity> {
  constructor(
    options: RedisOptions,
    repository: RepositoryInterface<FakeEntity>
  ) {
    super(options, repository);
  }
}

describe('CachedRepositoryIoRedis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should cache findAll', async () => {
    const repository = new FakeRepository();

    const findAllSpy = jest.spyOn(repository, 'findAll');
    const cachedRepository = new FakeCachedRepositoryIoRedis(
      { host: 'localhost' },
      repository
    );
    const entity = new FakeEntity(
      { name: 'test' },
      '7c195903-6ef3-43ed-b181-0ccb14876e28'
    );
    await repository.insert(entity);
    const cachedEntities = await cachedRepository.findAll();
    expect(cachedEntities).toEqual([entity]);
    mockGet.mockResolvedValueOnce(JSON.stringify([entity]));
    const cachedEntities2 = await cachedRepository.findAll();
    expect(JSON.stringify(cachedEntities2)).toEqual(JSON.stringify([entity]));
    expect(findAllSpy).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenNthCalledWith(
      2,
      'FakeCachedRepositoryIoRedis:_list'
    );
  });

  it('should cache findById', async () => {
    const repository = new FakeRepository();
    const findByIdSpy = jest.spyOn(repository, 'findById');
    const cachedRepository = new FakeCachedRepositoryIoRedis(
      { host: 'localhost' },
      repository
    );
    const entity = new FakeEntity(
      { name: 'test' },
      '7c195903-6ef3-43ed-b181-0ccb14876e28'
    );
    await repository.insert(entity);
    const cachedEntity = await cachedRepository.findById(entity.id);
    expect(cachedEntity).toEqual(entity);
    mockGet.mockResolvedValueOnce(JSON.stringify(entity));
    const cachedEntity2 = await cachedRepository.findById(entity.id);
    expect(JSON.stringify(cachedEntity2)).toEqual(JSON.stringify(entity));
    expect(cachedEntity2.id).toEqual(entity.id);
    expect(cachedEntity2.name).toEqual(entity.name);
    expect(findByIdSpy).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenNthCalledWith(
      2,
      `FakeCachedRepositoryIoRedis:find_id:${entity.id}`
    );
  });

  it('should cache insert and invalidate find_all', async () => {
    const repository = new FakeRepository();
    const insertSpy = jest.spyOn(repository, 'insert');
    const cachedRepository = new FakeCachedRepositoryIoRedis(
      { host: 'localhost' },
      repository
    );
    const entity = new FakeEntity(
      { name: 'test' },
      '7c195903-6ef3-43ed-b181-0ccb14876e28'
    );
    await cachedRepository.insert(entity);
    expect(insertSpy).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenNthCalledWith(
      1,
      `FakeCachedRepositoryIoRedis:find_id:${entity.id}`,
      JSON.stringify(entity)
    );
    expect(mockDel).toHaveBeenNthCalledWith(
      1,
      'FakeCachedRepositoryIoRedis:_list'
    );
  });

  it('should cache update and invalidate find_all', async () => {
    const repository = new FakeRepository();
    const updateSpy = jest.spyOn(repository, 'update');
    const cachedRepository = new FakeCachedRepositoryIoRedis(
      { host: 'localhost' },
      repository
    );
    const entity = new FakeEntity(
      { name: 'test' },
      '7c195903-6ef3-43ed-b181-0ccb14876e28'
    );
    await cachedRepository.insert(entity);
    entity.name = 'test2';
    await cachedRepository.update(entity);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenNthCalledWith(
      2,
      `FakeCachedRepositoryIoRedis:find_id:${entity.id}`,
      JSON.stringify(entity)
    );
    expect(mockDel).toHaveBeenNthCalledWith(
      1,
      'FakeCachedRepositoryIoRedis:_list'
    );
    const cachedEntity = await cachedRepository.findById(entity.id);
    expect(JSON.stringify(cachedEntity)).toEqual(JSON.stringify(entity));
    expect(cachedEntity.name).toBe('test2');
  });

  it('should cache delete and invalidate find_all', async () => {
    const repository = new FakeRepository();
    const deleteRepoSpy = jest.spyOn(repository, 'delete');
    const cachedRepository = new FakeCachedRepositoryIoRedis(
      { host: 'localhost' },
      repository
    );
    const entity = new FakeEntity(
      { name: 'test' },
      '7c195903-6ef3-43ed-b181-0ccb14876e28'
    );
    await cachedRepository.insert(entity);
    await cachedRepository.delete(entity.id);
    expect(deleteRepoSpy).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenNthCalledWith(
      1,
      `FakeCachedRepositoryIoRedis:find_id:${entity.id}`,
      JSON.stringify(entity)
    );
    expect(mockDel).toHaveBeenNthCalledWith(
      1,
      'FakeCachedRepositoryIoRedis:_list'
    );
    expect(mockDel).toHaveBeenNthCalledWith(
      2,
      `FakeCachedRepositoryIoRedis:find_id:${entity.id}`
    );
    expect(() => cachedRepository.findById(entity.id)).rejects.toThrowError(
      NotFoundError
    );
  });

  it('should cache bulkInsert and invalidate find_all', async () => {
    const repository = new FakeRepository();
    const bukInsertSpy = jest.spyOn(repository, 'bulkInsert');
    const cachedRepository = new FakeCachedRepositoryIoRedis(
      { host: 'localhost' },
      repository
    );
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
    expect(mockSet).toHaveBeenNthCalledWith(
      1,
      `FakeCachedRepositoryIoRedis:find_id:${entity.id}`,
      JSON.stringify(entity)
    );
    expect(mockSet).toHaveBeenNthCalledWith(
      2,
      `FakeCachedRepositoryIoRedis:find_id:${entity2.id}`,
      JSON.stringify(entity2)
    );
    expect(mockDel).toHaveBeenNthCalledWith(
      1,
      'FakeCachedRepositoryIoRedis:_list'
    );
  });
});
