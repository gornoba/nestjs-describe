import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { EntityManager } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly cls: ClsService) {}

  findAll() {
    const queryRunner: EntityManager = this.cls.get('transaction');
    return queryRunner.getRepository(UserEntity).find();
  }
}
