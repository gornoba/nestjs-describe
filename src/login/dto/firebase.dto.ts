import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class FirebaseUidDto {
  @ApiProperty({
    description: 'Firebase uid',
    example: 'wxEVC0eOcydIRJOfcmTDyOBo1I32',
  })
  @IsString()
  @IsNotEmpty()
  uid: string;
}

export class FirebaseEmailDto {
  @ApiProperty({
    description: 'Firebase email',
    example: 'example@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  emailVerified?: boolean;
}

export class FirebaseCreateAccountDto {
  @ApiProperty({
    description: 'Firebase phone number',
    example: '+1650-555-9999',
  })
  @IsString()
  @Matches(/^\+82|\+1[0-9]{10}$/)
  @Transform(({ value }) => {
    const replaceHiphen = value.replace(/-/g, '');
    const transPhoneNumber = /^0/.test(replaceHiphen)
      ? replaceHiphen.replace(/^0/, '+82')
      : replaceHiphen;
    return transPhoneNumber;
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'Firebase display name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @ApiProperty({
    description: 'Firebase disabled',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  disabled?: boolean;
}
