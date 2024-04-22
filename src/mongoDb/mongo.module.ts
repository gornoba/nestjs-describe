import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongoController } from './mongo.controller';
import { MongoService } from './mongo.service';
import { PersonMongoRepository } from './repositories/persion.mongo.repository';
import { PersonMongoEntity } from './entities/person.mongo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PersonMongoEntity], 'mongo')],
  controllers: [MongoController],
  providers: [MongoService, PersonMongoRepository],
  exports: [],
})
export class MongoModule {}
