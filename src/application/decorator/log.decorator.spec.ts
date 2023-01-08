import { logger as winstonLogger } from '@root/infrastructure/logger';
import { log } from './log.decorator';

describe('log', () => {
  it('should log', () => {
    const logger = {
      info: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };
    class Test {
      @log('name', logger)
      test(a: number, b: number) {
        return a + b;
      }
    }
    const test = new Test();
    test.test(1, 2);
    expect(logger.info).toHaveBeenCalledWith('name(1,2) => 3');
  });

  it('should log with Winston', () => {
    const infoSpy = jest.spyOn(winstonLogger, 'info');
    class Test {
      @log('name', winstonLogger)
      test(a: number, b: number) {
        return a + b;
      }
    }
    const test = new Test();
    test.test(1, 2);
    expect(infoSpy).toHaveBeenCalledWith('name(1,2) => 3');
  });

  it('should log async function', async () => {
    const logger = {
      info: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };
    class Test {
      @log('name', logger)
      test(a: number, b: number) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(a + b);
          }, 2);
        });
      }
    }
    const test = new Test();
    await test.test(1, 2);
    expect(logger.info).toHaveBeenCalledWith('name(1,2) => 3');
  });

  it('should log object function', async () => {
    const logger = {
      info: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };
    class Test {
      @log('name', logger)
      test(numbers: { a: number; b: number }) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(numbers.a + numbers.b);
          }, 2);
        });
      }
    }
    const test = new Test();
    await test.test({ a: 1, b: 2 });
    expect(logger.info).toHaveBeenCalledWith('name({a:1,b:2}) => 3');
  });
});
