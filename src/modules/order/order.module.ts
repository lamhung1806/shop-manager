import { Module } from '@nestjs/common';
import { TiktokModule } from '../tiktok/tiktok.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [TiktokModule, NotificationModule],
})
export class OrderModule {}
