import { Get } from '@nestjs/common';
import { OptionalProperty } from 'src/shared/valitators';
import { PaginatedQuery } from '../common/_dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDecimal,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { PaginationRequest } from 'src/shared/_dto';

export class FindAllOrderDto extends PaginatedQuery {
  @OptionalProperty()
  startDate?: string;

  @OptionalProperty()
  endDate?: string;
}

export enum OrderStatus {
  UNPAID = 'UNPAID',
  ON_HOLD = 'ON_HOLD',
  AWAITING_SHIPMENT = 'AWAITING_SHIPMENT',
  AWAITING_COLLECTION = 'AWAITING_COLLECTION',
  CANCEL = 'CANCEL',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
}

export class OrderWebhookData {
  @ApiProperty()
  @Transform(({ value }) => value.toString())
  order_id: string;

  @ApiProperty()
  order_status: OrderStatus;

  @ApiProperty()
  update_time: number;
}

export class WebhookOrderDto {
  @ApiProperty()
  type: number;
  @ApiProperty()
  shop_id: string;
  @ApiProperty()
  timestamp: number;
  @ApiProperty()
  tts_notification_id: string;
  @ApiProperty()
  @Type(() => OrderWebhookData)
  data: OrderWebhookData;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Order ID from TikTok' })
  @IsString()
  orderId: string;

  @ApiPropertyOptional({ description: 'Shop ID' })
  @IsOptional()
  @IsString()
  shopId?: string;

  @ApiPropertyOptional({ description: 'Product quantity' })
  @IsOptional()
  @IsNumber()
  productQuantity?: number;

  @ApiPropertyOptional({ description: 'Total amount' })
  @IsOptional()
  @IsDecimal()
  totalAmount?: number;

  @ApiPropertyOptional({ description: 'Order status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Order note' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ description: 'Base cost' })
  @IsOptional()
  @IsDecimal()
  baseCost?: number;

  @ApiPropertyOptional({ description: 'Base cost design' })
  @IsOptional()
  @IsDecimal()
  baseCostDesign?: number;

  @ApiPropertyOptional({ description: 'Order label' })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiPropertyOptional({ description: 'Fulfill name' })
  @IsOptional()
  @IsString()
  fulfillName?: string;

  @ApiPropertyOptional({ description: 'Create time from TikTok' })
  @IsOptional()
  @IsDateString()
  createTimeFromTiktok?: string;

  @ApiPropertyOptional({ description: 'Original total product price' })
  @IsOptional()
  @IsString()
  originalTotalProductPrice?: string;

  @ApiPropertyOptional({ description: 'Seller discount' })
  @IsOptional()
  @IsString()
  sellerDiscount?: string;

  @ApiPropertyOptional({ description: 'Shipping fee' })
  @IsOptional()
  @IsString()
  shippingFee?: string;

  @ApiPropertyOptional({ description: 'Product tax' })
  @IsOptional()
  @IsString()
  productTax?: string;

  @ApiPropertyOptional({ description: 'Shipping fee tax' })
  @IsOptional()
  @IsString()
  shippingFeeTax?: string;

  @ApiPropertyOptional({ description: 'Shipping fee seller discount' })
  @IsOptional()
  @IsString()
  shippingFeeSellerDiscount?: string;

  @ApiPropertyOptional({ description: 'Shipping type' })
  @IsOptional()
  @IsString()
  shippingType?: string;

  @ApiProperty({ description: 'Is deleted flag', default: false })
  @IsBoolean()
  isDeleted: boolean = false;
}

export class GetAllOrdersDto extends PaginationRequest {
  @ApiPropertyOptional({ description: 'Filter by status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by shop ID' })
  @IsOptional()
  @IsString()
  shopId?: string;
}
