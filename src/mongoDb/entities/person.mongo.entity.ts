import { Column, Entity } from 'typeorm';
import { AbstractMongoEntity } from '../common/abstract.document.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CatsMongoEntity } from '../sub-document/cat.mongo.entity';

@Entity({
  name: 'person',
})
export class PersonMongoEntity extends AbstractMongoEntity {
  @ApiProperty({
    description: 'The name of a person',
    example: 'John Doe',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Column({
    type: 'varchar',
  })
  name: string;

  @Column(() => CatsMongoEntity)
  cats: CatsMongoEntity[];
}
