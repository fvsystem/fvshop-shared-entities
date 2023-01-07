import { EntityMock, NotFoundError, RepositoryMock } from '@root/domain';
import { CacheServiceMock } from '../service/cache/cache.service.mock';
import { CachedRepositoryMock } from './cached-repository.mock';

describe('CachedRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should cache findAll', async () => {
    const cacheService = new CacheServiceMock();
    const repository = new RepositoryMock();
    const findAllSpy = jest.spyOn(repository, 'findAll');
    const getSpy = jest.spyOn(cacheService, 'get');
    const cachedRepository = new CachedRepositoryMock(cacheService, repository);
    const entity = new EntityMock(
      { name: 'test' },
      '7c195903-6ef3-43ed-b181-0ccb14876e28'
    );
    await repository.insert(entity);
    const cachedEntities = await cachedRepository.findAll();
    expect(cachedEntities).toEqual([entity]);
    const cachedEntities2 = await cachedRepository.findAll();
    expect(cachedEntities2).toEqual([entity]);
    expect(findAllSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenNthCalledWith(2, 'CachedRepositoryMock:_list');
    expect(cacheService).toMatchSnapshot();
  });

  it('should cache findById', async () => {
    const cacheService = new CacheServiceMock();
    const repository = new RepositoryMock();
    const findByIdSpy = jest.spyOn(repository, 'findById');
    const getSpy = jest.spyOn(cacheService, 'get');
    const cachedRepository = new CachedRepositoryMock(cacheService, repository);
    const entity = new EntityMock(
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
      `CachedRepositoryMock:find_id:${entity.id}`
    );
    expect(cacheService).toMatchSnapshot();
  });

  it('should cache insert and invalidate find_all', async () => {
    const cacheService = new CacheServiceMock();
    const repository = new RepositoryMock();
    const insertSpy = jest.spyOn(repository, 'insert');
    const setSpy = jest.spyOn(cacheService, 'set');
    const deleteSpy = jest.spyOn(cacheService, 'delete');
    const cachedRepository = new CachedRepositoryMock(cacheService, repository);
    const entity = new EntityMock(
      { name: 'test' },
      '7c195903-6ef3-43ed-b181-0ccb14876e28'
    );
    await cachedRepository.insert(entity);
    expect(insertSpy).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenNthCalledWith(
      1,
      `CachedRepositoryMock:find_id:${entity.id}`,
      entity
    );
    expect(deleteSpy).toHaveBeenNthCalledWith(1, 'CachedRepositoryMock:_list');
    expect(cacheService).toMatchSnapshot();
  });

  it('should cache update and invalidate find_all', async () => {
    const cacheService = new CacheServiceMock();
    const repository = new RepositoryMock();
    const updateSpy = jest.spyOn(repository, 'update');
    const setSpy = jest.spyOn(cacheService, 'set');
    const deleteSpy = jest.spyOn(cacheService, 'delete');
    const cachedRepository = new CachedRepositoryMock(cacheService, repository);
    const entity = new EntityMock(
      { name: 'test' },
      '7c195903-6ef3-43ed-b181-0ccb14876e28'
    );
    await cachedRepository.insert(entity);
    entity.name = 'test2';
    await cachedRepository.update(entity);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenNthCalledWith(
      2,
      `CachedRepositoryMock:find_id:${entity.id}`,
      entity
    );
    expect(deleteSpy).toHaveBeenNthCalledWith(1, 'CachedRepositoryMock:_list');
    const cachedEntity = await cachedRepository.findById(entity.id);
    expect(cachedEntity).toEqual(entity);
    expect(cachedEntity.name).toBe('test2');
    expect(cacheService).toMatchSnapshot();
  });

  it('should cache delete and invalidate find_all', async () => {
    const cacheService = new CacheServiceMock();
    const repository = new RepositoryMock();
    const deleteRepoSpy = jest.spyOn(repository, 'delete');
    const setSpy = jest.spyOn(cacheService, 'set');
    const deleteSpy = jest.spyOn(cacheService, 'delete');
    const cachedRepository = new CachedRepositoryMock(cacheService, repository);
    const entity = new EntityMock(
      { name: 'test' },
      '7c195903-6ef3-43ed-b181-0ccb14876e28'
    );
    await cachedRepository.insert(entity);
    await cachedRepository.delete(entity.id);
    expect(deleteRepoSpy).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenNthCalledWith(
      1,
      `CachedRepositoryMock:find_id:${entity.id}`,
      entity
    );
    expect(deleteSpy).toHaveBeenNthCalledWith(1, 'CachedRepositoryMock:_list');
    expect(deleteSpy).toHaveBeenNthCalledWith(
      2,
      `CachedRepositoryMock:find_id:${entity.id}`
    );
    expect(() => cachedRepository.findById(entity.id)).rejects.toThrowError(
      NotFoundError
    );
    expect(cacheService).toMatchSnapshot();
  });

  it('should cache bulkInsert and invalidate find_all', async () => {
    const cacheService = new CacheServiceMock();
    const repository = new RepositoryMock();
    const bukInsertSpy = jest.spyOn(repository, 'bulkInsert');
    const setSpy = jest.spyOn(cacheService, 'set');
    const deleteSpy = jest.spyOn(cacheService, 'delete');
    const cachedRepository = new CachedRepositoryMock(cacheService, repository);
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
    expect(setSpy).toHaveBeenNthCalledWith(
      1,
      `CachedRepositoryMock:find_id:${entity.id}`,
      entity
    );
    expect(setSpy).toHaveBeenNthCalledWith(
      2,
      `CachedRepositoryMock:find_id:${entity2.id}`,
      entity2
    );
    expect(deleteSpy).toHaveBeenNthCalledWith(1, 'CachedRepositoryMock:_list');
    expect(cacheService).toMatchSnapshot();
  });
});
