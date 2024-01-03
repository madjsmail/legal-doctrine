import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly confirmPassword: string;

  @ApiProperty()
  role: string;

  // @ApiProperty()
  // @IsNotEmpty()

  // readonly emailValidationCode: string;

  // @ApiProperty()
  // @IsNotEmpty()

  // readonly  isValidEmail: boolean;
}
