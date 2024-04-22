import { Column, Entity, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { AbstractSubDocumentEntity } from '../common/abstract.subdocument.entity';

@Entity({
  name: 'cats',
})
export class CatsMongoEntity extends AbstractSubDocumentEntity {
  @ApiProperty({
    description: 'The name of a cat',
    example: 'Kitty',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Column({
    type: 'varchar',
  })
  @Index()
  name: string;

  @ApiProperty({
    description: 'The age of a cat',
    example: 3,
    required: true,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  @Column({
    type: 'int',
  })
  age: number;

  @ApiProperty({
    description: 'The breed of a cat',
    example: 'Scottish Fold',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Column({
    type: 'varchar',
  })
  breed: string;

  constructor(cat: CatsMongoEntity) {
    super();
    Object.assign(this, cat);
  }
}
