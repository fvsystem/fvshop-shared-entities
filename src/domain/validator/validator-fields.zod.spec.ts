import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import ClassValidatorFieldsZod from './validator-fields.zod';

const schema = z.object({
  field: z
    .string({
      required_error: 'Field is Required',
      invalid_type_error: 'Field must be a string uuid',
    })
    .uuid({
      message: 'Field must be a string uuid',
    })
    .min(1),
  other: z.number({
    required_error: 'Other is Required',
  }),
});

class StubClassValidatorFields extends ClassValidatorFieldsZod<{
  field: string;
}> {
  constructor() {
    super();
    this.schema = schema;
  }
}

describe('ClassValidatorFields Unit Tests', () => {
  it('should initialize erros and validatedData variables with null', () => {
    const validator = new StubClassValidatorFields();
    expect(validator.errors).toBeNull();
    expect(validator.validatedData).toBeNull();
  });

  it('should validate with errors', () => {
    const validator = new StubClassValidatorFields();
    expect(validator.validate({ field: 2 })).toBeFalsy();
    expect(validator.validatedData).toBeNull();
    expect(validator.errors).toStrictEqual({
      field: ['Field must be a string uuid'],
      other: ['Other is Required'],
    });
  });

  it('should validate without errors', () => {
    const validator = new StubClassValidatorFields();
    const value = { field: uuid(), other: 2 };
    expect(validator.validate(value)).toBeTruthy();
    expect(validator.validatedData).toStrictEqual(value);
    expect(validator.errors).toBeNull();
  });

  it('should validate with more than one error in a field', () => {
    const validator = new StubClassValidatorFields();
    const value = { field: '', other: 2 };
    expect(validator.validate(value)).toBeFalsy();
    expect(validator.validatedData).toBeNull();
    expect(validator.errors).toStrictEqual({
      field: [
        'Field must be a string uuid',
        'String must contain at least 1 character(s)',
      ],
    });
  });
});
