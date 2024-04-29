import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { DbModule } from 'src/db/db.module';
import { CatsCacheService } from './cats-cache.service';
import { BullModule } from '@nestjs/bull';
import { CatsQueue } from './cats.queue';

@Module({
  imports: [DbModule, BullModule.registerQueue({ name: 'cats' })],
  controllers: [CatsController],
  providers: [CatsService, CatsCacheService, CatsQueue],
})
export class CatsModule {}
