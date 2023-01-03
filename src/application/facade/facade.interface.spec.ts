import { UseCase } from '../usecase';
import { FacadeInterface } from './facade.interface';

type FacadeMethods = {
  test1: UseCase<string, string>;
  test2: (input: string) => string;
};

class TestUseCase implements UseCase<string, string> {
  execute(input: string): string {
    return input;
  }
}

class FacadeTest implements FacadeInterface<FacadeMethods> {
  test1: UseCase<string, string> = new TestUseCase();

  test2(input: string): string {
    return input;
  }
}

describe('FacadeInterface', () => {
  it('should be able to create a new instance', () => {
    const facade = new FacadeTest();
    expect(facade.test1.execute('test')).toBe('test');
    expect(facade.test2('test')).toBe('test');
  });
});
