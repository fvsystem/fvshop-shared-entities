import { FacadeInterface } from './facade.interface';

type FacadeMethods = {
  test1: (input: string) => string;
  test2: (input: string) => string;
};

class FacadeTest implements FacadeInterface<FacadeMethods> {
  test1(input: string): string {
    return input;
  }

  test2(input: string): string {
    return input;
  }
}

describe('FacadeInterface', () => {
  it('should be able to create a new instance', () => {
    const facade = new FacadeTest();
    expect(facade.test1('test')).toBe('test');
    expect(facade.test2('test')).toBe('test');
  });
});
