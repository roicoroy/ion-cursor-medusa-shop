

export interface MedusaRegion {
    id: string
    created_at: string
    updated_at: string
    deleted_at: any
    name: string
    currency_code: string
    tax_rate: number
    tax_code: any
    gift_cards_taxable: boolean
    automatic_taxes: boolean
    tax_provider_id: any
    metadata: any
    countries: Country[]
    currency: Currency
    fulfillment_providers: FulfillmentProvider[]
    payment_providers: PaymentProvider[]
  }
 
  export interface Country {
    id: number
    iso_2: string
    iso_3: string
    num_code: number
    name: string
    display_name: string
    region_id: string
  }
  
  export interface Currency {
    code: string
    symbol: string
    symbol_native: string
    name: string
  }
  
  export interface FulfillmentProvider {
    id: string
    is_installed: boolean
  }
  
  export interface PaymentProvider {
    id: string
    is_installed: boolean
  }
  