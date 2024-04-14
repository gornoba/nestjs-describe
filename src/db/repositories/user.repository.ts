import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { DataSource } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { AbstractRepository } from '../common/abstract.repository';

@Injectable()
export class UserRepository extends AbstractRepository<UserEntity> {
  constructor(dataSource: DataSource, cls: ClsService) {
    super(dataSource, cls);
  }
}
