import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';

@Entity({
  name: 'users',
})
@Index(['email'], { unique: true })
@Index(['name'])
export class UserEntity extends AbstractEntity {
  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
  })
  password: string;

  @Column({
    type: 'simple-array',
    default: ['user'],
  })
  role: Array<string>;
}
