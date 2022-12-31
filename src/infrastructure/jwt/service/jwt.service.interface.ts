export type JWTPayload = object;

export interface JWTServicesInterface<Payload extends JWTPayload = object> {
  sign(payload: Payload): Promise<string>;
  verify(token: string): Promise<Payload>;
}
