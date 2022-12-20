/* eslint-disable max-classes-per-file */
import {
  EventInterface,
  EventHandlerInterface,
  WinstonLoggerService,
  EventDispatcher,
} from '@root';

class StubEvent implements EventInterface {
  dataTimeOccurred: Date;

  eventData: unknown;

  constructor() {
    this.dataTimeOccurred = new Date();
    this.eventData = {};
  }
}

const logger = new WinstonLoggerService();

class StubEventHandler implements EventHandlerInterface<StubEvent> {
  handle(event: EventInterface): void {
    logger.info(event);
  }
}

describe('Domain events tests', () => {
  it('should register an event handler', () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new StubEventHandler();

    eventDispatcher.register('StubEvent', eventHandler);

    expect(eventDispatcher.getEventHandlers.StubEvent).toBeDefined();
    expect(eventDispatcher.getEventHandlers.StubEvent.length).toBe(1);
    expect(eventDispatcher.getEventHandlers.StubEvent[0]).toMatchObject(
      eventHandler
    );
  });

  it('should unregister an event handler', () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new StubEventHandler();

    eventDispatcher.register('StubEvent', eventHandler);

    expect(eventDispatcher.getEventHandlers.StubEvent[0]).toMatchObject(
      eventHandler
    );

    eventDispatcher.unregister('StubEvent', eventHandler);

    expect(eventDispatcher.getEventHandlers.StubEvent).toBeDefined();
    expect(eventDispatcher.getEventHandlers.StubEvent.length).toBe(0);
  });

  it('should unregister all event handlers', () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new StubEventHandler();

    eventDispatcher.register('StubEvent', eventHandler);

    expect(eventDispatcher.getEventHandlers.StubEvent[0]).toMatchObject(
      eventHandler
    );

    eventDispatcher.unregisterAll();

    expect(eventDispatcher.getEventHandlers.StubEvent).toBeUndefined();
  });

  it('should notify all event handlers', () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new StubEventHandler();
    const spyEventHandler = jest.spyOn(eventHandler, 'handle');

    eventDispatcher.register('StubEvent', eventHandler);

    expect(eventDispatcher.getEventHandlers.StubEvent[0]).toMatchObject(
      eventHandler
    );

    const stubEvent = new StubEvent();

    // Quando o notify for executado o StubEventHandler.handle() deve ser chamado
    eventDispatcher.notify(stubEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});
