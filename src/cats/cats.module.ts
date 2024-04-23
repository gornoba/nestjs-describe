import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { DbModule } from 'src/db/db.module';
import { CatsCacheService } from './cats-cache.service';

@Module({
  imports: [DbModule],
  controllers: [CatsController],
  providers: [CatsService, CatsCacheService],
})
export class CatsModule {}
