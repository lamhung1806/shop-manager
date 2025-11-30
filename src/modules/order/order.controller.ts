import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { GetAllOrdersDto, WebhookOrderDto } from './_dto';
import { Auth } from 'src/decorators/auth.decorator';
import { ROLE } from 'src/shared/type';

@ApiTags('Orderr')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post('webhook')
  @HttpCode(200)
  async webhookHandler(@Body() body: WebhookOrderDto) {
    return await this.orderService.handleOrderWebhook(body);
  }

  @Get('all')
  @Auth([ROLE.ADMIN, ROLE.SELLER, ROLE.FULLFILLMENT])
  async getAllOrders(@Query() getAllOrdersDto: GetAllOrdersDto) {
    // return 'Fetching all orders';
    return this.orderService.getAllOrders(getAllOrdersDto);
  }
}
