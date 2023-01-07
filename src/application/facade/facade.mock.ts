import { UseCase } from '../usecase';
import { UseCaseMock } from '../usecase/usecase.mock';
import { FacadeInterface } from './facade.interface';

type FacadeMethods = {
  test1: UseCase<string, string>;
  test2: (input: string) => string;
};

export class FacadeMock implements FacadeInterface<FacadeMethods> {
  test1: UseCase<string, string> = new UseCaseMock();

  test2(input: string): string {
    return input;
  }
}
