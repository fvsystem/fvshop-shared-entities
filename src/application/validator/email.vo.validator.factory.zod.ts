import { EmailValueObjectValidatorZod } from '@root';

export class EmailValueObjectFactoryValidatorZod {
  static create(): EmailValueObjectValidatorZod {
    return new EmailValueObjectValidatorZod();
  }
}
