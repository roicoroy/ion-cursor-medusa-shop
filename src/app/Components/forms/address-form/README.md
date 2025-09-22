# Address Form Component

A unified, reusable address form component for managing billing and shipping addresses throughout the application.

## Overview

The `AddressFormComponent` is a standalone, reactive form component that can be used for:
- Customer billing addresses
- Customer shipping addresses  
- Registration address collection
- Address management and editing

## Features

### 🎯 **Flexible Configuration**
- **Address Types**: Support for billing, shipping, or general addresses
- **Conditional Fields**: Show/hide email and company fields as needed
- **Validation**: Configurable required/optional field validation
- **Initial Data**: Pre-populate form with existing address data

### 📝 **Comprehensive Form Fields**
- **Personal Information**: First name, last name, email (optional), company (optional)
- **Address Details**: Address line 1 & 2, city, postal code
- **Location**: Country selection with region integration
- **Contact**: Phone number with validation

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first with adaptive layouts
- **Ionic Integration**: Native Ionic form components
- **Visual Feedback**: Real-time validation with error states
- **Accessibility**: ARIA labels and keyboard navigation

### 🔧 **Technical Features**
- **Reactive Forms**: Angular reactive forms with validation
- **ControlValueAccessor**: Can be used with ngModel and reactive forms
- **NGXS Integration**: Integrates with regions state management
- **TypeScript**: Full type safety with interfaces
- **Internationalization**: Translation support with ngx-translate

## Usage

### Basic Usage

```typescript
import { AddressFormComponent } from './components/forms/address-form/address-form.component';

@Component({
  imports: [AddressFormComponent]
})
export class MyComponent {
  onAddressChange(addressData: AddressFormData) {
    console.log('Address updated:', addressData);
  }

  onFormValidityChange(isValid: boolean) {
    console.log('Form is valid:', isValid);
  }
}
```

```html
<app-address-form
  addressType="billing"
  [showEmail]="true"
  [showCompany]="false"
  [required]="true"
  [initialData]="existingAddress"
  (formData)="onAddressChange($event)"
  (formValid)="onFormValidityChange($event)">
</app-address-form>
```

### With Reactive Forms

```typescript
// As a form control
this.checkoutForm = this.fb.group({
  billingAddress: [null, Validators.required],
  shippingAddress: [null, Validators.required]
});
```

```html
<app-address-form
  formControlName="billingAddress"
  addressType="billing"
  [showEmail]="true">
</app-address-form>
```

### Configuration Options

```typescript
interface AddressFormConfig {
  addressType: 'billing' | 'shipping' | 'general';
  showEmail: boolean;
  showCompany: boolean;
  required: boolean;
  initialData?: Partial<AddressFormData>;
  disabled: boolean;
}
```

## API Reference

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `addressType` | `'billing' \| 'shipping' \| 'general'` | `'general'` | Type of address form |
| `showEmail` | `boolean` | `false` | Show email field |
| `showCompany` | `boolean` | `false` | Show company field |
| `required` | `boolean` | `true` | Make fields required |
| `initialData` | `Partial<AddressFormData>` | `undefined` | Pre-populate form |
| `disabled` | `boolean` | `false` | Disable form |

### Outputs

| Event | Type | Description |
|-------|------|-------------|
| `formValid` | `EventEmitter<boolean>` | Emits form validity status |
| `formData` | `EventEmitter<AddressFormData>` | Emits current form data |

### Public Methods

| Method | Return Type | Description |
|--------|-------------|-------------|
| `markAllAsTouched()` | `void` | Mark all fields as touched |
| `reset()` | `void` | Reset form to initial state |
| `isValid()` | `boolean` | Check if form is valid |
| `getValue()` | `AddressFormData` | Get current form value |
| `getFormattedAddress()` | `string` | Get formatted address string |

## Data Interface

```typescript
interface AddressFormData {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  country_code: string;
  postal_code: string;
  phone: string;
  company?: string;
  email?: string;
}
```

## Integration Examples

### Billing Address Form
```html
<app-address-form
  addressType="billing"
  [showEmail]="true"
  [showCompany]="true"
  [required]="true"
  (formData)="onBillingAddressChange($event)">
</app-address-form>
```

### Shipping Address Form
```html
<app-address-form
  addressType="shipping"
  [showEmail]="false"
  [showCompany]="false"
  [required]="true"
  (formData)="onShippingAddressChange($event)">
</app-address-form>
```

### Registration Address Form
```html
<app-address-form
  addressType="general"
  [showEmail]="true"
  [showCompany]="false"
  [required]="true"
  [initialData]="userAddress"
  (formData)="onRegistrationAddressChange($event)">
</app-address-form>
```

### Address Management
```html
<app-address-form
  addressType="general"
  [showEmail]="false"
  [showCompany]="true"
  [required]="true"
  [initialData]="existingAddress"
  (formData)="onAddressUpdate($event)"
  (formValid)="canSave = $event">
</app-address-form>

<ion-button 
  [disabled]="!canSave" 
  (click)="saveAddress()">
  Save Address
</ion-button>
```

## Validation

### Built-in Validation Rules
- **Required Fields**: First name, last name, address_1, city, country_code, postal_code, phone
- **Email Validation**: Valid email format when email field is shown
- **Minimum Length**: Names must be at least 2 characters
- **Phone Format**: Basic phone number validation

### Custom Validation
```typescript
// Add custom validators in parent component
this.addressForm.get('postal_code')?.setValidators([
  Validators.required,
  Validators.pattern(/^[0-9]{5}(-[0-9]{4})?$/) // US ZIP code format
]);
```

## Styling

### CSS Custom Properties
```scss
app-address-form {
  --form-background: var(--ion-color-light);
  --form-border-color: var(--ion-color-medium);
  --form-border-radius: 8px;
  --error-color: var(--ion-color-danger);
  --success-color: var(--ion-color-success);
}
```

### Custom Classes
- `.address-form` - Main form container
- `.form-item` - Individual form field container
- `.name-row` - Horizontal layout for name fields
- `.city-postal-row` - Horizontal layout for city/postal
- `.error-message` - Error message styling
- `.form-actions` - Action buttons container

## State Management

### NGXS Integration
The component integrates with the regions state to:
- Load available countries/regions
- Set default country based on user's region
- Update region when country changes

```typescript
// Observables used
regionList$: Observable<NewCountryListModel[]>
currentRegion$: Observable<NewCountryListModel>

// Actions dispatched
RegionsActions.GetCountries()
RegionsActions.SetSelectedCountry(country)
```

## Accessibility

- **ARIA Labels**: All form fields have proper labels
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Compatible with screen readers
- **Focus Management**: Proper focus indicators
- **Error Announcements**: Errors are announced to screen readers

## Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **Progressive Enhancement**: Graceful degradation for older browsers

## Testing

### Unit Tests
```typescript
describe('AddressFormComponent', () => {
  it('should validate required fields', () => {
    // Test validation logic
  });

  it('should emit form data on changes', () => {
    // Test form data emission
  });

  it('should handle country selection', () => {
    // Test country/region integration
  });
});
```

### Integration Tests
```typescript
describe('Address Form Integration', () => {
  it('should work with reactive forms', () => {
    // Test ControlValueAccessor implementation
  });

  it('should integrate with NGXS store', () => {
    // Test state management integration
  });
});
```

## Migration Guide

### From Old Forms
If migrating from the previous address forms:

1. **Replace imports**:
   ```typescript
   // Old
   import { AddressFormComponent } from './address-form/address-form.component';
   import { CustomerAddressFormComponent } from './customer-address-form/customer-address-form.component';
   
   // New
   import { AddressFormComponent } from './forms/address-form/address-form.component';
   ```

2. **Update templates**:
   ```html
   <!-- Old -->
   <app-customer-address-form [customer]="customer"></app-customer-address-form>
   
   <!-- New -->
   <app-address-form 
     [initialData]="customer.default_address"
     [showEmail]="true"
     (formData)="onAddressChange($event)">
   </app-address-form>
   ```

3. **Update form handling**:
   ```typescript
   // Old
   onCustomerAddressChange(address: any) { ... }
   
   // New
   onAddressChange(address: AddressFormData) { ... }
   ```

## Future Enhancements

- [ ] **Address Validation**: Integration with address validation services
- [ ] **Autocomplete**: Google Places API integration
- [ ] **Multiple Addresses**: Support for multiple address management
- [ ] **Address Types**: Support for work, home, other address types
- [ ] **Geolocation**: Auto-detect user location
- [ ] **Address Book**: Save and reuse addresses

## Contributing

When contributing to this component:

1. **Maintain backward compatibility** when possible
2. **Add comprehensive tests** for new features
3. **Update documentation** for API changes
4. **Follow Angular style guide** conventions
5. **Test across different devices** and browsers

## License

This component is part of the IonCursorMedusaShop project and follows the same licensing terms.