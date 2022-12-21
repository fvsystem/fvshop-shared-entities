import { EmailValueObject } from '@root';

describe('Email value object', () => {
  it('should be an instance of EmailValueObject', () => {
    const email = new EmailValueObject({
      to: ['test@test.com'],
      from: ['test2@test.com'],
      cc: ['test3@test.com'],
      bcc: ['test4@test.com'],
      subject: 'test',
      body: 'test',
      attachments: ['test'],
    });
    expect(email).toBeInstanceOf(EmailValueObject);
  });

  it('should be a valid email value object', () => {
    const email = new EmailValueObject({
      to: ['test@test.com', 'test5@test.com'],
      from: ['test2@test.com', 'test6@test.com'],
      cc: ['test3@test.com', 'test4@test.com'],
      bcc: ['test4@test.com', 'test100@test.com'],
      subject: 'test',
      body: 'test',
      attachments: ['test'],
    });
    expect(email.to).toStrictEqual(['test@test.com', 'test5@test.com']);
    expect(email.toAsCSV).toStrictEqual('test@test.com,test5@test.com');
    expect(email.from).toStrictEqual(['test2@test.com', 'test6@test.com']);
    expect(email.fromAsCSV).toStrictEqual('test2@test.com,test6@test.com');
    expect(email.cc).toStrictEqual(['test3@test.com', 'test4@test.com']);
    expect(email.ccAsCSV).toStrictEqual('test3@test.com,test4@test.com');
    expect(email.bcc).toStrictEqual(['test4@test.com', 'test100@test.com']);
    expect(email.bccAsCSV).toStrictEqual('test4@test.com,test100@test.com');
    expect(email.subject).toStrictEqual('test');
    expect(email.body).toStrictEqual('test');
    expect(email.attachments).toStrictEqual(['test']);
  });

  it('should be a valid email value object with empty fields', () => {
    const email = new EmailValueObject({
      to: ['test@test.com', 'test5@test.com'],
      from: ['test2@test.com', 'test6@test.com'],
      subject: 'test',
      body: 'test',
    });
    expect(email.to).toStrictEqual(['test@test.com', 'test5@test.com']);
    expect(email.toAsCSV).toStrictEqual('test@test.com,test5@test.com');
    expect(email.from).toStrictEqual(['test2@test.com', 'test6@test.com']);
    expect(email.fromAsCSV).toStrictEqual('test2@test.com,test6@test.com');
    expect(email.cc).toStrictEqual([]);
    expect(email.ccAsCSV).toStrictEqual('');
    expect(email.bcc).toStrictEqual([]);
    expect(email.bccAsCSV).toStrictEqual('');
    expect(email.subject).toStrictEqual('test');
    expect(email.body).toStrictEqual('test');
    expect(email.attachments).toStrictEqual([]);
  });
});
