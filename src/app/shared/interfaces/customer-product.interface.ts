import { MedusaAddress } from "./medusa-address";

export interface MedusaProduct {
  id: string;
  title?: string;
  subtitle?: null;
  status?: string;
  external_id?: null;
  description?: string;
  handle?: string;
  is_giftcard?: boolean;
  discountable?: boolean;
  thumbnail?: any;
  collection_id?: null;
  type_id?: null;
  weight: number;
  length?: null;
  height?: null;
  width?: null;
  hs_code?: null;
  origin_country?: null;
  mid_code?: any;
  material?: any;
  created_at: string;
  updated_at: string;
  deleted_at?: any;
  metadata?: any;
  profile_id?: string;
  collection?: any;
  images?: (ImagesEntity)[] | any;
  options?: (OptionsEntity)[] | any;
  profiles?: (ProfilesEntity)[] | any;
  tags?: (any)[];
  type?: any;
  variants?: (VariantsEntity)[] | any;
}
export interface ImagesEntity {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: null;
  url: string;
  metadata?: null;
}
export interface OptionsEntity {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: null;
  title: string;
  product_id: string;
  metadata?: null;
  values?: (ValuesEntityOrOptionsEntity)[] | null;
}
export interface ValuesEntityOrOptionsEntity {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: null;
  value: string;
  option_id: string;
  variant_id: string;
  metadata?: null;
}
export interface ProfilesEntity {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: null;
  name: string;
  type: string;
  metadata?: null;
}
export interface VariantsEntity {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: null;
  title: string;
  product_id: string;
  sku?: null;
  barcode?: null;
  ean?: null;
  upc?: null;
  variant_rank: number;
  inventory_quantity: number;
  allow_backorder: boolean;
  manage_inventory: boolean;
  hs_code?: null;
  origin_country?: null;
  mid_code?: null;
  material?: null;
  weight?: null;
  length?: null;
  height?: null;
  width?: null;
  metadata?: null;
  options?: (ValuesEntityOrOptionsEntity)[] | null;
  prices?: (PricesEntity)[] | null;
  original_price?: null;
  calculated_price?: null;
  original_price_incl_tax?: null;
  calculated_price_incl_tax?: null;
  original_tax?: null;
  calculated_tax?: null;
  tax_rates?: null;
}
export interface PricesEntity {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: null;
  currency_code: string;
  amount: number;
  min_quantity?: null;
  max_quantity?: null;
  price_list_id?: null;
  region_id?: null;
  price_list?: null;
  variant_id: string;
}

export interface MetaDatum {
  id: number;
  key: string;
  value: string;
}

export interface LineItem {
  id?: number;
  name?: string;
  product_id: number;
  variation_id?: number;
  quantity: number;
  tax_class?: string;
  subtotal?: string;
  subtotal_tax?: string;
  total?: string;
  total_tax?: string;
  taxes?: any[];
  meta_data?: any[];
  sku?: string;
  price?: string;
  image?: string;
}

export interface ShippingLine {
  id?: number;
  method_title?: string;
  method_id?: string;
  instance_id?: string;
  total?: string;
  total_tax?: string;
  taxes?: any[];
  meta_data?: any[];
}

export interface Cart {
  // built from my own object sending in, disregard if necessary!
  payment_method: string;
  payment_method_title: string;
  billing: Billing;
  shipping: Shipping;
  line_items: Array<LineItem>;
  shipping_lines: Array<ShippingLine>;
  customer_id: number;
  meta_data: Array<[]>;
  set_paid: false;
}

export interface Image {
  id: number;
  date_created: Date;
  date_created_gmt: Date;
  date_modified: Date;
  date_modified_gmt: Date;
  src: string;
  name: string;
  alt: string;
  position: number;
}

export interface MedusaCustomer {
  customer: any;
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: null;
  email: string;
  first_name: string;
  last_name: string;
  billing_address_id?: null;
  phone?: null;
  has_account: boolean;
  metadata?: null;
  company_name?:string;
  orders: (OrdersEntity)[];
  shipping_addresses?: (MedusaAddress)[];
  addresses?: (MedusaAddress)[];
}
export interface OrdersEntity {
  object: string;
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  fulfillment_status: string;
  payment_status: string;
  display_id: number;
  cart_id: string;
  customer_id: string;
  email: string;
  billing_address_id: string;
  shipping_address_id: string;
  region_id: string;
  currency_code: string;
  tax_rate?: null;
  draft_order_id?: null;
  canceled_at?: null;
  metadata: Metadata;
  no_notification?: null;
  idempotency_key?: null;
  external_id?: null;
  sales_channel_id: string;
  items?: (ItemsEntity)[] | null;
}
export interface Metadata {
}
export interface ItemsEntity {
  id: string;
  created_at: string;
  updated_at: string;
  cart_id: string;
  order_id: string;
  swap_id?: null;
  claim_order_id?: null;
  original_item_id?: null;
  order_edit_id?: null;
  title: string;
  description: string;
  thumbnail: string;
  is_return: boolean;
  is_giftcard: boolean;
  should_merge: boolean;
  allow_discounts: boolean;
  has_shipping: boolean;
  unit_price: number;
  variant_id: string;
  quantity: number;
  fulfilled_quantity?: null;
  returned_quantity?: null;
  shipped_quantity?: null;
  metadata: Metadata;
}
export interface ShippingAddressesEntity {
  id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: null;
  customer_id?: string;
  company?: string;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string | null;
  city: string;
  country_code: string;
  province?: string | null;
  postal_code?: string;
  phone?: string;
  metadata?: Metadata1 | null;
}
export interface Metadata1 {
}
export interface Billing {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: any;
  customer_id: string;
  company: string;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: any;
  city: string;
  country_code: string;
  province?: null;
  postal_code: string;
  phone: string;
  metadata?: any;
}

export interface Shipping {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: any;
  customer_id: string;
  company: string;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: any;
  city: string;
  country_code: string;
  province?: null;
  postal_code: string;
  phone: string;
  metadata?: any;
}


