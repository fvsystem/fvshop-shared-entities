/* eslint-disable no-param-reassign */
import { LoggerServiceWinton } from '@root/infrastructure';
import { LoggerServiceInterface } from '../service/logger';

function isPromise(p) {
  if (typeof p === 'object' && typeof p.then === 'function') {
    return true;
  }

  return false;
}

// ✅ Check if return value is promise
function returnsPromise(f) {
  if (
    f.constructor.name === 'AsyncFunction' ||
    (typeof f === 'function' && isPromise(f()))
  ) {
    return true;
  }

  return false;
}

export function log(logger?: LoggerServiceInterface) {
  const loggerService = logger || new LoggerServiceWinton();
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let result: any;

      if (returnsPromise(originalMethod)) {
        result = await originalMethod.apply(this, args);
      } else {
        result = originalMethod.apply(this, args);
      }
      loggerService.info(`${propertyKey}(${args}) => ${result}`);
      return result;
    };
    return descriptor;
  };
}
