import { Injectable } from '@nestjs/common';
import { CreateShopDto } from './_dto';
import { ShopRepository } from 'src/repository/shop.repository';

@Injectable()
export class ShopService {
  constructor(private readonly shopRepository: ShopRepository) {}
  create(body: CreateShopDto) {
    return this.shopRepository.create(body);
  }
}
