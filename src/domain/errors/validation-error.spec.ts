import { EntityValidationError } from '@root';

describe('Validation error', () => {
  it('should be an instance of Error', () => {
    const error = new EntityValidationError({ name: ['name is required'] });
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Entity Validation Error');
    expect(error.name).toBe('EntityValidationError');
    expect(error.error).toStrictEqual({ name: ['name is required'] });
  });
});
