import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { CatsRepository } from './repositories/cat.repository';

@Module({
  imports: [TypeOrmModule.forFeature()],
  providers: [UserRepository, CatsRepository],
  exports: [UserRepository, CatsRepository],
})
export class DbModule {}
