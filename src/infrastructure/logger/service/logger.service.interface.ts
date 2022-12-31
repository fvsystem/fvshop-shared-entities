export interface LoggerServiceInterface {
  log(message: unknown): void;
  info(message: unknown): void;
  warn(message: unknown): void;
  error(message: unknown): void;
}
