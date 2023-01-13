import {
  Entity,
  NotFoundError,
  RepositoryInterface,
  UniqueEntityId,
} from '@root/domain';
import { Model, ModelCtor } from 'sequelize-typescript';

export abstract class RepositorySequelize<
  E extends Entity,
  PropsDTO = any,
  PropsCreation = any
> implements RepositoryInterface<E>
{
  protected readonly model: ModelCtor<Model<PropsDTO, PropsCreation>>;

  protected readonly toEntity: (props: PropsDTO) => E;

  protected readonly toModel: (entity: E) => PropsDTO;

  constructor(
    model: ModelCtor<Model<PropsDTO, PropsCreation>>,
    toEntity: (props: PropsDTO) => E,
    toModel: (entity: E) => PropsDTO
  ) {
    this.model = model;
    this.toEntity = toEntity;
    this.toModel = toModel;
  }

  async findAll(options?: { limit?: number; offset?: number }): Promise<E[]> {
    const entities = await this.model.findAll({
      limit: options?.limit,
      offset: options?.offset,
    });
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
    const modelPropsDTO = this.toModel(entity);
    const model = await this.model.create(modelPropsDTO as any);
    await model.save();
  }

  async update(entity: E): Promise<void> {
    const model = await this.model.findByPk(entity.id);
    if (!model) {
      throw new NotFoundError();
    }
    const modelPropsDTO = this.toModel(entity);
    await model.update(modelPropsDTO);
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
    const modelPropsDTO = entities.map((entity) => this.toModel(entity));

    await this.model.bulkCreate(modelPropsDTO as any);
  }
}
