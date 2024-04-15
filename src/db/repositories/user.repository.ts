import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { UserEntity } from '../entities/user.entity';
import { AbstractRepository } from '../common/abstract.repository';

@Injectable()
export class UserRepository extends AbstractRepository<UserEntity> {
  constructor(cls: ClsService) {
    super(cls);
  }
}
