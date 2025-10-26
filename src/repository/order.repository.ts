import { BadRequestException, Injectable } from '@nestjs/common';
import { ORDER_STATUS, Prisma } from 'generated/prisma';
import { FindAllOrderDto } from 'src/modules/order/_dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PaginationResponseDto } from 'src/modules/common/_dto';
import { CartRepository } from './cart.repository';

// Type cho CartItem với includes
type CartItemWithIncludes = Prisma.CartItemGetPayload<{
  include: {
    product: true;
    variant: true;
  };
}>;

@Injectable()
export class OrderRepository {
  constructor(
    readonly Prisma: PrismaService,
    readonly CartRepository: CartRepository,
  ) {}

  async buyerCreateOrder(userId: string) {
    const { items } = await this.CartRepository.getCartByUserId(userId);
    if (!items || items.length === 0) {
      return { message: 'Cart is empty' };
    }

    await this.validateCartStock(items);

    const order = await this.Prisma.$transaction(async (prisma) => {
      const newOrder = await prisma.order.create({
        data: {
          userId: userId,
          totalPrice: items.reduce((sum, item) => {
            const price = item.variant?.price || 0;
            return sum + price * item.quantity;
          }, 0),
          orderItems: {
            create: items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              price: item.variant?.price || 0,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          orderItems: true,
        },
      });

      for (const item of items) {
        if (item.variantId) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      await prisma.cartItem.deleteMany({
        where: {
          cart: {
            userId: userId,
          },
        },
      });

      return newOrder;
    });

    return {
      message: 'Order created successfully',
      orderId: order.id,
      totalPrice: order.totalPrice,
    };
  }

  private async validateCartStock(cartItems: CartItemWithIncludes[]) {
    const stockValidationResults = await Promise.allSettled(
      cartItems.map((item) => this.checkItemStock(item)),
    );

    const stockValidationErrors: string[] = [];

    stockValidationResults.forEach((result) => {
      if (result.status === 'rejected') {
        stockValidationErrors.push(result.reason.message);
      }
    });

    if (stockValidationErrors.length > 0) {
      throw new BadRequestException({
        message: 'Some items in your cart have insufficient stock',
        errors: stockValidationErrors,
      });
    }
  }

  async getOrderListByUserId(userId: string, query: FindAllOrderDto) {
    const { startDate, endDate } = query;
    const OrderWhereInput: Prisma.OrderWhereInput = {
      userId: userId,
      ...(startDate && endDate
        ? {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }
        : {}),
    };

    const [orders, count] = await Promise.all([
      this.Prisma.order.findMany({
        where: OrderWhereInput,
        include: {
          orderItems: true,
        },
        skip: (query.page - 1) * query.size,
        take: query.size,
      }),
      this.Prisma.order.count({ where: { userId: userId } }),
    ]);
    return new PaginationResponseDto(orders, count, {
      page: query.page,
      size: query.size,
    });
  }

  async getOrderDetailsById(userId: string, orderId: string) {
    const order = await this.Prisma.order.findUnique({
      where: { userId_id: { userId: userId, id: +orderId } },
      include: {
        orderItems: {
          include: {
            variant: {
              omit: { stock: true },
              include: {
                attributes: true,
              },
            },
          },
        },
      },
    });
    return order;
  }

  async cancelOrderByBuyer(userId: string, orderId: string) {
    const orderDetails = await this.getOrderDetailsById(userId, orderId);

    if (orderDetails.status === ORDER_STATUS.CANCELED) {
      throw new BadRequestException('Order is already canceled');
    }

    if (orderDetails.status !== ORDER_STATUS.PENDING) {
      throw new BadRequestException('Only pending orders can be canceled');
    }

    if (!orderDetails) {
      throw new BadRequestException('Order not found');
    }
    const order = await this.Prisma.order.updateMany({
      where: {
        id: +orderId,
        userId: userId,
      },
      data: {
        status: ORDER_STATUS.CANCELED,
      },
    });

    if (!order) {
      throw new BadRequestException('Order not found or already canceled');
    }

    return {
      message: 'Order canceled successfully',
    };
  }

  private async checkItemStock(cartItem: CartItemWithIncludes) {
    if (!cartItem.variant) {
      throw new BadRequestException(
        `Product "${cartItem.product.name}" has no variant selected`,
      );
    }

    const currentVariant = await this.Prisma.productVariant.findUnique({
      where: { id: cartItem.variantId },
      select: {
        id: true,
        stock: true,
        sku: true,
        product: {
          select: { name: true },
        },
      },
    });

    if (!currentVariant) {
      throw new BadRequestException(
        `Product variant not found for "${cartItem.product.name}"`,
      );
    }

    if (currentVariant.stock < cartItem.quantity) {
      throw new BadRequestException(
        `Insufficient stock for "${currentVariant.product.name}" (SKU: ${currentVariant.sku || 'N/A'}). Available: ${currentVariant.stock}, Requested: ${cartItem.quantity}`,
      );
    }

    return true;
  }
}
