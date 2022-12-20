import { WinstonLoggerService, logger } from '@root';

describe('Logger service winston', () => {
  it('shoud log', () => {
    const loggerSpy = jest.spyOn(logger, 'log');
    const loggerService = new WinstonLoggerService();
    loggerService.log('test');
    expect(loggerSpy).toHaveBeenCalledTimes(1);
    loggerService.log({});
    expect(loggerSpy).toHaveBeenCalledTimes(2);
  });

  it('shoud info', () => {
    const loggerSpy = jest.spyOn(logger, 'info');
    const loggerService = new WinstonLoggerService();
    loggerService.info('test');
    expect(loggerSpy).toHaveBeenCalledTimes(1);
    loggerService.info({});
    expect(loggerSpy).toHaveBeenCalledTimes(2);
  });

  it('shoud warn', () => {
    const loggerSpy = jest.spyOn(logger, 'warn');
    const loggerService = new WinstonLoggerService();
    loggerService.warn('test');
    expect(loggerSpy).toHaveBeenCalledTimes(1);
    loggerService.warn({});
    expect(loggerSpy).toHaveBeenCalledTimes(2);
  });

  it('shoud error', () => {
    const loggerSpy = jest.spyOn(logger, 'error');
    const loggerService = new WinstonLoggerService();
    loggerService.error('test');
    expect(loggerSpy).toHaveBeenCalledTimes(1);
    loggerService.error({});
    expect(loggerSpy).toHaveBeenCalledTimes(2);
  });
});
