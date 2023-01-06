import {
  Entity,
  NotFoundError,
  RepositoryInterface,
  UniqueEntityId,
} from '@root/domain';
import { Model, ModelCtor } from 'sequelize-typescript';

export abstract class RepositorySequelize<E extends Entity, Props = any>
  implements RepositoryInterface<E>
{
  protected readonly model: ModelCtor<Model<Props, Props>>;

  protected readonly toEntity: (props: Props) => E | Promise<E>;

  protected readonly toModel: (entity: E) => Props;

  constructor(
    model: ModelCtor<Model<Props, Props>>,
    toEntity: (props: Props) => E | Promise<E>,
    toModel: (entity: E) => Props
  ) {
    this.model = model;
    this.toEntity = toEntity;
    this.toModel = toModel;
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
    const modelProps = this.toModel(entity);
    const model = await this.model.create(modelProps as any);
    await model.save();
  }

  async update(entity: E): Promise<void> {
    const model = await this.model.findByPk(entity.id);
    if (!model) {
      throw new NotFoundError();
    }
    const modelProps = await this.toModel(entity);
    await model.update(modelProps);
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
    const modelProps = entities.map((entity) => this.toModel(entity));

    await this.model.bulkCreate(modelProps as any);
  }
}
