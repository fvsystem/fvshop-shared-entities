import { z } from 'zod';
import { EmailProps } from '@root';
import { ValidatorFieldsZod } from '@root/domain/validator';

export class EmailValueObjectValidatorZod extends ValidatorFieldsZod<EmailProps> {
  constructor() {
    super();
    this.schema = z.object({
      to: z.array(z.string().email()).min(1),
      from: z.array(z.string().email()).min(1),
      cc: z.array(z.string().email()).optional(),
      bcc: z.array(z.string().email()).optional(),
      subject: z.string().min(3).max(255),
      body: z.string().min(3),
      attachments: z.array(z.string()).optional(),
    });
  }
}
