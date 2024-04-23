import { ApiProperty, PickType } from '@nestjs/swagger';
import { PersonMongoEntity } from '../entities/person.mongo.entity';
import { Type } from 'class-transformer';
import { CatMongoDto } from './cat.mongo.dto';
import { ValidateNested } from 'class-validator';

export class PersonMongoDto extends PickType(PersonMongoEntity, [
  'name',
] as const) {
  @ApiProperty({
    type: [CatMongoDto],
    description: 'The cats of a person',
  })
  @ValidateNested({ each: true })
  @Type(() => CatMongoDto)
  cats: CatMongoDto[];
}

export const personMongoStub = () => ({
  id: '6625f932f0bdee85de4bfadd',
  name: 'John Doe',
  creatAt: new Date(),
  updateAt: new Date(),
  cats: [
    {
      id: '6625f932f0bdee85de4bfadd',
      name: 'Kitty',
      age: 3,
      breed: 'Scottish Fold',
      creatAt: new Date(),
      updateAt: new Date(),
    },
  ],
});
