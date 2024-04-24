import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { AbstractRepository } from '../common/abstract.repository';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class UserRepository extends AbstractRepository<UserEntity> {
  constructor(als: AsyncLocalStorage<any>) {
    super(als);
  }
}
