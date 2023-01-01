import { CacheServiceIoRedis } from './cache.service.ioredis';

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

describe('Cache service ioredis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('shoud get', async () => {
    const cacheService = new CacheServiceIoRedis({});
    mockGet.mockResolvedValue('{"test":"test"}');
    const value = await cacheService.get('test');
    expect(value).toEqual({ test: 'test' });
  });

  it('shoud not get', async () => {
    const cacheService = new CacheServiceIoRedis({});
    mockGet.mockResolvedValue(null);
    const value = await cacheService.get('test');
    expect(value).toBeNull();
  });

  it('shoud save', async () => {
    const cacheService = new CacheServiceIoRedis({});
    await cacheService.set('test', { test: 'test' });
    expect(mockSet).toHaveBeenCalledTimes(1);
  });

  it('shoud delete', async () => {
    const cacheService = new CacheServiceIoRedis({});
    await cacheService.delete('test');
    expect(mockDel).toHaveBeenCalledTimes(1);
  });

  it('shoud flushAll', async () => {
    const cacheService = new CacheServiceIoRedis({});
    await cacheService.clear();
    expect(mockFlushall).toHaveBeenCalledTimes(1);
  });
});
