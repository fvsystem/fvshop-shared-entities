import { createLogger, format, transports } from 'winston';
import { LoggerServiceInterface } from './logger.service.interface';

const { combine, timestamp, label, json, prettyPrint } = format;

export const logger = createLogger({
  format: combine(
    label({ label: 'fvshop-shared-entities' }),
    timestamp(),
    json(),
    prettyPrint()
  ),
  level: 'info',
  transports: [new transports.Console()],
});

const stringifyCircularJSON = (obj): string => {
  const seen = new WeakSet();
  return JSON.stringify(obj, (k, v) => {
    if (v !== null && typeof v === 'object') {
      if (seen.has(v)) return;
      seen.add(v);
    }
    return v;
  });
};

export class LoggerServiceWinton implements LoggerServiceInterface {
  static transformMessage(message: unknown): string {
    if (typeof message === 'string') {
      return message;
    }
    return stringifyCircularJSON(message);
  }

  log(message: unknown): void {
    logger.log({
      message: LoggerServiceWinton.transformMessage(message),
      level: 'info',
    });
  }

  info(message: unknown): void {
    logger.info({ message: LoggerServiceWinton.transformMessage(message) });
  }

  warn(message: unknown): void {
    logger.warn({ message: LoggerServiceWinton.transformMessage(message) });
  }

  error(message: unknown): void {
    logger.error({ message: LoggerServiceWinton.transformMessage(message) });
  }
}
