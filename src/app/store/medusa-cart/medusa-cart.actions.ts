import { MedusaVariant } from "../../shared/interfaces/medusa-variant.interface";
import { Item } from "../../shared/interfaces/medusa-order";
import { MedusaCart } from "../../shared/interfaces/medusa-cart.interface";

export namespace MedusaCartActions {
    export class UpdateMedusaCartState {
        static readonly type = '[CartActions] UpdateMedusaCartState';
        constructor(public cart: MedusaCart) { }
    }
    export class UpdateMedusaCart {
        static readonly type = '[CartActions] Update Medusa Cart';
        constructor(public updateCartData: any) { }
    }
    export class UpdateCartRegion {
        static readonly type = '[CartActions] Update Cart Region';
        constructor(public region_id: string) { }
    }
    export class RefreshCart {
        static readonly type = '[CartActions] Refresh Cart';
    }
    export class AddToMedusaCart {
        static readonly type = '[CartActions] Add To Cart';
        constructor(public variant: MedusaVariant) { }
    }
    export class AddCartLineItems {
        static readonly type = '[CartActions] Add Cart Line Items';
        constructor(public cartId: string, public items: { variant_id: string, quantity: number }) { }
    }
    export class IncreaseCartItem {
        static readonly type = '[CartActions] Increase Cart Item';
        constructor(public cartItem: Item) { }
    }
    export class DecreaseCartItem {
        static readonly type = '[CartActions] Decrease Cart Item';
        constructor(public cartItem: Item) { }
    }
    export class DeleteCartItem {
        static readonly type = '[CartActions] Delete Cart Item';
        constructor(public line_id: string) { }
    }
    export class AddCartAddresses {
        static readonly type = '[CartActions] Add Cart Addresses';
        constructor(public billing_address: any, public shipping_address?: any) { }
    }
    export class CompleteCart {
        static readonly type = '[CartActions] Complete Cart';
    }
    export class RetriveCompletedOrder {
        static readonly type = '[CartActions] Retrive Completed Order';
        constructor(public orderId: string) { }
    }
    export class AddPromotionstoCart {
        static readonly type = '[CartActions] Add Promotions to Cart';
        constructor(public promo_code: string) { }
    }
    export class RemovePromotionsfromCart {
        static readonly type = '[CartActions] Remove Promotions from Cart';
        constructor(public promo_code: string) { }
    }
    export class LogOut {
        static readonly type = '[CartActions] Logout';
    }
}
