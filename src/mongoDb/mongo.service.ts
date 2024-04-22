import { Injectable } from '@nestjs/common';
import { TransactionDeco } from 'src/lib/decorators/transaction.decorator';
import { CatMongoDto } from './dto/cat.mongo.dto';
import { PersonMongoDto } from './dto/person.mongo.dto';
import { PersonMongoRepository } from './repositories/persion.mongo.repository';
import { PersonMongoEntity } from './entities/person.mongo.entity';

@Injectable()
export class MongoService {
  constructor(private readonly personMongoRepository: PersonMongoRepository) {}

  @TransactionDeco('mongo')
  async findAll() {
    return await this.personMongoRepository.findAll(PersonMongoEntity);
  }

  @TransactionDeco('mongo')
  async findOne(id: string) {
    return await this.personMongoRepository.findOne(PersonMongoEntity, id);
  }

  @TransactionDeco('mongo')
  async create(body: CatMongoDto) {
    return await this.personMongoRepository.create(PersonMongoEntity, body);
  }

  @TransactionDeco('mongo')
  async deleteAll() {
    return await this.personMongoRepository.deleteAll(PersonMongoEntity);
  }

  @TransactionDeco('mongo')
  async deleteOne(id: string) {
    return await this.personMongoRepository.deleteOne(PersonMongoEntity, id);
  }

  @TransactionDeco('mongo')
  async createPerson(body: PersonMongoDto) {
    return await this.personMongoRepository.createPerson(body);
  }
}
