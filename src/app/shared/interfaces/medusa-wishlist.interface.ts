export interface MedusaWishlistCustomer {
    id: string
    created_at: string
    updated_at: string
    deleted_at: any
    email: string
    first_name: string
    last_name: string
    billing_address_id: string
    phone: string
    has_account: boolean
    metadata: Metadata
    password_hash: any
}

export interface Metadata {
    stripe_id: string
    wishlist: Wishlist[]
}

export interface Wishlist {
    order_edit_id: any
    title: string
    description: string
    thumbnail: string
    is_giftcard: boolean
    should_merge: boolean
    allow_discounts: boolean
    unit_price: number
    variant_id: string
    quantity: number
    metadata: Metadata2
    variant: Variant
}

export interface Metadata2 { }

export interface Variant {
    id: string
    created_at: string
    updated_at: string
    deleted_at: any
    title: string
    product_id: string
    sku: any
    barcode: any
    ean: any
    upc: any
    variant_rank: number
    inventory_quantity: number
    allow_backorder: boolean
    manage_inventory: boolean
    hs_code: any
    origin_country: any
    mid_code: any
    material: any
    weight: any
    length: any
    height: any
    width: any
    metadata: any
    product: Product
}

export interface Product {
    id: string
    created_at: string
    updated_at: string
    deleted_at: any
    title: string
    subtitle: any
    description: string
    handle: string
    is_giftcard: boolean
    status: string
    thumbnail: string
    weight: number
    length: any
    height: any
    width: any
    hs_code: any
    origin_country: any
    mid_code: any
    material: any
    collection_id: any
    type_id: any
    discountable: boolean
    external_id: any
    metadata: any
}
