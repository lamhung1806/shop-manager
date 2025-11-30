import { Injectable } from '@nestjs/common';
import { GetAllOrdersDto } from './../modules/order/_dto';

import { Prisma } from 'generated/prisma';
import { CreateOrderDto } from 'src/modules/order/_dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateOrderDto) {
    return this.prismaService.orders.create({
      data: {
        orderId: data.orderId,
        shopId: data.shopId,
        isDeleted: false,
        createdOn: new Date(),
        updatedOn: new Date(),
        status: data.status,
      },
    });
  }

  async findById(id: string) {
    return this.prismaService.orders.findUnique({
      where: { orderId: id },
    });
  }

  async getAllOrders(getAllOrdersDto: GetAllOrdersDto) {
    const { pageIndex, size, shopId } = getAllOrdersDto;
    const queries: Prisma.OrdersFindManyArgs = {
      skip: pageIndex * size,
      take: size,
    };
    if (shopId) {
      queries.where = {
        ...queries.where,
        shopId: shopId,
      };
    }

    return this.prismaService.orders.findMany(queries);
  }
}
