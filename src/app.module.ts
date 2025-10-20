import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RepositoryModule } from './repository/repository.module';

@Module({
  imports: [AuthModule, RepositoryModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
