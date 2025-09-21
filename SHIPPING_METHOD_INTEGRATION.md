# Shipping Method Integration - Medusa.js Best Practices

This document outlines the implementation of shipping method integration following Medusa.js best practices.

## Overview

The shipping method integration allows users to select shipping options and automatically updates the cart with the selected shipping method, following Medusa.js API standards.

## Implementation Details

### 1. API Integration

#### **Shipping Options Fetching**
```typescript
// Medusa API Endpoint
GET /store/shipping-options?cart_id={cartId}

// Service Method
MedusaService.ListOptionsForCart(cartId: string)
```

#### **Shipping Method Addition**
```typescript
// Medusa API Endpoint
POST /store/carts/{cartId}/shipping-methods

// Request Body
{
  "option_id": "shipping_option_id"
}

// Service Method
MedusaService.addShippingMethod(cartId: string, option_id: string)
```

### 2. State Management

#### **Checkout State Model**
```typescript
export interface CheckoutStateModel {
    shipping_options: IShippingOptions[];
    selected_shipping_method: any; // NEW: Track selected shipping method
    provider_id: string;
    client_secret: string;
    payment_providers: IPaymentProviders[];
}
```

#### **Selectors**
```typescript
// Get available shipping options
static getShippingOptions(state: CheckoutStateModel): IShippingOptions[]

// Get selected shipping method
static getSelectedShippingMethod(state: CheckoutStateModel): any
```

### 3. Actions Implementation

#### **AddShippingMethod Action**
```typescript
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
        }
    } else {
        console.warn('Cannot add shipping method: No cart found');
    }
}
```

### 4. Component Integration

#### **ShippingOptionsComponent**
- **Location**: `src/app/Components/shipping-options/`
- **Features**:
  - Fetches shipping options from Medusa API
  - Displays shipping methods with prices and delivery times
  - Shows selected shipping method with visual indicator
  - Handles shipping method selection

#### **Key Methods**
```typescript
ngOnInit(): void {
    // Initialize shipping options
    this.store.dispatch(new CheckoutActions.GetShippingOptions());
    
    // Debug logging
    this.shipping_options$.subscribe(options => {
        console.log('Shipping Options loaded:', options);
    });
}

selectShippingOption($event: any): void {
    const selectedOption = $event.detail.value;
    if (selectedOption && selectedOption.id) {
        this.store.dispatch(new CheckoutActions.AddShippingMethod(selectedOption.id));
    }
}
```

### 5. UI/UX Features

#### **Visual Indicators**
- **Loading State**: "Loading shipping options..." while fetching
- **Selected Method**: Green checkmark and "Selected" text for chosen method
- **Price Display**: Highlighted prices in primary color
- **Delivery Time**: Secondary information when available

#### **Template Structure**
```html
<ion-radio-group [value]="(selected_shipping_method$ | async)?.shipping_option_id" 
                 (ionChange)="selectShippingOption($event)">
    @for (option of options; track option) {
    <ion-radio justify="space-between" [value]="option">
        <ion-item lines="none">
            <ion-label slot="start">
                <h3>{{ option.name }}</h3>
                <p *ngIf="option.provider">{{ option.provider.id }}</p>
                <p *ngIf="(selected_shipping_method$ | async)?.shipping_option_id === option.id" 
                   class="selected-indicator">
                    <ion-icon name="checkmark-circle" color="success"></ion-icon>
                    Selected
                </p>
            </ion-label>
            <ion-note slot="end">
                <div class="price-info">
                    <span class="price">{{ option.calculated_price / 100 | currency:currencyCode }}</span>
                    <span class="delivery-time" *ngIf="option.data?.delivery_time">
                        {{ option.data.delivery_time }} days
                    </span>
                </div>
            </ion-note>
        </ion-item>
    </ion-radio>
    }
</ion-radio-group>
```

### 6. Checkout Page Integration

#### **Automatic Initialization**
```typescript
constructor() {
    // Initialize shipping options and payment providers
    this.store.dispatch(new CheckoutActions.GetShippingOptions());
    this.store.dispatch(new CheckoutActions.CreatePaymentProviders());
}
```

#### **Address Update Handling**
```typescript
async check(customer: any) {
    // ... address processing ...
    
    if (data) {
        try {
            const res = await lastValueFrom(this.store.dispatch(new MedusaCartActions.UpdateMedusaCart(data)));
            // Refresh shipping options after address update
            this.store.dispatch(new CheckoutActions.GetShippingOptions());
            // Refresh payment providers
            this.store.dispatch(new CheckoutActions.CreatePaymentProviders());
        } catch (error) {
            console.log(error);
        }
    }
}
```

### 7. Best Practices Followed

#### **Medusa.js API Standards**
- ✅ Uses correct API endpoints (`/store/shipping-options`, `/store/carts/{id}/shipping-methods`)
- ✅ Proper request/response handling
- ✅ Error handling with try-catch blocks
- ✅ Console logging for debugging

#### **State Management**
- ✅ NGXS store integration
- ✅ Proper action dispatching
- ✅ State updates with cart refresh
- ✅ Selector usage for reactive updates

#### **User Experience**
- ✅ Loading states
- ✅ Visual feedback for selections
- ✅ Automatic cart updates
- ✅ Error handling

#### **Performance**
- ✅ Async/await for API calls
- ✅ Observable subscriptions with proper cleanup
- ✅ Efficient state updates

### 8. Testing Flow

1. **Add Items to Cart**: Navigate to products and add items
2. **Go to Checkout**: Click checkout button in cart
3. **Set Address**: Update shipping/billing address
4. **View Shipping Options**: Shipping methods load automatically
5. **Select Shipping Method**: Choose from available options
6. **Verify Cart Update**: Cart totals update with shipping cost
7. **Complete Checkout**: Proceed with payment

### 9. Debug Features

- **Console Logging**: Shipping options loading and selection
- **State Tracking**: Real-time state updates
- **Error Handling**: Graceful error management
- **API Response Logging**: Full API response details

### 10. Future Enhancements

- [ ] Shipping method comparison
- [ ] Shipping method filtering by region
- [ ] Real-time shipping cost calculation
- [ ] Shipping method icons/logos
- [ ] Enhanced error messages
- [ ] Shipping method descriptions

## Conclusion

The shipping method integration follows Medusa.js best practices by:
- Using the correct API endpoints
- Properly handling state management
- Providing excellent user experience
- Including comprehensive error handling
- Following reactive programming patterns

This implementation ensures a smooth checkout experience with proper shipping method selection and cart updates. 