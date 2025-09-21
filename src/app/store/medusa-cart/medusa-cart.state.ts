import { Injectable, inject } from "@angular/core";
import { State, Store, Selector, Action, StateContext } from "@ngxs/store";
import { catchError, lastValueFrom, take, throwError } from "rxjs";
import { MedusaService } from "../../shared/api/medusa.service";
import { MedusaCartActions } from "./medusa-cart.actions";
import { MedusaCart } from "../../shared/interfaces/medusa-cart.interface";
import { MedusaLineItem } from "../../shared/interfaces/medusa-line-items.interface";
import { RegionsState } from "../regions/regions.state";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { environment } from "../../../environments/environment";
import { MedusaOrder, MedusaOrderResponse } from "../../shared/interfaces/medusa-order";
import { DeleteProdRespoonse } from "../../shared/interfaces/delete-prod-response.interface";

export interface MedusaCartResponse {
    cart: MedusaCart;
}

export interface MedusaCartStateModel {
    medusaCart: MedusaCart | null;
    completed_order_id: string;
    completedOrder: MedusaOrder | null;
}

@State({
    name: 'medusaCart',
    defaults: {
        medusaCart: null,
        completed_order_id: '',
        completedOrder: null
    }
})
@Injectable()
export class MedusaCartState {

    private medusaApi = inject(MedusaService);

    private store = inject(Store);

    @Selector()
    static getMedusaCart(state: MedusaCartStateModel): MedusaCart | null {
        return state.medusaCart;
    }

    @Selector()
    static getCartId(state: MedusaCartStateModel): string | undefined {
        return state.medusaCart?.id;
    }

    @Selector()
    static getCompleterdOrderId(state: MedusaCartStateModel): string {
        return state?.completed_order_id;
    }
    @Selector()
    static getCompleterdOrder(state: MedusaCartStateModel): MedusaOrder | null {
        return state.completedOrder;
    }

    @Action(MedusaCartActions.AddToMedusaCart)
    async addToCart(ctx: StateContext<MedusaCartStateModel>, { variant }: MedusaCartActions.AddToMedusaCart) {
        try {
            const medusaCart = ctx.getState().medusaCart;
            const lineItem: MedusaLineItem = {
                variant_id: variant.id,
                quantity: 1,
            }
            if (!medusaCart) {
                const selectedCoutry = this.store.selectSnapshot(RegionsState.getDefaultRegion);
                this.medusaApi.cartsCreate(selectedCoutry?.region_id)
                    .pipe()
                    .subscribe((res: MedusaCartResponse) => {
                        if (res.cart) {
                            ctx.patchState({
                                medusaCart: res.cart,
                            });
                            this.store.dispatch(new MedusaCartActions.AddCartLineItems(res.cart.id, lineItem))
                        }
                    });

            } else {
                this.store.dispatch(new MedusaCartActions.AddCartLineItems(medusaCart.id, lineItem))
            }
        } catch (error) {
            console.error(error);
        }
    }

    @Action(MedusaCartActions.AddCartLineItems)
    addCartLineItems(ctx: StateContext<MedusaCartStateModel>, { cartId, items }: MedusaCartActions.AddCartLineItems) {
        return this.medusaApi.AddCartLineItems(cartId, items)
            // .pipe(takeUntilDestroyed())
            .subscribe((res: any) => {
                return ctx.patchState({
                    medusaCart: res?.cart,
                });
            });
    }
    // 
    @Action(MedusaCartActions.RefreshCart)
    refreshCart(ctx: StateContext<MedusaCartStateModel>) {
        try {
            const cartId = ctx.getState().medusaCart?.id
            if (cartId != null) {
                this.medusaApi.cartsRetrieve(cartId)
                    .subscribe({
                        next: (res: MedusaCartResponse) => {
                            ctx.patchState({
                                medusaCart: res.cart,
                            });
                        },
                        error: (error) => {
                            console.error('Error refreshing cart:', error);
                            // If cart doesn't exist, clear the state
                            ctx.patchState({
                                medusaCart: null,
                            });
                        }
                    });
            } else {
                // No cart ID, ensure state is cleared
                console.log('No cart ID found, clearing cart state');
                ctx.patchState({
                    medusaCart: null,
                });
            }
        } catch (error) {
            console.error('Error in refreshCart:', error);
            ctx.patchState({
                medusaCart: null,
            });
        }
    }
    // 
    @Action(MedusaCartActions.RetriveCompletedOrder)
    retriveCompletedOrder(ctx: StateContext<MedusaCartStateModel>, { orderId }: MedusaCartActions.RetriveCompletedOrder) {
        this.medusaApi.retriveCompletedOrder(orderId)
            .pipe(take(1))
            .subscribe((res: MedusaOrderResponse) => {
                return ctx.patchState({
                    completedOrder: res.order,
                });
            })
    }

    @Action(MedusaCartActions.UpdateCartRegion)
    updateCartRegion(ctx: StateContext<MedusaCartStateModel>, { region_id }: MedusaCartActions.UpdateCartRegion) {
        const cartId = ctx.getState().medusaCart?.id;
        const data: any = {
            region_id,
        };
        if (cartId) {
            this.medusaApi.cartsUpdate(cartId, data)
                // .pipe(takeUntilDestroyed())
                .subscribe((res: MedusaCartResponse) => {
                    if (res.cart) {
                        return ctx.patchState({
                            medusaCart: res?.cart,
                        });
                    }
                });
        }

    }

    @Action(MedusaCartActions.UpdateMedusaCart)
    updateMedusaCart(ctx: StateContext<MedusaCartStateModel>, { updateCartData }: MedusaCartActions.UpdateMedusaCart) {
        // console.log('nocart', updateCartData);
        const cartId = ctx.getState().medusaCart?.id;
        
        // Check if this is a line item update
        if (updateCartData.line_items && updateCartData.line_items.length > 0) {
            // Handle line item updates using the specific endpoint
            const lineItem = updateCartData.line_items[0];
            if (cartId) {
                this.medusaApi.updateCartLineItems(cartId, lineItem.id, { quantity: lineItem.quantity })
                    .subscribe((res: MedusaCartResponse) => {
                        if (res.cart) {
                            ctx.patchState({
                                medusaCart: res?.cart,
                            });
                        }
                    });
            }
        } else {
            // Handle general cart updates
            if (cartId) {
                this.medusaApi.cartsUpdate(cartId, updateCartData)
                    .subscribe((res: MedusaCartResponse) => {
                        if (res.cart) {
                            ctx.patchState({
                                medusaCart: res?.cart,
                            });
                        }
                    });
            }
        }
    }
    // 
    @Action(MedusaCartActions.AddPromotionstoCart)
    addPromotionstoCart(ctx: StateContext<MedusaCartStateModel>, { promo_code }: MedusaCartActions.AddPromotionstoCart) {
        const cartId = ctx.getState().medusaCart?.id;
        this.medusaApi.AddPromotionstoCart(cartId!, promo_code)
            // .pipe(takeUntilDestroyed())
            .subscribe((cart: any) => {
                ctx.patchState({
                    medusaCart: cart?.cart,
                });
            });
    }
    // 
    @Action(MedusaCartActions.RemovePromotionsfromCart)
    async removePromotionsfromCart(ctx: StateContext<MedusaCartStateModel>, { promo_code }: MedusaCartActions.RemovePromotionsfromCart) {
        const cartId = ctx.getState().medusaCart?.id;
        const url = `${environment.MEDUSA_API_BASE_PATH}/store/carts/${cartId}/promotions`;
        const { cart } = await fetch(
            url,
            {
                credentials: "include",
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-publishable-api-key": environment.MEDUSA_PUBLISHABLE_KEY,
                },
                body: JSON.stringify({
                    promo_codes: [
                        promo_code
                    ]
                }),
            }
        ).then((res) => res.json())
        // console.log('#️⃣', cart);
        ctx.patchState({
            medusaCart: cart,
        });
    }
    // 
    @Action(MedusaCartActions.IncreaseCartItem)
    increaseCartItem(ctx: StateContext<MedusaCartStateModel>, { cartItem }: MedusaCartActions.IncreaseCartItem): void {
        const cartId = ctx.getState().medusaCart?.id
        if (cartId != null) {
            this.medusaApi.AddCartLineItems(cartId, {
                variant_id: cartItem.variant_id,
                quantity: 1
            })
                .pipe(takeUntilDestroyed())
                .subscribe((res: any) => {
                    return ctx.patchState({
                        medusaCart: res.cart,
                    });
                });
        }
    }
    // 
    @Action(MedusaCartActions.DecreaseCartItem)
    decreaseCartItem(ctx: StateContext<MedusaCartStateModel>, { cartItem }: MedusaCartActions.DecreaseCartItem): void {
        const cart = ctx.getState().medusaCart;
        if (cart?.id != null) {
            const filteredItem: any = cart.items?.filter((item: any) => item.variant_id === cartItem.variant_id);
            if (filteredItem[0].quantity >= 2) {
                this.medusaApi.AddCartLineItems(cart.id, {
                    variant_id: cartItem.variant_id,
                    quantity: -1
                })
                    // .pipe(takeUntilDestroyed())
                    .subscribe((res: any) => {
                        return ctx.patchState({
                            medusaCart: res.cart,
                        });
                    });
            } else {
                this.store.dispatch(new MedusaCartActions.DeleteCartItem(filteredItem[0].id));
            }
        }
    }
    // 
    @Action(MedusaCartActions.DeleteCartItem)
    deleteProductMedusaFromCart(ctx: StateContext<MedusaCartStateModel>, { line_id }: MedusaCartActions.DeleteCartItem): void {
        const savedCart = ctx.getState().medusaCart;
        if (savedCart != null) {
            // console.log('🔴', savedCart.id, line_id);
            this.medusaApi.cartsLineItemsDelete(savedCart.id, line_id)
                .subscribe((res: DeleteProdRespoonse) => {
                    return ctx.patchState({
                        medusaCart: res.parent,
                    });
                });
        }
    }
    // 
    @Action(MedusaCartActions.CompleteCart)
    async completeCart(ctx: StateContext<MedusaCartStateModel>) {
        try {
            const cartId = ctx.getState().medusaCart?.id;
            // console.log('⭕', cartId);
            if (cartId != null) {
                const res = await lastValueFrom(this.medusaApi.completeMedusaCart(cartId));
                // console.log('⭕', res);
                return ctx.patchState({
                    medusaCart: undefined,
                    completed_order_id: res.order.id,
                    completedOrder: res.type === 'order' ? res?.order : undefined,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 
    @Action(MedusaCartActions.UpdateMedusaCartState)
    async updateMedusaCartState(ctx: StateContext<MedusaCartStateModel>, { cart }: MedusaCartActions.UpdateMedusaCartState) {
        return ctx.patchState({
            medusaCart: cart,
        });
    }
    // 
    @Action(MedusaCartActions.LogOut)
    logout(ctx: StateContext<MedusaCartStateModel>) {
        ctx.patchState({
            medusaCart: undefined,
            completedOrder: undefined,
            completed_order_id: '',
        });
    }
}
