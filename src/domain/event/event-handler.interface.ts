import { EventInterface } from '@root';

export interface EventHandlerInterface<
  T extends EventInterface = EventInterface
> {
  handle(event: T): void;
}
