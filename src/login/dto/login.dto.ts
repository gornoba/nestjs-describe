import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class UsersDto {
  id: number;

  @IsNotEmpty()
  @IsString()
  username: string;

  @Exclude()
  @IsNotEmpty()
  @IsNumberString()
  password: string;

  constructor(partial: Partial<UsersDto>) {
    Object.assign(this, partial);
  }
}
