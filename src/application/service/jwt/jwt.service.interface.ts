export type JWTPayload = object;
export interface JWTData {
  iss: string;
  sub: string;
  aud: string;
  exp?: number;
  iat?: number;
}

export interface JWTServicesInterface<Payload extends JWTPayload = object> {
  sign(payload: Payload, data: JWTData): Promise<string>;
  verify(token: string): Promise<Payload & JWTData>;
}
