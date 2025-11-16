export interface TikTokOrderResponse {
  orders: TiktokOrderDetail[];
}

export interface TiktokOrderDetail {
  buyer_email: string;
  buyer_message: string;
  create_time: number;
  delivery_option_id: string;
  delivery_option_name: string;
  delivery_type: string;
  fulfillment_type: string;
  has_updated_recipient_address: boolean;
  id: string;
  is_cod: boolean;
  is_exchange_order: boolean;
  is_on_hold_order: boolean;
  is_replacement_order: boolean;
  is_sample_order: boolean;
  line_items: LineItem[];
  packages: any[];
  paid_time: number;
  payment: Payment;
  payment_method_name: string;
  recipient_address: RecipientAddress;
  shipping_type: string;
  status: string;
  update_time: number;
  user_id: string;
  warehouse_id: string;
}

export interface LineItem {
  currency: string;
  display_status: string;
  id: string;
  is_dangerous_good: boolean;
  is_gift: boolean;
  item_tax: ItemTax[];
  original_price: string;
  platform_discount: string;
  product_id: string;
  product_name: string;
  sale_price: string;
  seller_discount: string;
  seller_sku: string;
  sku_id: string;
  sku_image: string;
  sku_name: string;
  sku_type: string;
}

export interface ItemTax {
  tax_amount: string;
  tax_rate: string;
  tax_type: string;
}

export interface Payment {
  currency: string;
  item_insurance_tax: string;
  original_shipping_fee: string;
  original_total_product_price: string;
  platform_discount: string;
  product_tax: string;
  seller_discount: string;
  shipping_fee: string;
  shipping_fee_cofunded_discount: string;
  shipping_fee_platform_discount: string;
  shipping_fee_seller_discount: string;
  shipping_fee_tax: string;
  sub_total: string;
  tax: string;
  total_amount: string;
}

export interface RecipientAddress {
  address_detail: string;
  address_line1: string;
  address_line2: string;
  address_line3: string;
  address_line4: string;
  delivery_preferences: DeliveryPreferences;
  district_info: DistrictInfo[];
  full_address: string;
  name: string;
  phone_number: string;
  postal_code: string;
  region_code: string;
}

export interface DeliveryPreferences {
  drop_off_location: string;
}

export interface DistrictInfo {
  address_level: string;
  address_level_name: string;
  address_name: string;
}
