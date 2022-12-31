import { LoggerServiceInterface } from './logger.service.interface';

class LoggerMock implements LoggerServiceInterface {
  log = jest.fn();

  info = jest.fn();

  warn = jest.fn();

  error = jest.fn();
}

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
