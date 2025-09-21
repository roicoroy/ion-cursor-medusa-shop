# Payment Providers Integration

This directory contains the payment provider components that have been adapted for the Medusa shop.

## Components

### PaymentProvidersComponent
- **Location**: `src/app/Components/payment-providers/payment-providers.component.ts`
- **Purpose**: Displays available payment providers and allows user selection
- **Features**:
  - Fetches payment providers from Medusa backend
  - Displays providers in a radio group format
  - Handles provider selection and payment session creation
  - Modal-based interface with cancel functionality

### CardPaymentModal
- **Location**: `src/app/Components/card-payment-modal/card-payment-modal.ts`
- **Purpose**: Handles Stripe payment processing
- **Features**:
  - Integrates with ngx-stripe for payment processing
  - Handles payment confirmation and error handling
  - Completes cart and navigates to order review
  - Modal-based interface

## Integration

### Cart Integration
The payment flow is integrated into the existing cart component:

1. **Checkout Button**: Clicking the checkout button in the cart triggers the payment flow
2. **Payment Provider Selection**: Opens a modal to select payment method
3. **Payment Processing**: Opens Stripe payment modal for card details
4. **Order Completion**: Completes the order and navigates to review page

### Usage Flow
```typescript
// In cart component
async checkout() {
  // Initialize payment providers
  this.store.dispatch(new CheckoutActions.CreatePaymentProviders());
  
  // Open payment providers modal
  await this.openPaymentProvidersModal();
}
```

## Dependencies

- **ngx-stripe**: For Stripe payment processing
- **@ngxs/store**: For state management
- **@ionic/angular**: For UI components
- **Medusa API**: For payment provider and session management

## Configuration

Ensure the following environment variables are set:
- `MEDUSA_BACKEND_URL`: Medusa backend URL
- `MEDUSA_PUBLISHABLE_KEY`: Medusa publishable key
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key

## Testing

1. Add items to cart
2. Click checkout button
3. Select payment provider
4. Enter payment details
5. Complete payment
6. Verify order completion 