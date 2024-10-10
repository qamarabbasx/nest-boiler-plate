import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
   MinLength,
} from 'class-validator';
import { error as ERROR } from './constants';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {


  @ApiProperty({
    description: 'The email of the user. This should be a unique identifier for the user.',
    example: 'john_doe@gmail.com',
    type: String,
    minLength: 7,
    maxLength: 50
  })
  @IsNotEmpty({ message: ERROR.EMAIL })
  @IsEmail({},{message:'Invalid email address. Please provide a valid email.'})
  email: string;


  @ApiProperty({
    description: 'The password of the user. This should be a unique identifier for the user.',
    example: 'john_doe',
    type: String,
    minLength: 7,
    maxLength: 50
  })
  @IsString({ message: ERROR.PASSWORD_REQUIRED })
  @IsNotEmpty({ message: ERROR.PASSWORD_REQUIRED })
  @MinLength(8, { message: ERROR.PASSWORD_MIN_LENGTH })
  password: string;


  @ApiProperty({
    description: 'The user of the user. This should be a unique identifier for the user.',
    example: 'john_doe',
    type: String,
    minLength: 7,
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'The phone number of the user. This should be a unique identifier for the user.',
    example: '1234567',
    type: String,
    minLength: 7,
    maxLength: 50
  })
  @IsNotEmpty({ message: ERROR.PHONE_REQUIRED })
  phone: string;

}

export class CreateGuestUserDto {
  @IsString()
  @IsNotEmpty()
  appId: string;
}
