import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [ShopController],
  providers: [ShopService],
})
export class ShopModule {}
