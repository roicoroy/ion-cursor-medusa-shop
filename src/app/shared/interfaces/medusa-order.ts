export interface MedusaOrderResponse {
    order: MedusaOrder;
    type: string;
}

export interface MedusaOrder {
    id: string
    status: string
    summary: Summary
    currency_code: string
    display_id: number
    region_id: string
    email: string
    total: number
    subtotal: number
    tax_total: number
    discount_total: number
    discount_subtotal: number
    discount_tax_total: number
    original_total: number
    original_tax_total: number
    item_total: number
    item_subtotal: number
    item_tax_total: number
    original_item_total: number
    original_item_subtotal: number
    original_item_tax_total: number
    shipping_total: number
    shipping_subtotal: number
    shipping_tax_total: number
    original_shipping_tax_total: number
    original_shipping_subtotal: number
    original_shipping_total: number
    created_at: string
    updated_at: string
    version: number
    items: Item[]
    shipping_address: ShippingAddress
    billing_address: BillingAddress
    shipping_methods: any[]
    payment_collections: PaymentCollection[]
    fulfillments: any[]
    payment_status: string
    fulfillment_status: string
  }
  
  export interface Summary {
    paid_total: number
    difference_sum: number
    raw_paid_total: RawPaidTotal
    refunded_total: number
    accounting_total: number
    credit_line_total: number
    transaction_total: number
    pending_difference: number
    raw_difference_sum: RawDifferenceSum
    raw_refunded_total: RawRefundedTotal
    current_order_total: number
    original_order_total: number
    raw_accounting_total: RawAccountingTotal
    raw_credit_line_total: RawCreditLineTotal
    raw_transaction_total: RawTransactionTotal
    raw_pending_difference: RawPendingDifference
    raw_current_order_total: RawCurrentOrderTotal
    raw_original_order_total: RawOriginalOrderTotal
  }
  
  export interface RawPaidTotal {
    value: string
    precision: number
  }
  
  export interface RawDifferenceSum {
    value: string
    precision: number
  }
  
  export interface RawRefundedTotal {
    value: string
    precision: number
  }
  
  export interface RawAccountingTotal {
    value: string
    precision: number
  }
  
  export interface RawCreditLineTotal {
    value: string
    precision: number
  }
  
  export interface RawTransactionTotal {
    value: string
    precision: number
  }
  
  export interface RawPendingDifference {
    value: string
    precision: number
  }
  
  export interface RawCurrentOrderTotal {
    value: string
    precision: number
  }
  
  export interface RawOriginalOrderTotal {
    value: string
    precision: number
  }
  
  export interface Item {
    id: string
    title: string
    subtitle: string
    thumbnail: string
    variant_id: string
    product_id: string
    product_title: string
    product_description: string
    product_subtitle: any
    product_type: any
    product_type_id: any
    product_collection: any
    product_handle: string
    variant_sku: string
    variant_barcode: any
    variant_title: string
    variant_option_values: any
    requires_shipping: boolean
    is_discountable: boolean
    is_tax_inclusive: boolean
    is_custom_price: boolean
    metadata: Metadata
    raw_compare_at_unit_price: any
    raw_unit_price: RawUnitPrice
    created_at: string
    updated_at: string
    deleted_at: any
    tax_lines: TaxLine[]
    adjustments: any[]
    compare_at_unit_price: any
    unit_price: number
    quantity: number
    raw_quantity: RawQuantity
    detail: Detail
    subtotal: number
    total: number
    original_total: number
    discount_total: number
    discount_subtotal: number
    discount_tax_total: number
    tax_total: number
    original_tax_total: number
    refundable_total_per_unit: number
    refundable_total: number
    fulfilled_total: number
    shipped_total: number
    return_requested_total: number
    return_received_total: number
    return_dismissed_total: number
    write_off_total: number
    raw_subtotal: RawSubtotal2
    raw_total: RawTotal2
    raw_original_total: RawOriginalTotal
    raw_discount_total: RawDiscountTotal
    raw_discount_subtotal: RawDiscountSubtotal
    raw_discount_tax_total: RawDiscountTaxTotal
    raw_tax_total: RawTaxTotal
    raw_original_tax_total: RawOriginalTaxTotal
    raw_refundable_total_per_unit: RawRefundableTotalPerUnit
    raw_refundable_total: RawRefundableTotal
    raw_fulfilled_total: RawFulfilledTotal
    raw_shipped_total: RawShippedTotal
    raw_return_requested_total: RawReturnRequestedTotal
    raw_return_received_total: RawReturnReceivedTotal
    raw_return_dismissed_total: RawReturnDismissedTotal
    raw_write_off_total: RawWriteOffTotal
    variant: Variant
  }
  
  export interface Metadata {}
  
  export interface RawUnitPrice {
    value: string
    precision: number
  }
  
  export interface TaxLine {
    id: string
    description: string
    tax_rate_id: string
    code: string
    provider_id: string
    item_id: string
    raw_rate: RawRate
    created_at: string
    updated_at: string
    deleted_at: any
    rate: number
    total: number
    subtotal: number
    raw_total: RawTotal
    raw_subtotal: RawSubtotal
  }
  
  export interface RawRate {
    value: string
    precision: number
  }
  
  export interface RawTotal {
    value: string
    precision: number
  }
  
  export interface RawSubtotal {
    value: string
    precision: number
  }
  
  export interface RawQuantity {
    value: string
    precision: number
  }
  
  export interface Detail {
    id: string
    version: number
    metadata: any
    order_id: string
    raw_unit_price: any
    raw_compare_at_unit_price: any
    raw_quantity: RawQuantity2
    raw_fulfilled_quantity: RawFulfilledQuantity
    raw_delivered_quantity: RawDeliveredQuantity
    raw_shipped_quantity: RawShippedQuantity
    raw_return_requested_quantity: RawReturnRequestedQuantity
    raw_return_received_quantity: RawReturnReceivedQuantity
    raw_return_dismissed_quantity: RawReturnDismissedQuantity
    raw_written_off_quantity: RawWrittenOffQuantity
    created_at: string
    updated_at: string
    deleted_at: any
    item_id: string
    unit_price: any
    compare_at_unit_price: any
    quantity: number
    fulfilled_quantity: number
    delivered_quantity: number
    shipped_quantity: number
    return_requested_quantity: number
    return_received_quantity: number
    return_dismissed_quantity: number
    written_off_quantity: number
  }
  
  export interface RawQuantity2 {
    value: string
    precision: number
  }
  
  export interface RawFulfilledQuantity {
    value: string
    precision: number
  }
  
  export interface RawDeliveredQuantity {
    value: string
    precision: number
  }
  
  export interface RawShippedQuantity {
    value: string
    precision: number
  }
  
  export interface RawReturnRequestedQuantity {
    value: string
    precision: number
  }
  
  export interface RawReturnReceivedQuantity {
    value: string
    precision: number
  }
  
  export interface RawReturnDismissedQuantity {
    value: string
    precision: number
  }
  
  export interface RawWrittenOffQuantity {
    value: string
    precision: number
  }
  
  export interface RawSubtotal2 {
    value: string
    precision: number
  }
  
  export interface RawTotal2 {
    value: string
    precision: number
  }
  
  export interface RawOriginalTotal {
    value: string
    precision: number
  }
  
  export interface RawDiscountTotal {
    value: string
    precision: number
  }
  
  export interface RawDiscountSubtotal {
    value: string
    precision: number
  }
  
  export interface RawDiscountTaxTotal {
    value: string
    precision: number
  }
  
  export interface RawTaxTotal {
    value: string
    precision: number
  }
  
  export interface RawOriginalTaxTotal {
    value: string
    precision: number
  }
  
  export interface RawRefundableTotalPerUnit {
    value: string
    precision: number
  }
  
  export interface RawRefundableTotal {
    value: string
    precision: number
  }
  
  export interface RawFulfilledTotal {
    value: string
    precision: number
  }
  
  export interface RawShippedTotal {
    value: string
    precision: number
  }
  
  export interface RawReturnRequestedTotal {
    value: string
    precision: number
  }
  
  export interface RawReturnReceivedTotal {
    value: string
    precision: number
  }
  
  export interface RawReturnDismissedTotal {
    value: string
    precision: number
  }
  
  export interface RawWriteOffTotal {
    value: string
    precision: number
  }
  
  export interface Variant {
    id: string
    title: string
    sku: string
    barcode: any
    ean: any
    upc: any
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
    variant_rank: number
    product_id: string
    product: Product
    created_at: string
    updated_at: string
    deleted_at: any
  }
  
  export interface Product {
    id: string
    title: string
    handle: string
    subtitle: any
    description: string
    is_giftcard: boolean
    status: string
    thumbnail: string
    weight: string
    length: any
    height: any
    width: any
    origin_country: any
    hs_code: any
    mid_code: any
    material: any
    discountable: boolean
    external_id: any
    metadata: any
    type_id: any
    type: any
    collection_id: any
    collection: any
    created_at: string
    updated_at: string
    deleted_at: any
  }
  
  export interface ShippingAddress {
    id: string
    customer_id: any
    company: any
    first_name: string
    last_name: string
    address_1: string
    address_2: string
    city: string
    country_code: string
    province: any
    postal_code: string
    phone: string
    metadata: any
    created_at: string
    updated_at: string
    deleted_at: any
  }
  
  export interface BillingAddress {
    id: string
    customer_id: any
    company: any
    first_name: string
    last_name: string
    address_1: string
    address_2: string
    city: string
    country_code: string
    province: any
    postal_code: string
    phone: string
    metadata: any
    created_at: string
    updated_at: string
    deleted_at: any
  }
  
  export interface PaymentCollection {
    id: string
    currency_code: string
    completed_at: any
    status: string
    metadata: any
    raw_amount: RawAmount
    raw_authorized_amount: RawAuthorizedAmount
    raw_captured_amount: RawCapturedAmount
    raw_refunded_amount: RawRefundedAmount
    created_at: string
    updated_at: string
    deleted_at: any
    amount: number
    authorized_amount: number
    captured_amount: number
    refunded_amount: number
  }
  
  export interface RawAmount {
    value: string
    precision: number
  }
  
  export interface RawAuthorizedAmount {
    value: string
    precision: number
  }
  
  export interface RawCapturedAmount {
    value: string
    precision: number
  }
  
  export interface RawRefundedAmount {
    value: string
    precision: number
  }

  
// export interface MedusaOrder {
//     id: string;
//     status: string;
//     fulfillment_status: string;
//     payment_status: string;
//     display_id: number;
//     cart_id: string;
//     customer_id: string;
//     email: string;
//     region_id: string;
//     currency_code: string;
//     tax_rate: null;
//     created_at: Date;
//     object: string;
//     shipping_total: number;
//     discount_total: number;
//     tax_total: number;
//     refunded_total: number;
//     total: number;
//     subtotal: number;
//     paid_total: number;
//     refundable_amount: number;
//     gift_card_total: number;
//     gift_card_tax_total: number;
//     customer: Customer;
//     discounts: any[];
//     fulfillments: any[];
//     items: Item[];
//     payments: Payment[];
//     region: Region;
//     shipping_address: ShippingAddress;
//     billing_address: ShippingAddress;
//     shipping_methods: ShippingMethod[];
//     item_tax_total: number;
//     shipping_tax_total: number;
// }

// export interface Customer {
//     id: string;
//     created_at: Date;
//     updated_at: Date;
//     deleted_at: null;
//     email: string;
//     first_name: string;
//     last_name: string;
//     billing_address_id: null;
//     phone: null;
//     has_account: boolean;
//     metadata: CustomerMetadata;
// }

// export interface CustomerMetadata {
//     stripe_id: string;
// }

// export interface Item {
//     id: string;
//     created_at: Date;
//     updated_at: Date;
//     cart_id: string;
//     order_id: string;
//     swap_id: null;
//     claim_order_id: null;
//     original_item_id: null;
//     order_edit_id: null;
//     title: string;
//     description: string;
//     thumbnail: string;
//     is_return: boolean;
//     is_giftcard: boolean;
//     should_merge: boolean;
//     allow_discounts: boolean;
//     has_shipping: boolean;
//     unit_price: number;
//     variant_id: string;
//     quantity: number;
//     fulfilled_quantity: null;
//     returned_quantity: null;
//     shipped_quantity: null;
//     metadata: DataClass;
//     adjustments: any[];
//     tax_lines: TaxLine[];
//     variant: Variant;
//     subtotal: number;
//     discount_total: number;
//     total: number;
//     original_total: number;
//     original_tax_total: number;
//     tax_total: number;
//     raw_discount_total: number;
//     refundable: number;
// }

// export interface DataClass {
// }

// export interface TaxLine {
//     id: string;
//     created_at: Date;
//     updated_at: Date;
//     rate: number;
//     name: string;
//     code: string;
//     metadata: null;
//     item_id?: string;
//     shipping_method_id?: string;
// }

// export interface Variant {
//     id: string;
//     created_at: Date;
//     updated_at: Date;
//     deleted_at: null;
//     title: string;
//     product_id: string;
//     sku: null;
//     barcode: null;
//     ean: null;
//     upc: null;
//     variant_rank: number;
//     inventory_quantity: number;
//     allow_backorder: boolean;
//     manage_inventory: boolean;
//     hs_code: null;
//     origin_country: null;
//     mid_code: null;
//     material: null;
//     weight: null;
//     length: null;
//     height: null;
//     width: null;
//     metadata: null;
// }

// export interface Payment {
//     id: string;
//     created_at: Date;
//     updated_at: Date;
//     swap_id: null;
//     cart_id: string;
//     order_id: string;
//     amount: number;
//     currency_code: string;
//     amount_refunded: number;
//     provider_id: string;
//     data: PaymentData;
//     captured_at: null;
//     canceled_at: null;
//     metadata: null;
//     idempotency_key: null;
// }

// export interface PaymentData {
//     id: string;
//     amount: number;
//     object: string;
//     review: null;
//     source: null;
//     status: string;
//     created: number;
//     invoice: null;
//     currency: string;
//     customer: string;
//     livemode: boolean;
//     metadata: DataMetadata;
//     shipping: null;
//     processing: null;
//     application: null;
//     canceled_at: null;
//     description: null;
//     next_action: null;
//     on_behalf_of: null;
//     client_secret: string;
//     latest_charge: string;
//     receipt_email: null;
//     transfer_data: null;
//     amount_details: AmountDetails;
//     capture_method: string;
//     payment_method: string;
//     transfer_group: null;
//     amount_received: number;
//     amount_capturable: number;
//     last_payment_error: null;
//     setup_future_usage: null;
//     cancellation_reason: null;
//     confirmation_method: string;
//     payment_method_types: string[];
//     statement_descriptor: null;
//     application_fee_amount: null;
//     payment_method_options: PaymentMethodOptions;
//     automatic_payment_methods: null;
//     statement_descriptor_suffix: null;
//     payment_method_configuration_details: null;
// }

// export interface AmountDetails {
//     tip: DataClass;
// }

// export interface DataMetadata {
//     resource_id: string;
// }

// export interface PaymentMethodOptions {
//     card: Card;
// }

// export interface Card {
//     network: null;
//     installments: null;
//     mandate_options: null;
//     request_three_d_secure: string;
// }

// export interface Region {
//     id: string;
//     created_at: Date;
//     updated_at: Date;
//     deleted_at: null;
//     name: string;
//     currency_code: string;
//     tax_rate: number;
//     tax_code: null;
//     gift_cards_taxable: boolean;
//     automatic_taxes: boolean;
//     tax_provider_id: null;
//     metadata: DataClass;
// }

// export interface ShippingAddress {
//     id: string;
//     created_at: Date;
//     updated_at: Date;
//     deleted_at: null;
//     customer_id: null;
//     company: null;
//     first_name: string;
//     last_name: string;
//     address_1: string;
//     address_2: string;
//     city: string;
//     country_code: string;
//     province: null;
//     postal_code: string;
//     phone: string;
//     metadata: null;
// }

// export interface ShippingMethod {
//     id: string;
//     shipping_option_id: string;
//     order_id: string;
//     claim_order_id: null;
//     cart_id: string;
//     swap_id: null;
//     return_id: null;
//     price: number;
//     data: DataClass;
//     shipping_option: ShippingOption;
//     tax_lines: TaxLine[];
//     original_total: number;
//     total: number;
//     subtotal: number;
//     original_tax_total: number;
//     tax_total: number;
// }

// export interface ShippingOption {
//     id: string;
//     created_at: Date;
//     updated_at: Date;
//     deleted_at: null;
//     name: string;
//     region_id: string;
//     profile_id: string;
//     provider_id: string;
//     price_type: string;
//     amount: number;
//     is_return: boolean;
//     admin_only: boolean;
//     data: ShippingOptionData;
//     metadata: null;
// }

// export interface ShippingOptionData {
//     id: string;
// }
