import { EmailValueObject } from '@root';

export interface EmailServiceInterface {
  sendEmail(email: EmailValueObject, template?: string): Promise<void>;
}
