import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { lastValueFrom } from 'rxjs';
import { MedusaService } from 'src/app/shared/api/medusa.service';
import { MedusaCartState } from '../medusa-cart/medusa-cart.state';
import { CheckoutActions } from './checkout.actions';
import { MedusaCart } from '../../shared/interfaces/medusa-cart.interface';
import { MedusaCartActions } from '../medusa-cart/medusa-cart.actions';
import { environment } from '../../../environments/environment';
import { IShippingOptions, IPaymentProviders } from '../../shared/interfaces/payment.interface';

export interface CheckoutStateModel {
    shipping_options: IShippingOptions[];
    selected_shipping_method: any;
    provider_id: string;
    client_secret: string;
    payment_providers: IPaymentProviders[];
}

export interface IShippingOptionsResponse {
    shipping_options: IShippingOptions[];
}

@State({
    name: 'checkout',
    defaults: {
        shipping_options: [],
        selected_shipping_method: null,
        provider_id: '',
        client_secret: '',
        payment_providers: []
    }
})
@Injectable()
export class CheckoutState {

    private store = inject(Store);

    private medusaApi = inject(MedusaService);

    @Selector()
    static getShippingOptions(state: CheckoutStateModel): IShippingOptions[] {
        return state.shipping_options;
    }
    // 
    @Selector()
    static getPaymentProviders(state: CheckoutStateModel): IPaymentProviders[] {
        return state.payment_providers;
    }

    @Selector()
    static getSelectedShippingMethod(state: CheckoutStateModel): any {
        return state.selected_shipping_method;
    }

    @Selector()
    static getSecretKey(state: CheckoutStateModel) {
        return state.client_secret;
    }
    // 
    @Action(CheckoutActions.GetShippingOptions)
    getShippingOptions(ctx: StateContext<CheckoutStateModel>) {
        const cart = this.store.selectSnapshot(MedusaCartState.getMedusaCart);
        if (cart?.id) {
            this.medusaApi.ListOptionsForCart(cart!.id)
                .subscribe((res: IShippingOptionsResponse) => {
                    return ctx.patchState({
                        shipping_options: res.shipping_options,
                    });
                });
        }
    }
    // 
    @Action(CheckoutActions.AddShippingMethod)
    async addShippingMethod(ctx: StateContext<CheckoutStateModel>, { option_id }: CheckoutActions.AddShippingMethod) {
        const cart = this.store.selectSnapshot(MedusaCartState.getMedusaCart);
        if (cart?.id) {
            try {
                console.log('Adding shipping method to cart:', { cartId: cart.id, optionId: option_id });
                
                // Add shipping method to cart using Medusa API
                const updatedCart = await lastValueFrom(
                    this.medusaApi.addShippingMethod(cart.id, option_id)
                );
                
                console.log('Shipping method added successfully:', updatedCart);
                
                // Update cart state with the new shipping method
                this.store.dispatch(new MedusaCartActions.UpdateMedusaCartState(updatedCart.cart));
                
                // Store the selected shipping method in checkout state
                ctx.patchState({
                    selected_shipping_method: updatedCart.cart.shipping_methods?.[0] || null
                });
                
                // Refresh shipping options after adding shipping method
                this.store.dispatch(new CheckoutActions.GetShippingOptions());
                
            } catch (error) {
                console.error('Error adding shipping method:', error);
                // You might want to dispatch an error action here
            }
        } else {
            console.warn('Cannot add shipping method: No cart found');
        }
    }
    // 
    @Action(CheckoutActions.PopulatePaymentSession)
    async populatePaymentSession(ctx: StateContext<CheckoutStateModel>, { option_id }: CheckoutActions.PopulatePaymentSession) {

    }

    @Action(CheckoutActions.CreatePaymentProviders)
    async createPaymentProviders(ctx: StateContext<CheckoutStateModel>) {
        try {
            const cart: any = this.store.selectSnapshot(MedusaCartState.getMedusaCart);
            
            if (!cart?.id) {
                console.warn('No cart found, cannot create payment collection');
                return;
            }
            
            console.log('Creating payment collection for cart:', cart.id);
            
            // Step 1: Create payment collection for the cart
            console.log('Creating payment collection with cart_id:', cart.id);
            const response = await fetch(
                `${environment.MEDUSA_BACKEND_URL}/store/payment-collections`,
                {
                    credentials: "include",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-publishable-api-key": environment.MEDUSA_PUBLISHABLE_KEY,
                    },
                    body: JSON.stringify({
                        cart_id: cart.id,
                    }),
                }
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error creating payment collection:', errorData);
                throw new Error(`Failed to create payment collection: ${errorData.message}`);
            }
            
            const { payment_collection } = await response.json();

            console.log('Payment collection created:', payment_collection);
            
            // Step 2: Get payment providers for the region
            if (!cart?.region_id) {
                console.warn('No region_id found, cannot load payment providers');
                return;
            }
            
            console.log('Loading payment providers for region:', cart.region_id);
            
            const { payment_providers } = await fetch(
                `${environment.MEDUSA_BACKEND_URL}/store/payment-providers?region_id=${cart.region_id}`, {
                credentials: "include",
                headers: {
                    "x-publishable-api-key": environment.MEDUSA_PUBLISHABLE_KEY,
                },
            }).then((res) => res.json());

            console.log('Payment providers response:', payment_providers);
            
            if (payment_providers && payment_providers.length > 0) {
                ctx.patchState({
                    payment_providers
                });
                console.log('Payment providers loaded successfully:', payment_providers.length, 'providers');
            } else {
                console.warn('No payment providers found for region:', cart.region_id);
                ctx.patchState({
                    payment_providers: []
                });
            }
        } catch (error) {
            console.error('Error creating payment providers:', error);
            ctx.patchState({
                payment_providers: []
            });
        }
    }



    @Action(CheckoutActions.SetPaymentSession)
    async setPaymentSession(ctx: StateContext<CheckoutStateModel>, { payment_provider_id }: CheckoutActions.SetPaymentSession) {
        try {
            const cart = this.store.selectSnapshot(MedusaCartState.getMedusaCart);
            const state = ctx.getState();
            
            // Check if we already have a client secret for this provider
            if (state.client_secret) {
                console.log('Payment session already exists, skipping creation');
                return;
            }
            
            console.log('Setting payment session for provider:', payment_provider_id);
            console.log('Current cart:', cart);
            
            // Validate that we have a valid cart
            if (!cart || !cart.id) {
                console.error('No valid cart found. Cannot create payment collection.');
                throw new Error('No valid cart found. Please ensure you have items in your cart.');
            }
            
            let paymentCollectionId = cart.payment_collection?.id;
            
            // Step 1: Create payment collection if it doesn't exist
            if (!paymentCollectionId) {
                console.log('No payment collection found, creating one...');
                console.log('Creating payment collection with cart_id:', cart.id);
                
                const response = await fetch(
                    `${environment.MEDUSA_BACKEND_URL}/store/payment-collections`,
                    {
                        credentials: "include",
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "x-publishable-api-key": environment.MEDUSA_PUBLISHABLE_KEY,
                        },
                        body: JSON.stringify({
                            cart_id: cart.id,
                        }),
                    }
                );
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error creating payment collection:', errorData);
                    throw new Error(`Failed to create payment collection: ${errorData.message}`);
                }
                
                const { payment_collection } = await response.json();
                paymentCollectionId = payment_collection.id;
                console.log('Payment collection created:', payment_collection);
            }
            
            // Step 2: Create payment session for the selected provider
            console.log('Creating payment session for collection:', paymentCollectionId);
            const sessionResponse = await fetch(
                `${environment.MEDUSA_BACKEND_URL}/store/payment-collections/${paymentCollectionId}/payment-sessions`, 
                {
                    credentials: "include",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-publishable-api-key": environment.MEDUSA_PUBLISHABLE_KEY,
                    },
                    body: JSON.stringify({
                        provider_id: payment_provider_id,
                    }),
                }
            );
            
            if (!sessionResponse.ok) {
                const errorData = await sessionResponse.json();
                console.error('Error creating payment session:', errorData);
                throw new Error(`Failed to create payment session: ${errorData.message}`);
            }
            
            const { payment_collection: updatedPaymentCollection } = await sessionResponse.json();
            console.log('Payment session created:', updatedPaymentCollection);
            
            // Step 3: Re-fetch cart to get updated payment collection
            const cartResponse = await fetch(
                `${environment.MEDUSA_BACKEND_URL}/store/carts/${cart.id}`,
                {
                    credentials: "include",
                    headers: {
                        "x-publishable-api-key": environment.MEDUSA_PUBLISHABLE_KEY,
                    },
                }
            );
            
            if (!cartResponse.ok) {
                const errorData = await cartResponse.json();
                console.error('Error fetching updated cart:', errorData);
                throw new Error(`Failed to fetch updated cart: ${errorData.message}`);
            }
            
            const updatedCart = await cartResponse.json();
            
            console.log('Updated cart with payment collection:', updatedCart.cart);
            
            // Step 4: Update cart state and extract client secret
            this.store.dispatch(new MedusaCartActions.UpdateMedusaCartState(updatedCart.cart));
            
            const clientSecret = updatedCart.cart.payment_collection?.payment_sessions?.[0]?.data?.client_secret;
            console.log('Client secret extracted:', clientSecret);
            
            return ctx.patchState({
                ...state,
                client_secret: clientSecret || '',
            });
        } catch (error) {
            console.error('Error setting payment session:', error);
        }
    }

    @Action(CheckoutActions.RefreshPaymentSession)
    refreshPaymentSession(ctx: StateContext<CheckoutStateModel>, { cartId, provider_id }: CheckoutActions.RefreshPaymentSession) {
        const state = ctx.getState();
        return this.medusaApi.refreshPaymentSession(cartId, provider_id)
            .subscribe((cart: any) => {
                ctx.patchState({
                    ...state,
                    client_secret: cart.cart?.payment_session?.data?.client_secret,
                });
                this.store.dispatch(new MedusaCartActions.RefreshCart());
            });
    }

    @Action(CheckoutActions.SecretKey)
    async secretKey(ctx: StateContext<CheckoutStateModel>, { secretKey }: CheckoutActions.SecretKey) {
        ctx.patchState({
            client_secret: secretKey,
        });
    }

    @Action(CheckoutActions.UnSetSecretKey)
    async unSetSecretKey(ctx: StateContext<CheckoutStateModel>): Promise<any> {
        return ctx.patchState({
            client_secret: '',
        });
    }

    @Action(CheckoutActions.ClearShippingOptions)
    clearShippingMethods(ctx: StateContext<CheckoutStateModel>) {
        return ctx.patchState({
            shipping_options: [],
        });
    }

    @Action(CheckoutActions.ClearPaymentSession)
    clearPaymentSession(ctx: StateContext<CheckoutStateModel>) {
        return ctx.patchState({
            payment_providers: [],
            client_secret: '',
            shipping_options: [],
        })
    }

    @Action(CheckoutActions.LogOut)
    logOut(ctx: StateContext<CheckoutStateModel>) {
        ctx.patchState({
            shipping_options: [],
            provider_id: '',
            client_secret: '',
            payment_providers: [],
        });
    }
}
