import {
  EmailValueObjectFactoryValidatorZod,
  EmailValueObjectValidatorZod,
} from '@root';

describe('Email Value Object Validator Factory', () => {
  it('should create a validator of email value object', () => {
    const validator = EmailValueObjectFactoryValidatorZod.create();
    expect(validator).toBeInstanceOf(EmailValueObjectValidatorZod);
  });
});
