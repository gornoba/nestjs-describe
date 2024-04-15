import { TRANSACTION_CONSTANT } from '../constants/transaction.constant';
import { DataSource } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { Aspect } from './aspect.decorator';
import {
  LazyDecorator,
  WrapParams,
} from '../interfaces/lazy-decorator.interface';
import { createAopDecorator } from './create-aop.decorator';

@Aspect(TRANSACTION_CONSTANT)
export class Transaction implements LazyDecorator<any, any> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly cls: ClsService,
  ) {}

  wrap({ method }: WrapParams<any, any>) {
    return async (...args: any) => {
      const queryRunner = this.dataSource.createQueryRunner();
      this.cls.set('transaction', queryRunner.manager);

      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const result = await method(...args);
        await queryRunner.commitTransaction();

        return result;
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    };
  }
}

export const TransactionDeco = (metadata?: { db?: string }) =>
  createAopDecorator(TRANSACTION_CONSTANT, metadata);
