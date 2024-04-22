import { ClsService } from 'nestjs-cls';
import { AbstractMongoEntity } from './abstract.document.entity';
import {
  DeepPartial,
  EntityManager,
  EntityTarget,
  FilterOperators,
  FindManyOptions,
} from 'typeorm';
import { ObjectId } from 'mongodb';

export abstract class AbstractMongoRepository<T extends AbstractMongoEntity> {
  constructor(private readonly cls: ClsService) {}

  async findAll(
    mongoEntity: EntityTarget<T>,
    options?: FindManyOptions<T> | Partial<T> | FilterOperators<T>,
  ): Promise<T[]> {
    const queryRunner: EntityManager = this.cls.get('transaction');
    return queryRunner.getMongoRepository(mongoEntity).find(options);
  }

  async findOne(mongoEntity: EntityTarget<T>, id: string): Promise<T | null> {
    const queryRunner: EntityManager = this.cls.get('transaction');
    return queryRunner.getMongoRepository(mongoEntity).findOne({
      where: { _id: new ObjectId(id) },
    });
  }

  async create(mongoEntity: EntityTarget<T>, body: DeepPartial<T>): Promise<T> {
    const queryRunner: EntityManager = this.cls.get('transaction');
    const result = await queryRunner.getMongoRepository(mongoEntity).save(body);
    const idTransform = {
      ...result,
      _id:
        result._id instanceof ObjectId ? result._id.toHexString() : result._id,
    };

    return idTransform;
  }

  async deleteAll(mongoEntity: EntityTarget<T>): Promise<{
    acknowledged: boolean;
    deletedCount: number;
  }> {
    const queryRunner: EntityManager = this.cls.get('transaction');
    return queryRunner.getMongoRepository(mongoEntity).deleteMany({});
  }

  async deleteOne(
    mongoEntity: EntityTarget<T>,
    id: string,
  ): Promise<{
    acknowledged: boolean;
    deletedCount: number;
  }> {
    const queryRunner: EntityManager = this.cls.get('transaction');
    return queryRunner
      .getMongoRepository(mongoEntity)
      .deleteOne({ _id: new ObjectId(id) });
  }

  queryRunner(): EntityManager {
    return this.cls.get('transaction');
  }
}
