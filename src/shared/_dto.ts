import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PaginationRequest {
  @ApiProperty({
    description: 'pageIndex',
    example: 0,
    name: 'pageIndex',
    required: true,
    type: 'number',
  })
  @IsNumber()
  @Type(() => Number)
  pageIndex: number = 0;

  @ApiProperty({
    description: 'size',
    example: 20,
    name: 'size',
    required: true,
    type: 'number',
  })
  @Type(() => Number)
  size: number = 20;

  @ApiProperty({ name: 'sortField', type: String, required: false })
  sortField?: string;

  @ApiProperty({ name: 'sortOrder', enum: ['desc', 'asc'], required: false })
  sortOrder?: ['desc', 'asc'];

  getOffset(): number {
    return this.pageIndex * this.size;
  }
}
