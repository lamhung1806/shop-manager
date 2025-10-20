import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JWT_CONTAIN } from 'src/constants/common';
import { UserRepository } from 'src/repository/user.repository';
import { CustomException } from '../exception/custom.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      request['user'] = await this.jwtService.verifyAsync(token, {
        secret: JWT_CONTAIN.SECRET,
      });

      const userData = await this.userRepository.findById(request.user?.id);
      if (!userData) {
        throw new CustomException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch {
      throw new CustomException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
