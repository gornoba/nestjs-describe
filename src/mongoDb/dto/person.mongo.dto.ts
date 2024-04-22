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
