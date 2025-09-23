import { MedusaAddress } from "./medusa-address";


export interface MedusaCart {
  id: string;
  promotions?: any,
  payment_collection?: any,
  created_at?: string;
  updated_at?: string;
  deleted_at?: any;
  email?: string;
  currency_code?: string;
  billing_address_id?: string;
  shipping_address_id?: string;
  region_id?: string;
  customer_id?: string;
  payment_id?: string;
  type?: string;
  completed_at?: any;
  payment_authorized_at?: any;
  idempotency_key?: any;
  context?: Context;
  metadata?: null;
  sales_channel_id?: string;
  billing_address?: MedusaAddress;
  discounts?: any;
  gift_cards?: any;
  items?: any;
  payment?: any;
  payment_sessions?: any;
  region?: Region;
  sales_channel?: SalesChannel;
  shipping_address?: MedusaAddress;
  shipping_methods?: any;
  subtotal?: number;
  discount_total?: number;
  item_tax_total?: number;
  shipping_total?: number;
  shipping_tax_total?: number;
  tax_total?: number;
  gift_card_total?: number;
  gift_card_tax_total?: number;
  total?: number;
  original_tax_total?: number;
}
export interface Context {
  ip: string;
  user_agent: string;
}
export interface Region {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: null;
  name: string;
  currency_code: string;
  tax_rate: number;
  tax_code?: any;
  gift_cards_taxable: boolean;
  automatic_taxes: boolean;
  tax_provider_id?: any;
  metadata: Metadata;
  countries?: (CountriesEntity)[] | any;
  payment_providers?: (PaymentProvidersEntity)[] | any;
  tax_rates?: (any)[] | any;
}
export interface Metadata {
}
export interface CountriesEntity {
  id: number;
  iso_2: string;
  iso_3: string;
  num_code: number;
  name: string;
  display_name: string;
  region_id: string;
}
export interface PaymentProvidersEntity {
  id: string;
  is_installed: boolean;
}
export interface SalesChannel {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: any;
  name: string;
  description: string;
  is_disabled: boolean;
  metadata?: any;
}
