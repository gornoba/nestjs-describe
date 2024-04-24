import { TRANSACTION_CONSTANT } from '../constants/transaction.constant';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { Aspect } from './aspect.decorator';
import {
  LazyDecorator,
  WrapParams,
} from '../interfaces/lazy-decorator.interface';
import { createAopDecorator } from './create-aop.decorator';
import { BadRequestException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { AsyncLocalStorage } from 'async_hooks';

@Aspect(TRANSACTION_CONSTANT)
export class Transaction implements LazyDecorator<any, string> {
  constructor(
    @InjectDataSource('mongo') private readonly mongoDataSource: DataSource,
    private readonly dataSource: DataSource,
  ) {}

  wrap({ method, metadata }: WrapParams<any, string>) {
    return async (...args: any) => {
      const queryRunner =
        metadata === 'mongo'
          ? this.mongoDataSource.createQueryRunner()
          : this.dataSource.createQueryRunner();

      return await queryRunnerAls.run({ queryRunner }, async () => {
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
          const result = await method(...args);
          await queryRunner.commitTransaction();

          return result;
        } catch (error) {
          await queryRunner.rollbackTransaction();
          throw new BadRequestException(error.message);
        } finally {
          await queryRunner.release();
        }
      });
    };
  }
}

export const TransactionDeco = (metadata?: string) =>
  createAopDecorator(TRANSACTION_CONSTANT, metadata);

export const queryRunnerAls = new AsyncLocalStorage<{
  queryRunner: QueryRunner;
}>();

export const transactionQueryRunner = () => {
  const { queryRunner } = queryRunnerAls.getStore();
  return queryRunner.manager as EntityManager;
};
