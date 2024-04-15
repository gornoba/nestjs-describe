import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';
import { UserEntity } from 'src/db/entities/user.entity';

export class UsersDto extends PickType(UserEntity, [
  'id',
  'username',
  'roles',
] as const) {
  @ApiProperty({
    example: '12',
  })
  @IsNotEmpty()
  @IsNumberString()
  password: string;
}
