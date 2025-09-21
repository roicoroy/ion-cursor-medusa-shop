export interface MedusaAddress {
    id?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: any;
    customer_id?: string;
    address_name?: string;
    is_default_shipping?: boolean;
    is_default_billing?: boolean;
    company?: string;
    first_name?: string;
    last_name?: string;
    address_1?: string;
    address_2?: any;
    country_code: string;
    region_code?: string;
    city?: string;
    postal_code?: string;
    province?: null;
    phone: string;
    metadata?: any;
  }