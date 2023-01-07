/* istanbul ignore file */

import { UniqueEntityId } from '../value-object';
import { Entity } from './entity';

export interface MockProps {
  name: string;
}

export class EntityMock extends Entity<MockProps> {
  constructor(props: MockProps, id?: UniqueEntityId | string) {
    const uuidValue = id instanceof UniqueEntityId ? id.value : id;
    const idEntity = new UniqueEntityId(uuidValue);
    super(props, idEntity);
    this.props.name = props.name;
  }

  get name(): string {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }
}
