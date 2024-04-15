import { BadRequestException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import {
  DeepPartial,
  EntityManager,
  EntityTarget,
  FindManyOptions,
} from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { UserEntity } from '../entities/user.entity';

export abstract class AbstractRepository<T extends AbstractEntity> {
  constructor(protected readonly cls: ClsService) {}

  async find(
    entity: EntityTarget<T>,
    options?: FindManyOptions,
  ): Promise<T[] | T | UserEntity> {
    const queryRunner: EntityManager = this.cls.get('transaction');
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
    const queryRunner: EntityManager = this.cls.get('transaction');
    const userInfo = this.cls.get('userId');
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

    if (userInfo) {
      tmpArr.forEach((item) => {
        item.user = userInfo;
      });
    }
    const result = await repository.save(tmpArr);
    return result.length === 1 ? (result[0] as T) : (result as T[]);
  }

  async delete(entity: EntityTarget<T>, id: number): Promise<T> {
    const queryRunner: EntityManager = this.cls.get('transaction');
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
    return this.cls.get('transaction');
  }
}
