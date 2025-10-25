import { ApiProperty } from '@nestjs/swagger';
import { Max, Min } from 'class-validator';
import { IsInteger } from 'src/shared/valitators';

export class PaginatedQuery {
  @ApiProperty({ example: 1, default: 1 })
  @IsInteger
  @Min(1)
  page: number;

  @ApiProperty({ example: 10, default: 10 })
  @Max(200)
  @IsInteger
  size: number;

  @ApiProperty({
    example: 'desc',
    default: 'desc',
    enum: ['asc', 'desc'],
  })
  orderBy?: 'asc' | 'desc';
}

export class PaginationResponseDto<T> {
  data: T;
  total: number;
  pageIndex: number;
  size: number;
  totalPages: number;

  constructor(
    data: T,
    total: number,
    paginationRequest: Omit<PaginatedQuery, 'getOffset'>,
  ) {
    this.data = data;
    this.total = total;
    this.pageIndex = paginationRequest.page;
    this.size = paginationRequest.size;
    this.totalPages = Math.ceil(total / paginationRequest.size) || 0;
  }
}
