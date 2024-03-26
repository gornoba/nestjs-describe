import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
