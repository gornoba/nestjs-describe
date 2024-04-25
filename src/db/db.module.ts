import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { CatsRepository } from './repositories/cat.repository';
import { CatsEntity } from './entities/cat.entity';
import { UserEntity } from './entities/user.entity';
import { LibModule } from 'src/lib/lib.module';
import { LatencyRepository } from './repositories/latency.repository';
import { LatencyEntity } from './entities/latency.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CatsEntity, UserEntity, LatencyEntity]),
    LibModule,
  ],
  providers: [UserRepository, CatsRepository, LatencyRepository],
  exports: [UserRepository, CatsRepository, LatencyRepository],
})
export class DbModule {}
