import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto, PayloadUser, RegisterDto } from './_dto';
import { UserRepository } from 'src/repository/user.repository';
import { UserService } from '../user/user.service';
import { User } from 'generated/prisma';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from '../user/user-response-dto';

@Injectable()
export class AuthService {
  constructor(
    readonly userRepository: UserRepository,
    readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    const user = await this.userService.login(loginDto);
    return this.processAccessToken(user);
  }

  async register(registerDto: RegisterDto) {
    return this.userService.create(registerDto);
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    await this.userService.getById(userId);

    return this.userService.changePassword(userId, changePasswordDto);
  }

  async refreshToken(refreshToken: string) {
    const refreshTokenUser = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    if (!refreshTokenUser || !refreshTokenUser.id) {
      throw new BadRequestException('Invalid refresh token');
    }

    const user = await this.userRepository.findById(refreshTokenUser.id);
    if (!user || user.refreshToken !== refreshToken) {
      throw new BadRequestException('Invalid refresh token');
    }
    return this.processAccessToken(user);
  }

  private async processAccessToken(user: User) {
    const payload: PayloadUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    await this.userRepository.updateRefreshToken(user.id, refreshToken);

    return {
      ...payload,
      accessToken,
      refreshToken,
    };
  }

  private async generateAccessToken(payload: PayloadUser) {
    return this.jwtService.signAsync(payload, {
      secret: process.env.SECRET,
      expiresIn: '1d',
    });
  }

  private async generateRefreshToken(payload: PayloadUser) {
    return this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '7d',
    });
  }
}
