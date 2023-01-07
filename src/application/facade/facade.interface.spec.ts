import { FacadeMock } from './facade.mock';

describe('FacadeInterface', () => {
  it('should be able to create a new instance', () => {
    const facade = new FacadeMock();
    expect(facade.test1.execute('test')).toBe('test');
    expect(facade.test2('test')).toBe('test');
  });
});
