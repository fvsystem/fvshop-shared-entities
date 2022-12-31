import { HashServiceBCryptJS } from './hash.service.bcryptjs';

describe('HashServiceBCryptJS', () => {
  it('should hash a value', async () => {
    const service = new HashServiceBCryptJS(10);
    const hash = await service.hash('password');
    expect(hash).not.toBe('password');
    expect(hash).toHaveLength(60);
  });

  it('should compare a value', async () => {
    const service = new HashServiceBCryptJS(10);
    const hash = await service.hash('password');
    const isValid = await service.compare('password', hash);
    expect(isValid).toBeTruthy();
    const notValid = await service.compare('password1', hash);
    expect(notValid).toBeFalsy();
  });
});
