import { BadRequestException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import {
  DataSource,
  DeepPartial,
  EntityTarget,
  FindManyOptions,
} from 'typeorm';

export abstract class AbstractRepository<T extends AbstractEntity> {
  constructor(protected readonly dataSource: DataSource) {}

  async find(
    entity: EntityTarget<T>,
    options?: FindManyOptions,
  ): Promise<T[] | T> {
    const repository = this.dataSource.getRepository<T>(entity);
    const result = await repository.find(options);

    if (result.length === 1) {
      return result[0];
    }

    return result;
  }

  async upsert(entity: EntityTarget<T>, data: DeepPartial<T[]>): Promise<T[]> {
    const repository = this.dataSource.getRepository<T>(entity);
    const tmpArr = [];

    for (const item of data) {
      try {
        if (item?.id) {
          const findOne = await this.find(entity, {
            where: {
              id: item.id,
            },
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

    return repository.save(tmpArr);
  }

  createQueryBuilder() {
    return this.dataSource.createQueryBuilder();
  }
}
