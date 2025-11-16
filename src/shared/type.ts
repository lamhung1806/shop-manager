export enum ROLE {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
}

export enum ACCESS_TYPE {
  ADMIN_ONLY = 'ADMIN_ONLY',
  BUYER_ONLY = 'BUYER_ONLY',
  SELLER_ONLY = 'SELLER_ONLY',
  ALL = 'ALL',
}

export interface TiktokShopAuthResponse {
  access_token: string;
  access_token_expire_in: number;
  refresh_token: string;
  refresh_token_expire_in: number;
  open_id: string;
  seller_name: string;
  seller_base_region: string;
  user_type: number;
  granted_scopes: string[];
}

export interface TiktokParamsBase {
  appKey: string;
  appSecret: string;
  timestamp?: number;
  accessToken: string;
}

export interface GetTiktokShopAuthParams extends TiktokParamsBase {}

export interface GetTiktokOrderDetailParams extends TiktokParamsBase {
  shop_cipher: string;
  ids: string[];
}

export interface GetAuthShopInfoResponse {
  shops: ShopAuthInfo[];
}

export interface ShopAuthInfo {
  id: string;
  name: string;
  region: string;
  seller_type: string;
  cipher: string;
  code: string;
}
