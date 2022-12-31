import bcrypt from 'bcryptjs';
import { HashServiceInterface } from './hash.service.interface';

export class HashServiceBCryptJS implements HashServiceInterface {
  private readonly saltRounds: number;

  constructor(saltRounds: number) {
    this.saltRounds = saltRounds;
  }

  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.saltRounds);
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
