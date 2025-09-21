export interface SavedWishlist {
    items: Item[]
    first_name: string
  }
  
  export interface Item {
    title: string
    variant: Variant
    metadata: Metadata
    quantity: number
    thumbnail: string
    unit_price: number
    variant_id: string
    description: string
    is_giftcard: boolean
    should_merge: boolean
    order_edit_id: any
    allow_discounts: boolean
  }
  
  export interface Variant {
    id: string
    ean: any
    sku: any
    upc: any
    title: string
    width: any
    height: any
    length: any
    weight: any
    barcode: any
    hs_code: any
    product: Product
    material: any
    metadata: any
    mid_code: any
    created_at: string
    deleted_at: any
    product_id: string
    updated_at: string
    variant_rank: number
    origin_country: any
    allow_backorder: boolean
    manage_inventory: boolean
    inventory_quantity: number
  }
  
  export interface Product {
    id: string
    title: string
    width: any
    handle: string
    height: any
    length: any
    status: string
    weight: number
    hs_code: any
    type_id: any
    material: any
    metadata: any
    mid_code: any
    subtitle: any
    thumbnail: string
    created_at: string
    deleted_at: any
    updated_at: string
    description: string
    external_id: any
    is_giftcard: boolean
    discountable: boolean
    collection_id: any
    origin_country: any
  }
  
  export interface Metadata {}
  