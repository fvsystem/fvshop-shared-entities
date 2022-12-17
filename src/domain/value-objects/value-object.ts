import { deepFreeze } from '../utils/object';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class ValueObject<Value = any> {
  protected readonly _value: Value;

  constructor(value: Value) {
    this._value = deepFreeze(value);
  }

  get value(): Value {
    return this._value;
  }

  toString = () => {
    if (typeof this.value !== 'object' || this.value === null) {
      try {
        return (this.value as { toString(): string }).toString();
      } catch (e) {
        return `${this.value}`;
      }
    }
    const valueStr = (this.value as unknown as object).toString();
    return valueStr === '[object Object]'
      ? JSON.stringify(this.value)
      : valueStr;
  };
}

export default ValueObject;
