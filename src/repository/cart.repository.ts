import { BadRequestException, Injectable } from '@nestjs/common';
import { AddToCartDto } from 'src/modules/cart/_dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class CartRepository {
  constructor(private readonly Prisma: PrismaService) {}
  async addProductToCart(userId: string, addToCartDto: AddToCartDto) {
    const { id } = await this.Prisma.cart.upsert({
      where: {
        userId: userId,
      },
      create: { userId: userId },
      update: {},
    });

    const { stock } = await this.Prisma.productVariant.findFirst({
      where: {
        id: addToCartDto.variantId,
      },
    });

    if (stock < addToCartDto.quantity) {
      throw new BadRequestException(
        'Insufficient stock for the requested product variant',
      );
    }

    if (addToCartDto.quantity <= 0) {
      await this.Prisma.cartItem.deleteMany({
        where: {
          cartId: id,
          productId: addToCartDto.productId,
          variantId: addToCartDto.variantId || null,
        },
      });
      return {
        message: 'Product removed from cart successfully',
      };
    }

    await this.Prisma.cartItem.upsert({
      where: {
        cartId_productId_variantId: {
          cartId: id,
          productId: addToCartDto.productId,
          variantId: addToCartDto.variantId || null,
        },
      },
      create: {
        cartId: id,
        productId: addToCartDto.productId,
        variantId: addToCartDto.variantId,
        quantity: addToCartDto.quantity,
      },
      update: {
        quantity: addToCartDto.quantity,
      },
    });

    return {
      message: 'Product added to cart successfully',
    };
  }

  async getCartByUserId(userId: string) {
    return this.Prisma.cart.findUnique({
      where: { userId: userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });
  }

  async clearCartByUserId(userId: string) {
    const cart = await this.Prisma.cart.findUnique({
      where: { userId: userId },
    });

    if (!cart) {
      throw new BadRequestException('Cart not found');
    }

    await this.Prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return {
      message: 'Cart cleared successfully',
    };
  }
}
