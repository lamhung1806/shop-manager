import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';
import { ROLE } from 'generated/prisma';
import { Match } from 'src/decorators/match.decorator';

export class LoginDto {
  @ApiProperty({
    description: 'Username of the client (required if email is not provided)',
    type: String,
    required: false,
  })
  @ValidateIf((o) => !o.email)
  @IsNotEmpty({ message: 'Username is required when email is not provided' })
  username?: string;

  @ApiProperty({
    description: 'Email of the client (required if username is not provided)',
    type: String,
    required: false,
  })
  @ValidateIf((o) => !o.username)
  @IsNotEmpty({ message: 'Email is required when username is not provided' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @ApiProperty({
    description: 'Password of the client',
  })
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    description: 'Username of the client',
    type: String,
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Email of the client',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    description: 'Password of the client',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Confirm password of the user',
  })
  @Match('password', { message: 'Confirm password does not match' })
  confirmPassword: string;
}

export class PayloadUser {
  id: string;
  email: string;
  role: ROLE;
}
