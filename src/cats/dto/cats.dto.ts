import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateCatDto {
  @ApiProperty({
    description: 'The name of a cat',
    example: 'Kitty',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The age of a cat',
    example: 3,
    required: true,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ApiProperty({
    description: 'The breed of a cat',
    example: 'Scottish Fold',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  breed: string;
}

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

export class CatsDto extends CreateCatDto {
  @ApiProperty({
    description: 'The id of a cat',
    example: 1,
    type: Number,
  })
  id: number;

  constructor(cat: { id: number; name: string; age: number; breed: string }) {
    super();
    Object.assign(this, cat);
  }
}
