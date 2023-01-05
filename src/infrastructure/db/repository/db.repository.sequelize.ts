import {
  Entity,
  EntityProps,
  NotFoundError,
  RepositoryInterface,
  UniqueEntityId,
} from '@root/domain';
import { Model, ModelCtor } from 'sequelize-typescript';

export abstract class RepositorySequelize<
  E extends Entity,
  Props extends EntityProps
> implements RepositoryInterface<E>
{
  protected readonly model: ModelCtor<Model<Props & { id: string }>>;

  protected readonly toEntity: (
    props: Props & { id: string }
  ) => E | Promise<E>;

  constructor(
    model: ModelCtor<Model<Props & { id: string }>>,
    toEntity: (props: Props & { id: string }) => E | Promise<E>
  ) {
    this.model = model;
    this.toEntity = toEntity;
  }

  async findAll(): Promise<E[]> {
    const entities = await this.model.findAll();
    return Promise.all(
      entities.map((entity) => this.toEntity(entity.dataValues))
    );
  }

  async findById(id: string | UniqueEntityId): Promise<E> {
    const idValue = id instanceof UniqueEntityId ? id.value : id;
    const entity = await this.model.findByPk(idValue);
    if (!entity) {
      throw new NotFoundError();
    }
    return this.toEntity(entity.dataValues);
  }

  async insert(entity: E): Promise<void> {
    const model = await this.model.create(entity.toDTO());
    await model.save();
  }

  async update(entity: E): Promise<void> {
    const model = await this.model.findByPk(entity.id);
    if (!model) {
      throw new NotFoundError();
    }
    await model.update(entity.toDTO());
  }

  async delete(id: string | UniqueEntityId): Promise<void> {
    const idValue = id instanceof UniqueEntityId ? id.value : id;
    const model = await this.model.findByPk(idValue);
    if (!model) {
      throw new NotFoundError();
    }
    await model.destroy();
  }

  async bulkInsert(entities: E[]): Promise<void> {
    await this.model.bulkCreate(entities.map((entity) => entity.toDTO()));
  }
}
