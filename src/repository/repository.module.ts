import { Global, Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PrismaModule } from 'src/modules/prisma/prisma.module';

const repositories = [UserRepository];

@Global()
@Module({
  imports: [PrismaModule],
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
