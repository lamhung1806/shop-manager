import { Global, Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { ProductRepository } from './product.repository';
import { FileRepository } from './file.repository';
import { OrderRepository } from './order.repository';
import { CartRepository } from './cart.repository';

const repositories = [
  UserRepository,
  ProductRepository,
  FileRepository,
  OrderRepository,
  CartRepository,
];

@Global()
@Module({
  imports: [PrismaModule],
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
