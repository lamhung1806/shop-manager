import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ROLE } from 'generated/prisma';

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  role: ROLE;
  createdAt: Date;
  updatedAt: Date;
  phoneNumber?: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Old password of the user',
  })
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    description: 'New password of the user',
  })
  @IsNotEmpty()
  newPassword: string;
}
