export type FieldsErrors = {
  [field: string]: string[];
};

export interface ValidatorFieldsInterface<PropsValidated> {
  errors: FieldsErrors;
  validatedData: PropsValidated;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate(data: any): boolean;
}
