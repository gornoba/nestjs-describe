import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CatsEntity } from 'src/db/entities/cat.entity';

export class CreateCatDto extends PickType(CatsEntity, [
  'name',
  'age',
  'breed',
] as const) {}

export class UpdateCatDto extends PartialType(CreateCatDto) {}

export class ArrayCreateCatDto {
  @ApiProperty({
    description: 'The datas of a cat',
    required: true,
    type: [CreateCatDto],
  })
  @ValidateNested({ each: true })
  @Type(() => CreateCatDto)
  @IsArray()
  data: CreateCatDto[];
}

export class CatsDto extends IntersectionType(CreateCatDto) {
  @ApiProperty({
    description: 'The id of a cat',
    example: 1,
    type: Number,
  })
  id: number;
}

export const createCatStub = (): CreateCatDto => ({
  name: 'Whiskers',
  age: 5,
  breed: 'Siames',
});

export const updateCatStub = (): UpdateCatDto => ({
  breed: 'foo',
});

export const catsStub = (): CatsDto => ({
  id: 1,
  name: 'Whiskers',
  age: 5,
  breed: 'Siames',
});
