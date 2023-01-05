import { UniqueEntityId } from '../value-object/unique-entity-id.vo';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EntityProps = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class Entity<Props extends EntityProps = any> {
  public readonly uniqueEntityId: UniqueEntityId;

  constructor(public readonly props: Props, id?: UniqueEntityId) {
    this.uniqueEntityId = id || new UniqueEntityId();
  }

  get id(): string {
    return this.uniqueEntityId.value;
  }

  toDTO(): Props & { id: string } {
    return { ...this.props, id: this.id };
  }

  toJSON(): Required<{ id: string } & Props> {
    return {
      id: this.id,
      ...this.props,
    } as Required<{ id: string } & Props>;
  }
}
