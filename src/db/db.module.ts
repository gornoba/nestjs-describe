import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature()],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class DbModule {}
