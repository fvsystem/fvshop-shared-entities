import { NotFoundError } from '@root';

describe('Not found error', () => {
  it('should be an instance of Error', () => {
    const error = new NotFoundError();
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Entity Not found');
    expect(error.name).toBe('NotFoundError');
  });

  it('should be an instance of Error with custom message', () => {
    const error = new NotFoundError('Custom message');
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Custom message');
    expect(error.name).toBe('NotFoundError');
  });
});
