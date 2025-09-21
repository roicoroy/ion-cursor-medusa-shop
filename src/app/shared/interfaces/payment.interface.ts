export interface IPaymentProviders {
  id: string;
  is_enabled: boolean;
}

export interface IPaymentSession {
  id: string;
  created_at: string;
  updated_at: string;
  cart_id: string | null;
  cart: any; // TODO: Replace with proper cart interface
  provider_id: string;
  is_selected: boolean | null;
  is_initiated: boolean;
  status: string;
  data: Record<string, unknown>;
  idempotency_key: string;
  amount: number;
  payment_authorized_at?: string;
}

export interface IShippingOptions {
  id: string;
  name: string;
  price_type: string;
  service_zone_id: string;
  shipping_profile_id: string;
  provider_id: string;
  data: Record<string, any>;
  service_zone: ServiceZone;
  type: ShippingType;
  provider: ShippingProvider;
  rules: ShippingRule[];
  calculated_price: number;
  prices: ShippingPrice[];
  is_tax_inclusive: boolean;
}

export interface ServiceZone {
  fulfillment_set_id: string;
  id: string;
}

export interface ShippingType {
  id: string;
  label: string;
  description: string;
  code: string;
}

export interface ShippingProvider {
  id: string;
  is_enabled: boolean;
}

export interface ShippingRule {
  attribute: string;
  value: string;
  operator: string;
}

export interface ShippingPrice {
  id: string;
  title?: string;
  currency_code: string;
  min_quantity?: number;
  max_quantity?: number;
  rules_count: number;
  price_set_id: string;
  price_list_id?: string;
  price_list?: any;
  raw_amount: RawAmount;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  price_rules: PriceRule[];
  amount: number;
}

export interface RawAmount {
  value: string;
  precision: number;
}

export interface PriceRule {
  id: string;
  attribute: string;
  value: string;
  operator: string;
  priority: number;
  price_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
} 