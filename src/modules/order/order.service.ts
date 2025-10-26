import { Injectable } from '@nestjs/common';
import { OrderRepository } from 'src/repository/order.repository';
import { FindAllOrderDto } from './_dto';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}
  create(userId: string) {
    return this.orderRepository.buyerCreateOrder(userId);
  }

  findAllOrdersByBuyer(userId: string, query: FindAllOrderDto) {
    return this.orderRepository.getOrderListByUserId(userId, query);
  }

  getOrderDetails(userId: string, orderId: string) {
    return this.orderRepository.getOrderDetailsById(userId, orderId);
  }

  buyerCancelOrder(userId: string, orderId: string) {
    return this.orderRepository.cancelOrderByBuyer(userId, orderId);
  }
}
