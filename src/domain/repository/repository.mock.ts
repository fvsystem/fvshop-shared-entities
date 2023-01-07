/* istanbul ignore file */

import { EntityMock } from '../entity';
import { NotFoundError } from '../errors';
import { UniqueEntityId } from '../value-object';
import { RepositoryInterface } from './repository.interface';

export class RepositoryMock implements RepositoryInterface<EntityMock> {
  private entities: EntityMock[] = [];

  async findAll(): Promise<EntityMock[]> {
    return this.entities;
  }

  async delete(id: string | UniqueEntityId): Promise<void> {
    const idValue = id instanceof UniqueEntityId ? id.value : id;
    this.entities = this.entities.filter((e) => e.id !== idValue);
  }

  async findById(id: string | UniqueEntityId): Promise<EntityMock> {
    const idValue = id instanceof UniqueEntityId ? id.value : id;
    const entity = this.entities.find((e) => e.id === idValue);
    if (!entity) {
      throw new NotFoundError();
    }
    return entity;
  }

  async insert(entity: EntityMock): Promise<void> {
    this.entities.push(entity);
  }

  async bulkInsert(entities: EntityMock[]): Promise<void> {
    this.entities.push(...entities);
  }

  async update(entity: EntityMock): Promise<void> {
    const index = this.entities.findIndex((e) => e.id === entity.id);
    if (index === -1) {
      throw new NotFoundError();
    }
    this.entities[index] = entity;
  }
}
