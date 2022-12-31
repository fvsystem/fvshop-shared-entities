import { sign, Algorithm, verify } from 'jsonwebtoken';
import { JWTPayload, JWTServicesInterface } from './jwt.service.interface';

export interface JWTServiceJsonWebTokenProps {
  privateKey: string;
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

  async verify(token: string): Promise<Payload & { exp: string; iat: string }> {
    return new Promise((resolve, reject) => {
      verify(
        token,
        this.props.publicKey,
        { algorithms: [this.props.algorithm] },
        (err, payload) => {
          if (err) {
            reject(err);
          } else {
            resolve(payload as Payload & { exp: string; iat: string });
          }
        }
      );
    });
  }

  async sign(payload: Payload): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(
        payload,
        this.props.privateKey,
        {
          algorithm: this.props.algorithm,
          expiresIn: this.props.expiration,
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
