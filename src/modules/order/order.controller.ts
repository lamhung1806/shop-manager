import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { ROLE } from 'src/shared/type';
import { OrderService } from './order.service';
import { User } from 'src/decorators/user.decorator';
import { FindAllOrderDto } from './_dto';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post()
  @Auth(ROLE.BUYER)
  @ApiOperation({ summary: 'Create a new order' })
  buyerCreateOrder(@User('id') userId: string) {
    return this.orderService.create(userId);
  }

  @Get()
  @Auth(ROLE.BUYER)
  @ApiOperation({ summary: 'Get all orders for buyer' })
  findAllOrdersByBuyer(
    @User('id') userId: string,
    @Query() query: FindAllOrderDto,
  ) {
    return this.orderService.findAllOrdersByBuyer(userId, query);
  }

  @Get(':id')
  @Auth(ROLE.BUYER)
  @ApiOperation({ summary: 'Get order details for buyer' })
  getOrderDetail(@User('id') userId: string, @Param('id') orderId: string) {
    return this.orderService.getOrderDetails(userId, orderId);
  }

  @Post(':id/cancel')
  @Auth(ROLE.BUYER)
  @ApiOperation({ summary: 'Cancel order by buyer' })
  buyerCancelOrder(@User('id') userId: string, @Param('id') orderId: string) {
    return this.orderService.buyerCancelOrder(userId, orderId);
  }
}
