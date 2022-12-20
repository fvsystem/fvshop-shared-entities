import { LoggerServiceInterface } from '@root/application/service';
import { createLogger, format, transports } from 'winston';

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

export class WinstonLoggerService implements LoggerServiceInterface {
  static transformMessage(message: unknown): string {
    if (typeof message === 'string') {
      return message;
    }
    return stringifyCircularJSON(message);
  }

  log(message: unknown): void {
    logger.log({
      message: WinstonLoggerService.transformMessage(message),
      level: 'info',
    });
  }

  info(message: unknown): void {
    logger.info({ message: WinstonLoggerService.transformMessage(message) });
  }

  warn(message: unknown): void {
    logger.warn({ message: WinstonLoggerService.transformMessage(message) });
  }

  error(message: unknown): void {
    logger.error({ message: WinstonLoggerService.transformMessage(message) });
  }
}
