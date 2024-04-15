import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { AbstractRepository } from '../common/abstract.repository';
import { CatsEntity } from '../entities/cat.entity';

@Injectable()
export class CatsRepository extends AbstractRepository<CatsEntity> {
  constructor(cls: ClsService) {
    super(cls);
  }
}
