import { Injectable } from '@nestjs/common';
import { LoginDto, PayloadUser, RegisterDto } from './_dto';
import { UserRepository } from 'src/repository/user.repository';
import { UserService } from '../user/user.service';
import { User } from 'generated/prisma';
import { JwtService } from '@nestjs/jwt';
import { JWT_CONTAIN } from 'src/constants/common';
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
      secret: JWT_CONTAIN.SECRET,
      expiresIn: 1800, //30m-
    });
  }

  private async generateRefreshToken(payload: PayloadUser) {
    return this.jwtService.signAsync(payload, {
      secret: JWT_CONTAIN.REFRESH_TOKEN_SECRET,
      expiresIn: '7d',
    });
  }
}
