import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { JWT_CONTAIN } from 'src/constants/common';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_CONTAIN.SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, UserService],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
