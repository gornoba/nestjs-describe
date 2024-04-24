import { Module } from '@nestjs/common';
import { MongoController } from './mongo.controller';
import { MongoService } from './mongo.service';
import { PersonMongoRepository } from './repositories/persion.mongo.repository';
import { LibModule } from 'src/lib/lib.module';

@Module({
  imports: [LibModule],
  controllers: [MongoController],
  providers: [MongoService, PersonMongoRepository],
  exports: [],
})
export class MongoModule {}
