import { SafeParseError, ZodSchema } from 'zod';
import {
  FieldsErrors,
  ValidatorFieldsInterface,
} from './validator-fields.interface';

export abstract class ValidatorFieldsZod<PropsValidated>
  implements ValidatorFieldsInterface<PropsValidated>
{
  errors: FieldsErrors | null = null;

  validatedData: PropsValidated | null = null;

  schema!: ZodSchema;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate(data: any): boolean {
    const result = this.schema.safeParse(data);

    if (result.success) {
      this.validatedData = data;
      return true;
    }
    const { errors } = (result as SafeParseError<PropsValidated>).error;
    this.errors = {};
    errors.forEach((error) => {
      const field = error.path[0];
      this.errors[field] = this.errors[field]
        ? [...this.errors[field], error.message]
        : [error.message];
    });
    return !errors.length;
  }
}

export default ValidatorFieldsZod;
