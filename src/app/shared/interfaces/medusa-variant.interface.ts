export interface MedusaVariant {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at?: null;
    title: string;
    product_id: string;
    sku?: any;
    barcode?: any;
    ean?: any;
    upc?: any;
    variant_rank: number;
    inventory_quantity: number;
    allow_backorder: boolean;
    manage_inventory: boolean;
    hs_code?: any;
    origin_country?: any;
    mid_code?: any;
    material?: any;
    weight?: any;
    length?: any;
    height?: any;
    width?: any;
    metadata?: any;
    options?: (OptionsEntity)[] | any;
    prices?: (PricesEntity)[] | any;
    original_price?: any;
    calculated_price?: any;
    original_price_incl_tax?: any;
    calculated_price_incl_tax?: any;
    original_tax?: any;
    calculated_tax?: any;
    tax_rates?: any;
}
export interface OptionsEntity {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at?: any;
    value: string;
    option_id: string;
    variant_id: string;
    metadata?: any;
}
export interface PricesEntity {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at?: any;
    currency_code: string;
    amount: number;
    min_quantity?: any;
    max_quantity?: any;
    price_list_id?: any;
    region_id?: any;
    price_list?: any;
    variant_id: string;
}
