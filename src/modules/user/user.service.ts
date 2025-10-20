import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repository/user.repository';
import { LoginDto, RegisterDto } from '../auth/_dto';
import * as bcrypt from 'bcrypt';
import { Common } from 'src/utils/comon';
import { ChangePasswordDto } from './user-response-dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(registerDto: RegisterDto) {
    const [emailExist, checkUsername] = await Promise.all([
      this.userRepository.findByEmail(registerDto.email),
      this.userRepository.findByUserName(registerDto.username),
    ]);

    if (emailExist) {
      throw new BadRequestException('Email is already in use');
    }

    if (checkUsername) {
      throw new BadRequestException('Username is already in use');
    }

    const salt = await bcrypt.genSalt();
    registerDto.password = await bcrypt.hash(registerDto.password, salt);
    return this.userRepository.create(registerDto);
  }

  async login(loginDto: LoginDto) {
    let user = null;

    if (loginDto.username) {
      user = await this.userRepository.findByUserName(loginDto.username);
    } else if (loginDto.email) {
      user = await this.userRepository.findByEmail(loginDto.email);
    }

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid password');
    }

    return user;
  }

  async getById(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return Common.excludeFields(user, ['password', 'refreshToken']);
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const isMatch = await bcrypt.compare(
        changePasswordDto.oldPassword,
        user.password,
      );
      if (!isMatch) {
        throw new BadRequestException('Invalid old password');
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(
        changePasswordDto.newPassword,
        salt,
      );

      await this.userRepository.updateUser(userId, {
        password: hashedPassword,
      });

      return {
        message: 'Password changed successfully',
        userId,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        'Failed to change password. Please try again.',
      );
    }
  }
}
