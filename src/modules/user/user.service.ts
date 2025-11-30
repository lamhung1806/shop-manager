import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/repository/user.repository';
import { Common } from 'src/utils/comon';
import { LoginDto, RegisterDto } from '../auth/_dto';
import { ChangePasswordDto, GetAllUserDto, UpdateUserDto } from './_dto';
import { PaginationResponse } from '../common/_dto';
import { Message } from 'src/shared/utils';
import { ROLE } from 'src/shared/type';

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

  async createAdmin() {
    const adminExists = await this.userRepository.findByUserName('admin');
    if (adminExists) {
      return new ConflictException('Admin user already exists');
    } else {
      const salt = await bcrypt.genSalt();
      const createAdminDto: RegisterDto = {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin',
        confirmPassword: 'admin',
        role: 'ADMIN',
      };
      const hashedPassword = await bcrypt.hash('admin', salt);
      createAdminDto.password = hashedPassword;
      return this.userRepository.create(createAdminDto);
    }
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

  async getAllUsers(params: GetAllUserDto) {
    const users = await this.userRepository.getAllUser(params);
    const filteredUsers = users.map((user) =>
      Common.excludeFields(user, ['password', 'refreshToken']),
    );
    return new PaginationResponse(filteredUsers, filteredUsers.length, params);
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const findUser = await this.userRepository.findById(userId);
    if (!findUser) {
      throw new BadRequestException('User not found');
    }
    if (findUser.role === ROLE.ADMIN) {
      throw new BadRequestException('Cannot update admin user');
    }

    await this.userRepository.updateUser(userId, updateUserDto);
    return new Message('User updated successfully');
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
