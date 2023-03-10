import { EmailValueObject } from '@root/application/value-object';
import { EmailMock } from './email.mock';
import { EmailServiceInterface } from './email.service.interface';

describe('Logger Service Interface', () => {
  it('should be defined', () => {
    const emailService = new EmailMock() as EmailServiceInterface;
    expect(emailService).toBeDefined();
    expect(emailService.sendEmail).toBeDefined();
    const email = new EmailValueObject({
      to: ['test@test.com', 'test5@test.com'],
      from: ['test2@test.com', 'test6@test.com'],
      subject: 'test',
      body: 'test',
    });
    expect(() => emailService.sendEmail(email, 'path')).not.toThrow();
  });
});
