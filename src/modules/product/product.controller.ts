import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { User } from 'src/decorators/user.decorator';
import { ROLE } from 'src/shared/type';
import { CreateProductDto, FindAllProductDto } from './_dto';
import { ProductService } from './product.service';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  @Auth([ROLE.SELLER])
  @ApiOperation({ summary: 'Create a new product' })
  create(@User('id') userId: string, @Body() body: CreateProductDto) {
    return this.productService.createProduct(userId, body);
  }

  @Get('seller')
  @Auth([ROLE.SELLER])
  @ApiOperation({ summary: 'Get all products' })
  findAll(@User('id') userId: string, @Query() query: FindAllProductDto) {
    return this.productService.findAllProducts(userId, query);
  }
  @Get('buyer')
  @Auth([ROLE.BUYER])
  @ApiOperation({ summary: 'Get all products for buyer' })
  findAllForBuyer(@Query() query: FindAllProductDto) {
    return this.productService.findAllProductsForBuyer(query);
  }
}
