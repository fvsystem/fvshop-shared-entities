import { LoggerServiceWinton, logger } from './logger.service.winton';

describe('Logger service winston', () => {
  it('shoud log', () => {
    const loggerSpy = jest.spyOn(logger, 'log');
    const loggerService = new LoggerServiceWinton();
    loggerService.log('test');
    expect(loggerSpy).toHaveBeenCalledTimes(1);
    loggerService.log({});
    expect(loggerSpy).toHaveBeenCalledTimes(2);
  });

  it('shoud info', () => {
    const loggerSpy = jest.spyOn(logger, 'info');
    const loggerService = new LoggerServiceWinton();
    loggerService.info('test');
    expect(loggerSpy).toHaveBeenCalledTimes(1);
    loggerService.info({});
    expect(loggerSpy).toHaveBeenCalledTimes(2);
  });

  it('shoud warn', () => {
    const loggerSpy = jest.spyOn(logger, 'warn');
    const loggerService = new LoggerServiceWinton();
    loggerService.warn('test');
    expect(loggerSpy).toHaveBeenCalledTimes(1);
    loggerService.warn({});
    expect(loggerSpy).toHaveBeenCalledTimes(2);
  });

  it('shoud error', () => {
    const loggerSpy = jest.spyOn(logger, 'error');
    const loggerService = new LoggerServiceWinton();
    loggerService.error('test');
    expect(loggerSpy).toHaveBeenCalledTimes(1);
    loggerService.error({});
    expect(loggerSpy).toHaveBeenCalledTimes(2);
  });
});
