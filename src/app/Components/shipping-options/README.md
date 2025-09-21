# Shipping Options Component

This directory contains the shipping options component that displays available shipping methods for the Medusa shop.

## Overview

The `ShippingOptionsComponent` is a standalone component that handles the display and selection of shipping options for a cart. It integrates with the Medusa API to fetch available shipping methods based on the cart ID and customer address.

## Features

### 🚚 **Shipping Method Display**
- Fetches shipping options from Medusa API using cart ID
- Displays shipping method name, provider, and calculated price
- Shows delivery time information when available
- Real-time currency formatting based on cart currency

### 🎯 **Selection Handling**
- Radio button selection for shipping methods
- Automatic dispatch of shipping method selection to store
- Integration with checkout flow

### 🎨 **UI/UX Features**
- Loading state while fetching shipping options
- Clean, responsive design
- Professional styling with price highlighting
- Delivery time information display

## Component Structure

### Files
- `shipping-options.component.ts` - Main component logic
- `shipping-options.component.html` - Template with shipping options UI
- `shipping-options.component.scss` - Styling for shipping options
- `README.md` - This documentation

### Key Methods

#### `ngOnInit()`
- Initializes currency code from cart state
- Dispatches `GetShippingOptions` action to fetch shipping methods
- Sets up debug logging for shipping options

#### `selectShippingOption($event: any)`
- Handles shipping option selection from radio buttons
- Dispatches `AddShippingMethod` action with selected option ID
- Logs selection for debugging

## API Integration

### Medusa API Endpoint
The component uses the Medusa API endpoint:
```
GET /store/shipping-options?cart_id={cartId}
```

### Service Method
Uses `MedusaService.ListOptionsForCart(cartId)` to fetch shipping options.

### State Management
- **NGXS Store**: Uses `CheckoutState` for shipping options data
- **Selector**: `CheckoutState.getShippingOptions` to access shipping options
- **Actions**: `CheckoutActions.GetShippingOptions` and `CheckoutActions.AddShippingMethod`

## Data Structure

### Shipping Option Interface
```typescript
interface IShippingOptions {
  id: string;
  name: string;
  price_type: string;
  service_zone_id: string;
  shipping_profile_id: string;
  provider_id: string;
  data: Record<string, any>;
  service_zone: ServiceZone;
  type: ShippingType;
  provider: ShippingProvider;
  rules: ShippingRule[];
  calculated_price: number;
  prices: ShippingPrice[];
  is_tax_inclusive: boolean;
}
```

## Integration Points

### Checkout Page Integration
- Used in the checkout page to display shipping method selection
- Automatically initialized when checkout page loads
- Refreshed when customer address is updated

### State Integration
- Integrates with existing NGXS store architecture
- Uses `MedusaCartState` for currency information
- Uses `CheckoutState` for shipping options management

## Usage Flow

1. **Page Load**: Component initializes and fetches shipping options
2. **Address Update**: Shipping options refresh when address changes
3. **Selection**: User selects shipping method via radio buttons
4. **State Update**: Selected shipping method is stored in NGXS state
5. **Checkout**: Shipping method is used in checkout process

## Styling

The component uses a clean, professional design:
- **Loading State**: Centered loading message with medium color
- **Radio Buttons**: Clean radio button layout with proper spacing
- **Price Display**: Highlighted prices in primary color
- **Delivery Time**: Secondary information in medium color
- **Responsive**: Works on all device sizes

## Dependencies

- **Ionic Components**: Radio buttons, items, labels, notes, text
- **NGXS**: State management for shipping options
- **Angular**: Core framework features
- **Medusa API**: Shipping options data

## Testing

1. Navigate to checkout page
2. Verify shipping options load after address is set
3. Test selecting different shipping methods
4. Verify prices and delivery times display correctly
5. Check that selection updates the store state

## Future Enhancements

- [ ] Add shipping method icons/logos
- [ ] Implement shipping method comparison
- [ ] Add shipping method descriptions
- [ ] Enhanced error handling for failed API calls
- [ ] Loading states and progress indicators
- [ ] Shipping method filtering by region/country 