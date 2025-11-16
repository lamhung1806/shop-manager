import { Global, Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { FileRepository } from './file.repository';
import { ShopRepository } from './shop.repository';
import { OrderRepository } from './order.repository';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TiktokModule } from 'src/modules/tiktok/tiktok.module';

const repositories = [
  UserRepository,
  FileRepository,
  ShopRepository,
  OrderRepository,
];

@Global()
@Module({
  imports: [PrismaModule, HttpModule, ConfigModule, TiktokModule],
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
