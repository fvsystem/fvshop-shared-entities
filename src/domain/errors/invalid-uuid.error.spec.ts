import { InvalidUuidError } from '@root';

describe('Invalid UUID error', () => {
  it('should be an instance of Error', () => {
    const error = new InvalidUuidError();
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('ID must be a valid UUID');
    expect(error.name).toBe('InvalidUuidError');
  });

  it('should be an instance of Error with custom message', () => {
    const error = new InvalidUuidError('Custom message');
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Custom message');
    expect(error.name).toBe('InvalidUuidError');
  });
});
