import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { User } from 'src/decorators/user.decorator';
import { AddToCartDto } from './_dto';
import { Auth } from 'src/decorators/auth.decorator';
import { ROLE } from 'src/shared/type';
@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Post()
  @Auth(ROLE.BUYER)
  @ApiOperation({ summary: 'Create a new cart' })
  createCart(@User('id') userId: string, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addProductToCart(userId, addToCartDto);
  }

  @Get()
  @Auth(ROLE.BUYER)
  @ApiOperation({ summary: 'Get cart by user ID' })
  getCart(@User('id') userId: string) {
    return this.cartService.getCartByUserId(userId);
  }
}
