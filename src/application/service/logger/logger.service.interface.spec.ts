import { LoggerMock } from './logger.mock';
import { LoggerServiceInterface } from './logger.service.interface';

describe('Logger Service Interface', () => {
  it('should be defined', () => {
    const loggerService = new LoggerMock() as LoggerServiceInterface;
    expect(loggerService).toBeDefined();
    expect(loggerService.log).toBeDefined();
    expect(loggerService.info).toBeDefined();
    expect(loggerService.warn).toBeDefined();
    expect(loggerService.error).toBeDefined();
    expect(() => loggerService.log({})).not.toThrow();
    expect(() => loggerService.info({})).not.toThrow();
    expect(() => loggerService.warn({})).not.toThrow();
    expect(() => loggerService.error({})).not.toThrow();
  });
});
