import {
  IsNumber,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginatedQuery } from '../common/_dto';
import { OptionalProperty } from 'src/shared/valitators';

export class CreateProductVariantAttributeDto {
  @ApiProperty({
    description: 'Attribute name (e.g., Color, Size, Material)',
    example: 'Color',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Attribute value',
    example: 'Red',
    required: false,
  })
  @IsOptional()
  @IsString()
  value?: string;
}

export class CreateProductVariantDto {
  @ApiProperty({
    description: 'Stock Keeping Unit - unique identifier for the variant',
    example: 'SHIRT-RED-L',
    required: false,
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({
    description: 'Price of the product variant in cents',
    example: 2999,
    minimum: 0,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Available stock quantity',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  stock: number;

  @ApiProperty({
    description: 'Image URL for this specific variant',
    example: 'https://example.com/images/product-variant.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: 'Product variant attributes (color, size, etc.)',
    type: [CreateProductVariantAttributeDto],
    example: [
      { name: 'Color', value: 'Red' },
      { name: 'Size', value: 'Large' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantAttributeDto)
  attributes: CreateProductVariantAttributeDto[];
}

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Premium Cotton T-Shirt',
    maxLength: 255,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Detailed product description',
    example:
      'High-quality cotton t-shirt with comfortable fit and premium feel',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Product category',
    example: 'Clothing',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'Main product image URL',
    example: ['https://example.com/images/product-main.jpg'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @ApiProperty({
    description: 'ID of the seller creating this product',
    example: 'seller-uuid-123',
  })
  @IsString()
  sellerId: string;

  @ApiProperty({
    description: 'Whether the product is active and visible to buyers',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Product variants with different attributes and pricing',
    type: [CreateProductVariantDto],
    example: [
      {
        sku: 'TSHIRT-RED-L',
        price: 2999,
        stock: 50,
        imageUrl: 'https://example.com/red-large.jpg',
        attributes: [
          { name: 'Color', value: 'Red' },
          { name: 'Size', value: 'Large' },
        ],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants: CreateProductVariantDto[];
}

// DTO để add variant cho product có sẵn
export class AddProductVariantDto {
  @ApiProperty({
    description: 'Product ID to add variant to',
    example: 'product-uuid-123',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'Stock Keeping Unit - unique identifier for the new variant',
    example: 'SHIRT-BLUE-M',
    required: false,
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({
    description: 'Price of the new product variant in cents',
    example: 3299,
    minimum: 0,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Available stock quantity for new variant',
    example: 75,
    minimum: 0,
  })
  @IsNumber()
  stock: number;

  @ApiProperty({
    description: 'Image URL for this specific variant',
    example: 'https://example.com/images/blue-medium.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: 'Product variant attributes (color, size, etc.)',
    type: [CreateProductVariantAttributeDto],
    example: [
      { name: 'Color', value: 'Blue' },
      { name: 'Size', value: 'Medium' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantAttributeDto)
  attributes: CreateProductVariantAttributeDto[];
}

export class FindAllProductDto extends PaginatedQuery {
  @OptionalProperty()
  search?: string;

  @OptionalProperty()
  category?: string;

  @OptionalProperty()
  startDate?: string;

  @OptionalProperty()
  endDate?: string;
}
