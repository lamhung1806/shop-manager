import { Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/repository/product.repository';
import { CreateProductDto, FindAllProductDto } from './_dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(userId: string, productData: CreateProductDto) {
    return this.productRepository.create(userId, productData);
  }

  async findAllProducts(userId: string, query: FindAllProductDto) {
    return this.productRepository.findProductBySeller(userId, query);
  }

  async findAllProductsForBuyer(query: FindAllProductDto) {
    return this.productRepository.findProductByBuyer(query);
  }
}
