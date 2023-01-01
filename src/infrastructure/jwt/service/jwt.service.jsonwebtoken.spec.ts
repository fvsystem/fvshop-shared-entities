import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { JWTServiceJsonWebToken } from './jwt.service.jsonwebtoken';

let privateKey: string;
let publicKey: string;

describe('JWTServiceJsonWebToken', () => {
  beforeAll(async () => {
    const privateKeyFile = resolve(__dirname, 'jwtRS256.key');
    const publicKeyFile = resolve(__dirname, 'jwtRS256.key.pub');
    privateKey = await readFile(privateKeyFile, 'utf-8');
    publicKey = await readFile(publicKeyFile, 'utf-8');
  });
  it('should sign a payload and verify token', async () => {
    const service = new JWTServiceJsonWebToken<{ id: string }>({
      algorithm: 'RS256',
      expiration: '1h',
      privateKey,
      publicKey,
    });
    const token = await service.sign(
      { id: '1' },
      { iss: 'test', sub: 'test', aud: 'test' }
    );
    expect(token).not.toBe('1');
    const payload = await service.verify(token);
    expect(payload.id).toBe('1');
    expect(payload.exp).toBeDefined();
    expect(payload.iat).toBeDefined();
    expect(payload.iss).toBe('test');
    expect(payload.sub).toBe('test');
    expect(payload.aud).toBe('test');
  });

  it('should not sign with invalid key', async () => {
    const service = new JWTServiceJsonWebToken<{ id: string }>({
      algorithm: 'RS256',
      expiration: '1h',
      privateKey: 'invalid',
      publicKey,
    });
    expect(() =>
      service.sign({ id: '1' }, { iss: 'test', sub: 'test', aud: 'test' })
    ).rejects.toThrow();
  });

  it('should not verify with invalid token', async () => {
    const service = new JWTServiceJsonWebToken<{ id: string }>({
      algorithm: 'RS256',
      expiration: '1h',
      privateKey,
      publicKey,
    });
    expect(() => service.verify('invalid')).rejects.toThrow();
  });
});
