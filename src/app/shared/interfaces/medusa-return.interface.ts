export interface MedusaReturn {
  id: string;
  status: ReturnStatus;
  order_id: string;
  items: OrderReturnItem[];
  display_id: number;
  metadata: Record<string, unknown> | null;
  refund_amount?: number;
  raw_refund_amount?: {
    value: string;
    precision: number;
  };
  order?: any; // MedusaOrder
  exchange_id?: string;
  exchange?: any; // OrderExchangeDTO
  claim_id?: string;
  claim?: any; // OrderClaimDTO
  location_id?: string;
  no_notification?: boolean;
  created_by?: string | null;
  shipping_methods?: any[]; // OrderShippingMethodDTO[]
  transactions?: any[]; // OrderTransactionDTO[]
  created_at?: string | Date;
  updated_at?: string | Date;
  deleted_at?: string | Date;
  canceled_at?: string | Date;
  requested_at?: string | Date;
  received_at?: string | Date;
}

export type ReturnStatus = 
  | 'requested'
  | 'received'
  | 'requires_action'
  | 'canceled';

export interface OrderReturnItem {
  id: string;
  item_id: string;
  return_id: string;
  quantity: number;
  is_requested: boolean;
  requested_quantity?: number;
  received_quantity?: number;
  item: any; // MedusaOrderItem
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateReturnRequest {
  order_id: string;
  items: {
    item_id: string;
    quantity: number;
    reason_id?: string;
    note?: string;
  }[];
  return_shipping?: {
    option_id: string;
    price?: number;
  };
  refund_amount?: number;
  location_id?: string;
  no_notification?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ReturnReason {
  id: string;
  value: string;
  label: string;
  description?: string;
  parent_return_reason_id?: string;
  parent_return_reason?: ReturnReason;
  return_reason_children?: ReturnReason[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface ReturnResponse {
  return: MedusaReturn;
}

export interface ReturnsListResponse {
  returns: MedusaReturn[];
  count: number;
  offset: number;
  limit: number;
} 