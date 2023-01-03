export interface UseCase {
  <Input, Output>(input: Input): Output | Promise<Output>;
}
