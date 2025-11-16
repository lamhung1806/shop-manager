import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateShopDto } from './_dto';
import { ShopService } from './shop.service';

@ApiTags('Shop')
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}
  @Post()
  createShop(@Body() body: CreateShopDto) {
    return this.shopService.create(body);
  }
}
