import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from 'src/repository/order.repository';
import { ShopRepository } from 'src/repository/shop.repository';
import { TikTokOrderResponse } from 'src/shared/types/order';
import { NotificationService } from '../notification/notification.service';
import { TiktokService } from '../tiktok/tiktok.service';
import { WebhookOrderDto } from './_dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly shopRepository: ShopRepository,
    private readonly tiktokService: TiktokService,
    private readonly orderRepository: OrderRepository,
    private readonly notificationService: NotificationService,
  ) {}
  async handleOrderWebhook(body: WebhookOrderDto) {
    const shopInfo = await this.shopRepository.findById(body.shop_id);
    if (!shopInfo) {
      throw new NotFoundException('Shop not found');
    }
    const order = await this.orderRepository.findById(body.data.order_id);
    const orderDetail: TikTokOrderResponse =
      await this.tiktokService.getOrderDetail({
        appKey: shopInfo.appKey,
        appSecret: shopInfo.appSecret,
        accessToken: shopInfo.tiktokToken.accessToken,
        shop_cipher: shopInfo.cipher,
        ids: [body.data.order_id],
      });

    await this.notificationService.sendOrderNotification(orderDetail.orders[0]);

    if (!order) {
      this.orderRepository
        .create({
          orderId: orderDetail.orders[0].id,
          shopId: body.shop_id,
          isDeleted: false,
          status: orderDetail.orders[0].status,
        })
        .catch((error) => {
          console.error('Failed to create order:', error);
        });
    }

    return {
      success: true,
      orderId: body.data.order_id,
      status: body.data.order_status,
    };
  }
}
