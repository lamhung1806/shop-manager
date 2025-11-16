import { ApiProperty } from '@nestjs/swagger';

export class CreateShopDto {
  @ApiProperty({
    description: 'App key',
  })
  appKey: string;

  @ApiProperty({
    description: 'Auth code',
  })
  authCode: string;
}
