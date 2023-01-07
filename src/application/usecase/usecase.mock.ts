/* istanbul ignore file */

import { UseCase } from './usecase.interface';

export class UseCaseMock implements UseCase<string, string> {
  execute(input: string): string {
    return input;
  }
}
