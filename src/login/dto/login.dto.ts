import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class UsersDto {
  id: number;

  @ApiProperty({
    example: 'atreides',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: '12',
  })
  @Exclude()
  @IsNotEmpty()
  @IsNumberString()
  password?: string;

  constructor(partial: Partial<UsersDto>) {
    Object.assign(this, partial);
  }
}
