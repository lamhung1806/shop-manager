import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateShopDto } from 'src/modules/shop/_dto';
import { TiktokService } from 'src/modules/tiktok/tiktok.service';
import {
  GetAuthShopInfoResponse,
  TiktokShopAuthResponse,
} from 'src/shared/type';

@Injectable()
export class ShopRepository {
  constructor(
    private readonly tiktokService: TiktokService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(body: CreateShopDto) {
    const shopInfo: TiktokShopAuthResponse =
      await this.tiktokService.getTiktokShopInfo(body);

    if (!shopInfo || !shopInfo.open_id) {
      return shopInfo;
    }

    if (await this.findById(shopInfo.open_id)) {
      throw new ConflictException('Record already exists');
    }

    const authInfo: GetAuthShopInfoResponse =
      await this.tiktokService.getAuthShopInfo({
        appKey: body.appKey,
        appSecret: process.env.APP_SECRET,
        accessToken: shopInfo.access_token,
        timestamp: Math.floor(Date.now() / 1000),
      });

    await this.prismaService.tiktokShops.create({
      data: {
        id: authInfo?.shops?.[0]?.id,
        appKey: body.appKey,
        appSecret: process.env.APP_SECRET,
        createdOn: new Date(),
        updatedOn: new Date(),
        name: shopInfo.seller_name,
        region: shopInfo.seller_base_region,
        cipher: authInfo?.shops?.[0]?.cipher,
        tiktokToken: {
          create: {
            openId: authInfo?.shops?.[0]?.id,
            accessToken: shopInfo.access_token,
            accessTokenExpireIn: BigInt(shopInfo.access_token_expire_in),
            refreshToken: shopInfo.refresh_token,
            refreshTokenExpireIn: BigInt(shopInfo.refresh_token_expire_in),
            sellerName: shopInfo.seller_name,
            sellerBaseRegion: shopInfo.seller_base_region,
            userType: shopInfo.user_type || 0,
            createdOn: new Date(),
            updatedOn: new Date(),
          },
        },
      },
    });

    return {
      message: 'Shop created successfully',
    };
  }

  async findById(id: string) {
    return this.prismaService.tiktokShops.findUnique({
      where: { id },
      include: {
        tiktokToken: true,
      },
    });
  }
}
