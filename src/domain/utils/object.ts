export function deepFreeze<T>(obj: T) {
  const propNames = Object.getOwnPropertyNames(obj);

  propNames.forEach((name) => {
    const value = obj[name as keyof T];

    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  });

  return Object.freeze(obj);
}
