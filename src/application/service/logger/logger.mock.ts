/* istanbul ignore file */

import { LoggerServiceInterface } from './logger.service.interface';

export class LoggerMock implements LoggerServiceInterface {
  log = jest.fn();

  info = jest.fn();

  warn = jest.fn();

  error = jest.fn();
}
