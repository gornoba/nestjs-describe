import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { CatsRepository } from './repositories/cat.repository';
import { CatsEntity } from './entities/cat.entity';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CatsEntity, UserEntity])],
  providers: [UserRepository, CatsRepository],
  exports: [UserRepository, CatsRepository],
})
export class DbModule {}
