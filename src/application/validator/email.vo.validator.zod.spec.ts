import { EmailValueObjectValidatorZod } from './email.vo.validator.zod';

describe('Email VO validator zod', () => {
  it('should validate email', () => {
    const validator = new EmailValueObjectValidatorZod();
    const result = validator.validate({
      to: ['test@test.com'],
      from: ['test2@test.com'],
      cc: ['test3@test.com'],
      bcc: ['test4@test.com'],
      subject: 'test',
      body: 'test',
    });
    expect(result).toBeTruthy();
    expect(validator.validatedData).toStrictEqual({
      to: ['test@test.com'],
      from: ['test2@test.com'],
      cc: ['test3@test.com'],
      bcc: ['test4@test.com'],
      subject: 'test',
      body: 'test',
    });
    expect(validator.errors).toBeNull();
  });

  it('should not validate email', () => {
    const validator = new EmailValueObjectValidatorZod();
    const result = validator.validate({
      to: [],
      from: ['abc'],
      cc: [2],
      bcc: 3,
      subject: 'te',
      body: 't',
      attachments: [2],
    });
    expect(result).toBeFalsy();
    expect(validator.validatedData).toBeNull();
    expect(validator.errors).toStrictEqual({
      attachments: ['Expected string, received number'],
      body: ['String must contain at least 3 character(s)'],
      bcc: ['Expected array, received number'],
      cc: ['Expected string, received number'],
      from: ['Invalid email'],
      subject: ['String must contain at least 3 character(s)'],
      to: ['Array must contain at least 1 element(s)'],
    });
  });
});
