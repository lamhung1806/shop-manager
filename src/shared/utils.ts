import * as crypto from 'crypto';

export class Message {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export const createSignatureTiktok = (
  queryString: string,
  endPoint: string,
  appSecret: string,
) => {
  // Parse query string thành object
  const params: Record<string, string> = {};
  const pairs = queryString.split('&');

  pairs.forEach((pair) => {
    const [key, value] = pair.split('=');
    if (key && value) {
      params[key] = decodeURIComponent(value);
    }
  });

  // Sắp xếp các key theo thứ tự alphabet và loại bỏ 'sign' nếu có
  const sortedKeys = Object.keys(params)
    .filter((key) => key !== 'sign')
    .sort();

  // Tạo chuỗi để ký
  const sortedParams = sortedKeys.map((key) => `${key}${params[key]}`).join('');

  // Tạo signature theo format: appSecret + endPoint + sortedParams + appSecret
  const stringToSign = `${appSecret}${endPoint}${sortedParams}${appSecret}`;

  // Tạo HMAC-SHA256 signature bằng crypto native của Node.js
  const signature = crypto
    .createHmac('sha256', appSecret)
    .update(stringToSign)
    .digest('hex');

  return signature;
};
