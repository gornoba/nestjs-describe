import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { UserEntity } from './user.entity';

@Entity({
  name: 'cats',
})
export class CatsEntity extends AbstractEntity {
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

  @ManyToOne(() => UserEntity, (user) => user.cat)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: Relation<UserEntity[]>;
}
