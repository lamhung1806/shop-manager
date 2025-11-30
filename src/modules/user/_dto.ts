import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ROLE } from 'generated/prisma';
import { PaginationRequest } from 'src/shared/_dto';

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

export class GetAllUserDto extends PaginationRequest {
  @ApiProperty({
    description: 'search by username or email',
    required: false,
    type: String,
  })
  searchText?: string;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'User Role',
    required: true,
    type: String,
    enum: ROLE,
  })
  @IsEnum(ROLE)
  role: ROLE;
}
