import { ValueObject } from '@root/domain/value-object';

export interface EmailProps {
  to: string[];
  from: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  attachments?: string[];
}

export class EmailValueObject extends ValueObject<EmailProps> {
  protected _value: EmailProps;

  constructor(readonly email: EmailProps) {
    super(email);
  }

  get value(): EmailProps {
    return this._value;
  }

  get to(): string[] {
    return this._value.to;
  }

  get toAsCSV(): string {
    return this._value.to.join(',');
  }

  get from(): string[] {
    return this._value.from;
  }

  get fromAsCSV(): string {
    return this._value.from.join(',');
  }

  get cc(): string[] {
    return this._value.cc || [];
  }

  get ccAsCSV(): string {
    return this._value.cc?.join(',') || '';
  }

  get bcc(): string[] {
    return this._value.bcc || [];
  }

  get bccAsCSV(): string {
    return this._value.bcc?.join(',') || '';
  }

  get subject(): string {
    return this._value.subject;
  }

  get body(): string {
    return this._value.body;
  }

  get attachments(): string[] {
    return this._value.attachments || [];
  }
}
