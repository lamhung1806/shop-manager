import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { WebhookOrderDto } from './_dto';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post('webhook')
  async webhookHandler(@Body() body: WebhookOrderDto) {
    console.log('Received order webhook:', body);
    return await this.orderService.handleOrderWebhook(body);
  }
}
