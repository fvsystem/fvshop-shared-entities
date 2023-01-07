import { EntityMock, MockProps, NotFoundError } from '@root/domain';
import { setupSequelize } from '@root/infrastructure/testing';
import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { RepositorySequelize } from './db.repository.sequelize';

@Table({ tableName: 'fake_entity' })
class EntityModel extends Model<MockProps & { id: string }> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;
}

const mapper = (props: MockProps & { id: string }): EntityMock =>
  new EntityMock({ name: props.name }, props.id);

const toModel = (entity: EntityMock): MockProps & { id: string } => ({
  id: entity.id,
  name: entity.name,
});

class FakeRepository extends RepositorySequelize<
  EntityMock,
  MockProps & { id: string },
  MockProps & { id: string }
> {
  constructor() {
    super(EntityModel, mapper, toModel);
  }
}

describe('SequelizeRepository', () => {
  setupSequelize({ models: [EntityModel] });

  it('should insert', async () => {
    const entity = new EntityMock({ name: 'test' });
    const repository = new FakeRepository();
    await repository.insert(entity);
    const result = await repository.findById(entity.id);
    expect(result.id).toBe(entity.id);
    expect(result.name).toBe(entity.name);
  });

  it('should  bulk insert', async () => {
    const entity = new EntityMock({ name: 'test' });
    const entity2 = new EntityMock({ name: 'test2' });
    const repository = new FakeRepository();
    await repository.bulkInsert([entity, entity2]);
    const result = await repository.findAll();
    expect(result[0].id).toBe(entity.id);
    expect(result[0].name).toBe(entity.name);
    expect(result[1].id).toBe(entity2.id);
    expect(result[1].name).toBe(entity2.name);
  });

  it('should update', async () => {
    const entity = new EntityMock({ name: 'test' });
    const repository = new FakeRepository();
    await repository.insert(entity);
    const result = await repository.findById(entity.id);
    expect(result.id).toBe(entity.id);
    expect(result.name).toBe(entity.name);
    entity.name = 'test2';
    await repository.update(entity);
    const result2 = await repository.findById(entity.id);
    expect(result2.id).toBe(entity.id);
    expect(result2.name).toBe(entity.name);
  });

  it('should not update inexistent entity', async () => {
    const entity = new EntityMock({ name: 'test' });
    const repository = new FakeRepository();
    await expect(() => repository.update(entity)).rejects.toThrow(
      NotFoundError
    );
  });

  it('should not delete inexistent entity', async () => {
    const repository = new FakeRepository();
    await expect(() => repository.delete('123')).rejects.toThrow(NotFoundError);
  });

  it('should delete', async () => {
    const entity = new EntityMock({ name: 'test' });
    const repository = new FakeRepository();
    await repository.insert(entity);
    const result = await repository.findById(entity.id);
    expect(result.id).toBe(entity.id);
    expect(result.name).toBe(entity.name);
    await repository.delete(entity.id);
    await expect(() => repository.findById(entity.id)).rejects.toThrow(
      NotFoundError
    );
  });
});
