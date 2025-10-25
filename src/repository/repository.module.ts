import { Global, Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { ProductRepository } from './product.repository';
import { FileRepository } from './file.repository';

const repositories = [UserRepository, ProductRepository, FileRepository];

@Global()
@Module({
  imports: [PrismaModule],
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
