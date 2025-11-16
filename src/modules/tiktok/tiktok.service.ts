import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  GetTiktokOrderDetailParams,
  GetTiktokShopAuthParams,
} from 'src/shared/type';
import { createSignatureTiktok } from 'src/shared/utils';
import { CreateShopDto } from '../shop/_dto';

@Injectable()
export class TiktokService {
  constructor(private readonly httpService: HttpService) {}

  async getAuthShopInfo({
    appKey,
    appSecret,
    accessToken,
  }: GetTiktokShopAuthParams) {
    const timestamp = Math.floor(Date.now() / 1000);
    const queryParams = `app_key=${appKey}&timestamp=${timestamp}`;
    const signature = createSignatureTiktok(
      queryParams,
      `/authorization/202309/shops`,
      appSecret,
    );

    const url = `${process.env.TIKTOK_API_URL}/authorization/202309/shops?sign=${signature}&${queryParams}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get<void>(url, {
          headers: {
            'x-tts-access-token': accessToken,
            'Content-Type': 'application/json',
          },
          timeout: 60000,
          maxRedirects: 0,
        }),
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return (response.data as any)?.data;
    } catch (error) {
      throw new BadRequestException(
        'Failed to fetch TikTok shop info: ' + error.message,
        JSON.stringify(error),
      );
    }
  }

  async getTiktokShopInfo(body: CreateShopDto) {
    try {
      const tiktokApiUrl = process.env.TIKTOK_AUTH_API_URL;

      if (!tiktokApiUrl) {
        throw new Error('TIKTOK_AUTH_API_URL is not configured');
      }

      const response = await firstValueFrom(
        this.httpService.get(`${tiktokApiUrl}/token/get`, {
          params: {
            auth_code: body.authCode,
            app_key: body.appKey,
            app_secret: process.env.APP_SECRET,
            grant_type: 'authorized_code',
          },
        }),
      );
      console.log('TikTok API response:', response.data.data);
      if (!response.data?.data) {
        return response.data;
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching TikTok shop info:', error);
      throw error;
    }
  }

  async getOrderDetail({
    appKey,
    appSecret,
    accessToken,
    shop_cipher,
    ids,
  }: GetTiktokOrderDetailParams) {
    const timestamp = Math.floor(Date.now() / 1000);

    const queryParams = `shop_cipher=${shop_cipher}&ids=${ids.join(',')}&app_key=${appKey}&timestamp=${timestamp}`;
    console.log('TikTok Order Detail queryParams:', queryParams);
    const signature = createSignatureTiktok(
      queryParams,
      `/order/202507/orders`,
      appSecret,
    );

    const url = `${process.env.TIKTOK_API_URL}/order/202507/orders?sign=${signature}&${queryParams}`;
    try {
      const response = await firstValueFrom(
        this.httpService.get<void>(url, {
          headers: {
            'x-tts-access-token': accessToken,
            'Content-Type': 'application/json',
          },
          timeout: 60000,
          maxRedirects: 0,
        }),
      );
      console.log('TikTok Order Detail response:', response.data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return (response.data as any)?.data;
    } catch (error) {
      throw new BadRequestException(
        'Failed to fetch TikTok shop info: ' + error.message,
        JSON.stringify(error),
      );
    }
  }
}
