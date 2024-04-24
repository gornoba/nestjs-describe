import { BadRequestException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import {
  DeepPartial,
  EntityManager,
  EntityTarget,
  FindManyOptions,
} from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { transactionQueryRunner } from 'src/lib/decorators/transaction.decorator';
import { AsyncLocalStorage } from 'async_hooks';

export abstract class AbstractRepository<T extends AbstractEntity> {
  constructor(private readonly als: AsyncLocalStorage<any>) {}

  async find(
    entity: EntityTarget<T>,
    options?: FindManyOptions,
  ): Promise<T[] | T | UserEntity> {
    const queryRunner: EntityManager = transactionQueryRunner();
    const repository = queryRunner.getRepository<T>(entity);
    const result = await repository.find(options);

    if (result.length === 1) {
      return result[0];
    }

    return result;
  }

  async upsert(
    entity: EntityTarget<T>,
    data: DeepPartial<T[]>,
  ): Promise<T[] | T> {
    const queryRunner: EntityManager = transactionQueryRunner();
    const als = this.als.getStore();

    const repository = queryRunner.getRepository<T>(entity);
    const tmpArr = [];

    for (const item of data) {
      try {
        if (item?.id) {
          const findOne = await this.find(entity, {
            where: { id: item.id },
          });

          if (!findOne) {
            throw new BadRequestException(`${item.id} Not found`);
          }

          const updatData = Object.assign(findOne, item);
          tmpArr.push(updatData);
        } else {
          tmpArr.push(item);
        }
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }

    if (als && als['userInfo']) {
      tmpArr.forEach((item) => {
        item.user = als['userInfo'];
      });
    }
    const result = await repository.save(tmpArr);
    return result.length === 1 ? (result[0] as T) : (result as T[]);
  }

  async delete(entity: EntityTarget<T>, id: number): Promise<T> {
    const queryRunner: EntityManager = transactionQueryRunner();
    const repository = queryRunner.getRepository<T>(entity);
    const findOne = (await this.find(entity, {
      where: { id },
    })) as T;

    if (!findOne) {
      throw new BadRequestException(`${id} Not found`);
    }

    return repository.remove(findOne);
  }

  createQueryBuilder(): EntityManager {
    return transactionQueryRunner();
  }
}
