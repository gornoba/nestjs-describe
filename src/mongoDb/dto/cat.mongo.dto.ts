import { ApiProperty, PickType } from '@nestjs/swagger';
import { CatsMongoEntity } from '../sub-document/cat.mongo.entity';
import { IsMongoId } from 'class-validator';

export class CatMongoDto extends PickType(CatsMongoEntity, [
  'name',
  'age',
  'breed',
] as const) {}

export class ObjectIdDto {
  @ApiProperty({
    description: 'Mongo Object Id',
    example: '6625f932f0bdee85de4bfadd',
  })
  @IsMongoId()
  id: string;
}

export const catMongoStub = () => ({
  id: '6625f932f0bdee85de4bfadd',
  name: 'Kitty',
  age: 3,
  breed: 'Scottish Fold',
});
