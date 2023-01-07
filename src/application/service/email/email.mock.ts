/* istanbul ignore file */
import { EmailServiceInterface } from './email.service.interface';

export class EmailMock implements EmailServiceInterface {
  sendEmail = jest.fn();
}
