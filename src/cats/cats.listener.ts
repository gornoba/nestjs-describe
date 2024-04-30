import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CatsRepository } from '../db/repositories/cat.repository';
import { CatsEntity } from 'src/db/entities/cat.entity';
import { queryRunnerAls } from 'src/lib/decorators/transaction.decorator';
import { DataSource } from 'typeorm';

@Injectable()
export class CatsListener {
  constructor(
    private readonly catsRepository: CatsRepository,
    private readonly dataSource: DataSource,
  ) {}

  @OnEvent('cat.updated')
  catUpdatedListen(event: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    queryRunnerAls.run({ queryRunner }, async () => {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const result = await this.catsRepository.upsert(CatsEntity, [event]);
        console.log('🚀 ~ CatsListener ~ queryRunnerAls.run ~ result:', result);
        await queryRunner.commitTransaction();
        return result;
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    });
  }
}
