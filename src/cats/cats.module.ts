import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { DbModule } from 'src/db/db.module';
import { CatsCacheService } from './cats-cache.service';
import { BullModule } from '@nestjs/bull';
import { CatsQueue } from './cats.queue';
import { CatsListener } from './cats.listener';

@Module({
  imports: [DbModule, BullModule.registerQueue({ name: 'cats' })],
  controllers: [CatsController],
  providers: [CatsService, CatsCacheService, CatsQueue, CatsListener],
})
export class CatsModule {}
