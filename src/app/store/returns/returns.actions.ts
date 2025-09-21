export namespace ReturnsActions {
    export class CreateReturn {
        static readonly type = '[Returns] Create Return';
        constructor(public payload: {
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
        }) {}
    }

    export class GetReturn {
        static readonly type = '[Returns] Get Return';
        constructor(public payload: string) {} // returnId
    }

    export class GetReturns {
        static readonly type = '[Returns] Get Returns';
        constructor(public payload?: { limit?: number; offset?: number }) {}
    }

    export class GetReturnReasons {
        static readonly type = '[Returns] Get Return Reasons';
    }

    export class SetReturns {
        static readonly type = '[Returns] Set Returns';
        constructor(public payload: any[]) {}
    }

    export class SetReturnReasons {
        static readonly type = '[Returns] Set Return Reasons';
        constructor(public payload: any[]) {}
    }

    export class SetSelectedReturn {
        static readonly type = '[Returns] Set Selected Return';
        constructor(public payload: any) {}
    }

    export class ClearReturns {
        static readonly type = '[Returns] Clear Returns';
    }
} 