import { sign, Algorithm, verify } from 'jsonwebtoken';
import {
  JWTData,
  JWTPayload,
  JWTServicesInterface,
  JWTVerifyOptions,
} from '@root/application';

export interface JWTServiceJsonWebTokenProps {
  privateKey?: string;
  algorithm: Algorithm;
  expiration: string;
  publicKey: string;
}

export class JWTServiceJsonWebToken<Payload extends JWTPayload>
  implements JWTServicesInterface<Payload>
{
  private readonly props: JWTServiceJsonWebTokenProps;

  constructor(props: JWTServiceJsonWebTokenProps) {
    this.props = props;
  }

  async verify(
    token: string,
    options?: JWTVerifyOptions
  ): Promise<Payload & JWTData> {
    return new Promise((resolve, reject) => {
      verify(
        token,
        this.props.publicKey,
        {
          algorithms: [this.props.algorithm],
          maxAge: options?.maxAge || '20s',
        },
        (err, payload) => {
          if (err) {
            reject(err);
          } else {
            resolve(payload as Payload & JWTData);
          }
        }
      );
    });
  }

  async sign(payload: Payload, data: JWTData): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.props.privateKey) {
        reject(new Error('Private key is not defined'));
        return;
      }
      sign(
        payload,
        this.props.privateKey,
        {
          algorithm: this.props.algorithm,
          expiresIn: this.props.expiration,
          issuer: data.iss,
          subject: data.sub,
          audience: data.aud,
        },
        (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token);
          }
        }
      );
    });
  }
}
