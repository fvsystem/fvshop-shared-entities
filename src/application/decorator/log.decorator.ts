/* eslint-disable no-param-reassign */
import { LoggerServiceWinton } from '@root/infrastructure/logger';
import { LoggerServiceInterface } from '../service/logger';

function isPromise(p) {
  if (typeof p === 'object' && typeof p.then === 'function') {
    return true;
  }

  return false;
}

function toString(arg: unknown): string {
  if (Array.isArray(arg)) {
    return arg.reduce((acc, item, cur, array) => {
      if (cur === array.length - 1) {
        return `${acc}${toString(item)}`;
      }
      return `${acc}${toString(item)},`;
    }, '');
  }
  if (typeof arg === 'object') {
    return `{${Object.keys(arg).reduce((acc, key, cur, arr) => {
      if (cur === arr.length - 1) {
        return `${acc}${key}:${toString(arg[key])}`;
      }
      return `${acc}${key}:${toString(arg[key])},`;
    }, '')}}`;
  }

  return `${arg}`;
}

export function log(name: string, logger?: LoggerServiceInterface) {
  const loggerService = logger || new LoggerServiceWinton();
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = originalMethod.apply(this, args);

      if (result.then && typeof result.then === 'function') {
        return new Promise((resolve, reject) => {
          result
            .then((res) => {
              loggerService.info(
                `${name}(${toString(args)}) => ${toString(res)}`
              );
              resolve(res);
            })
            .catch((err) => {
              loggerService.error(
                `${name}(${toString(args)}) => ${err.message}`
              );
              reject(err);
            });
        });
      }
      loggerService.info(`${name}(${toString(args)}) => ${toString(result)}`);
      return result;
    };
    return descriptor;
  };
}
