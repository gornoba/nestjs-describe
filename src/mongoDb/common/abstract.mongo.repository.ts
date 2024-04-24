import { AbstractMongoEntity } from './abstract.document.entity';
import {
  DeepPartial,
  EntityManager,
  EntityTarget,
  FilterOperators,
  FindManyOptions,
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { transactionQueryRunner } from 'src/lib/decorators/transaction.decorator';

export abstract class AbstractMongoRepository<T extends AbstractMongoEntity> {
  async findAll(
    mongoEntity: EntityTarget<T>,
    options?: FindManyOptions<T> | Partial<T> | FilterOperators<T>,
  ): Promise<T[]> {
    const queryRunner: EntityManager = transactionQueryRunner();
    return queryRunner.getMongoRepository(mongoEntity).find(options);
  }

  async findOne(mongoEntity: EntityTarget<T>, id: string): Promise<T | null> {
    const queryRunner: EntityManager = transactionQueryRunner();
    return queryRunner.getMongoRepository(mongoEntity).findOne({
      where: { _id: new ObjectId(id) },
    });
  }

  async create(mongoEntity: EntityTarget<T>, body: DeepPartial<T>): Promise<T> {
    const queryRunner: EntityManager = transactionQueryRunner();
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
    const queryRunner: EntityManager = transactionQueryRunner();
    return queryRunner.getMongoRepository(mongoEntity).deleteMany({});
  }

  async deleteOne(
    mongoEntity: EntityTarget<T>,
    id: string,
  ): Promise<{
    acknowledged: boolean;
    deletedCount: number;
  }> {
    const queryRunner: EntityManager = transactionQueryRunner();
    return queryRunner
      .getMongoRepository(mongoEntity)
      .deleteOne({ _id: new ObjectId(id) });
  }

  queryRunner(): EntityManager {
    return transactionQueryRunner();
  }
}
