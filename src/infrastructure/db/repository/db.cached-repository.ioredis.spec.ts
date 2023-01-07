import { EntityMock, NotFoundError } from '@root/domain';
import { RepositoryMock } from '@root/domain/repository/repository.mock';
import { CachedRepositoryIoRedisMock } from './ioredis-cached.repository.mock';

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

describe('CachedRepositoryIoRedis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should cache findAll', async () => {
    const repository = new RepositoryMock();

    const findAllSpy = jest.spyOn(repository, 'findAll');
    const cachedRepository = new CachedRepositoryIoRedisMock(
      { host: 'localhost' },
      repository
    );
    const entity = new EntityMock(
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
      'CachedRepositoryIoRedisMock:_list'
    );
  });

  it('should cache findById', async () => {
    const repository = new RepositoryMock();
    const findByIdSpy = jest.spyOn(repository, 'findById');
    const cachedRepository = new CachedRepositoryIoRedisMock(
      { host: 'localhost' },
      repository
    );
    const entity = new EntityMock(
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
      `CachedRepositoryIoRedisMock:find_id:${entity.id}`
    );
  });

  it('should cache insert and invalidate find_all', async () => {
    const repository = new RepositoryMock();
    const insertSpy = jest.spyOn(repository, 'insert');
    const cachedRepository = new CachedRepositoryIoRedisMock(
      { host: 'localhost' },
      repository
    );
    const entity = new EntityMock(
      { name: 'test' },
      '7c195903-6ef3-43ed-b181-0ccb14876e28'
    );
    await cachedRepository.insert(entity);
    expect(insertSpy).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenNthCalledWith(
      1,
      `CachedRepositoryIoRedisMock:find_id:${entity.id}`,
      JSON.stringify(entity)
    );
    expect(mockDel).toHaveBeenNthCalledWith(
      1,
      'CachedRepositoryIoRedisMock:_list'
    );
  });

  it('should cache update and invalidate find_all', async () => {
    const repository = new RepositoryMock();
    const updateSpy = jest.spyOn(repository, 'update');
    const cachedRepository = new CachedRepositoryIoRedisMock(
      { host: 'localhost' },
      repository
    );
    const entity = new EntityMock(
      { name: 'test' },
      '7c195903-6ef3-43ed-b181-0ccb14876e28'
    );
    await cachedRepository.insert(entity);
    entity.name = 'test2';
    await cachedRepository.update(entity);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenNthCalledWith(
      2,
      `CachedRepositoryIoRedisMock:find_id:${entity.id}`,
      JSON.stringify(entity)
    );
    expect(mockDel).toHaveBeenNthCalledWith(
      1,
      'CachedRepositoryIoRedisMock:_list'
    );
    const cachedEntity = await cachedRepository.findById(entity.id);
    expect(JSON.stringify(cachedEntity)).toEqual(JSON.stringify(entity));
    expect(cachedEntity.name).toBe('test2');
  });

  it('should cache delete and invalidate find_all', async () => {
    const repository = new RepositoryMock();
    const deleteRepoSpy = jest.spyOn(repository, 'delete');
    const cachedRepository = new CachedRepositoryIoRedisMock(
      { host: 'localhost' },
      repository
    );
    const entity = new EntityMock(
      { name: 'test' },
      '7c195903-6ef3-43ed-b181-0ccb14876e28'
    );
    await cachedRepository.insert(entity);
    await cachedRepository.delete(entity.id);
    expect(deleteRepoSpy).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenNthCalledWith(
      1,
      `CachedRepositoryIoRedisMock:find_id:${entity.id}`,
      JSON.stringify(entity)
    );
    expect(mockDel).toHaveBeenNthCalledWith(
      1,
      'CachedRepositoryIoRedisMock:_list'
    );
    expect(mockDel).toHaveBeenNthCalledWith(
      2,
      `CachedRepositoryIoRedisMock:find_id:${entity.id}`
    );
    expect(() => cachedRepository.findById(entity.id)).rejects.toThrowError(
      NotFoundError
    );
  });

  it('should cache bulkInsert and invalidate find_all', async () => {
    const repository = new RepositoryMock();
    const bukInsertSpy = jest.spyOn(repository, 'bulkInsert');
    const cachedRepository = new CachedRepositoryIoRedisMock(
      { host: 'localhost' },
      repository
    );
    const entity = new EntityMock(
      { name: 'test' },
      '7c195903-6ef3-43ed-b181-0ccb14876e28'
    );
    const entity2 = new EntityMock(
      { name: 'test2' },
      '088f6493-f1d4-47ec-b922-7c7a6655f02e'
    );
    await cachedRepository.bulkInsert([entity, entity2]);
    expect(bukInsertSpy).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenNthCalledWith(
      1,
      `CachedRepositoryIoRedisMock:find_id:${entity.id}`,
      JSON.stringify(entity)
    );
    expect(mockSet).toHaveBeenNthCalledWith(
      2,
      `CachedRepositoryIoRedisMock:find_id:${entity2.id}`,
      JSON.stringify(entity2)
    );
    expect(mockDel).toHaveBeenNthCalledWith(
      1,
      'CachedRepositoryIoRedisMock:_list'
    );
  });
});
