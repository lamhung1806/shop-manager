import { Injectable } from '@nestjs/common';
import { CartRepository } from 'src/repository/cart.repository';
import { AddToCartDto } from './_dto';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}
  addProductToCart(userId: string, addToCartDto: AddToCartDto) {
    return this.cartRepository.addProductToCart(userId, addToCartDto);
  }

  getCartByUserId(userId: string) {
    return this.cartRepository.getCartByUserId(userId);
  }
}
