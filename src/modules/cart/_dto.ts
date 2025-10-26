import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class AddToCartDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  productId: number;

  @IsInt()
  @IsOptional()
  @ApiProperty()
  variantId?: number;

  @IsInt()
  @Min(0)
  @ApiProperty()
  quantity: number;
}
