import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum Bucket {
  user = 'user',
  categoty_order = 'category/order',
  categoty_ready = 'category/ready',
  product = 'product',
  etc = 'ect',
}

export class UploadImageDto {
  @ApiProperty({ enum: Bucket, required: true })
  @IsEnum(Bucket)
  bucket: Bucket;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;
}
