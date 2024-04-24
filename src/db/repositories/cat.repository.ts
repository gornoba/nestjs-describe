import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../common/abstract.repository';
import { CatsEntity } from '../entities/cat.entity';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class CatsRepository extends AbstractRepository<CatsEntity> {
  constructor(als: AsyncLocalStorage<any>) {
    super(als);
  }
}
