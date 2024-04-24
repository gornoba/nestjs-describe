import { Column, Entity, Index, OneToMany, Relation } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';
import { CatsEntity } from './cat.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/lib/auth/rbac/rbac.role';

@Entity({
  name: 'users',
})
@Index(['username'])
export class UserEntity extends AbstractEntity {
  @ApiProperty({
    example: 'atreides',
  })
  @IsNotEmpty()
  @IsString()
  @Column({
    type: 'varchar',
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
  })
  @Exclude()
  password?: string;

  @Column({
    type: 'simple-array',
    default: Role.User,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: Array<string>;

  @OneToMany(() => CatsEntity, (cat) => cat.user)
  cat: Relation<CatsEntity>;

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
