import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { CatsRepository } from './repositories/cat.repository';
import { CatsEntity } from './entities/cat.entity';
import { UserEntity } from './entities/user.entity';
import { LibModule } from 'src/lib/lib.module';

@Module({
  imports: [TypeOrmModule.forFeature([CatsEntity, UserEntity]), LibModule],
  providers: [UserRepository, CatsRepository],
  exports: [UserRepository, CatsRepository],
})
export class DbModule {}
