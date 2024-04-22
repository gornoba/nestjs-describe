import { Injectable } from '@nestjs/common';
import { AbstractMongoRepository } from '../common/abstract.mongo.repository';
import { PersonMongoEntity } from '../entities/person.mongo.entity';
import { ClsService } from 'nestjs-cls';
import { EntityManager } from 'typeorm';
import { PersonMongoDto } from '../dto/person.mongo.dto';
import { CatsMongoEntity } from '../sub-document/cat.mongo.entity';

@Injectable()
export class PersonMongoRepository extends AbstractMongoRepository<PersonMongoEntity> {
  constructor(cls: ClsService) {
    super(cls);
  }

  async createPerson(body: PersonMongoDto) {
    const queryRuuner: EntityManager = this.queryRunner();
    const person = new PersonMongoEntity();
    person.name = body.name;
    person.cats = body.cats.map(
      (cat: CatsMongoEntity) => new CatsMongoEntity(cat),
    );

    const result = await queryRuuner
      .getMongoRepository(PersonMongoEntity)
      .save(person);

    return result;
  }
}
