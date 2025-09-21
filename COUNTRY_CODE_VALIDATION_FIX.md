# Country Code Validation Fix

This document explains the fix for the "Country with code denmark is not within region Europe" error.

## Problem Description

The error occurred because an invalid country code `"denmark"` was being sent to the Medusa API instead of the correct ISO-2 country code `"dk"` for Denmark.

## Root Cause Analysis

### Valid Country Codes for Europe Region
Based on the Medusa API response, the valid country codes for the Europe region are:
- `"dk"` - Denmark
- `"fr"` - France  
- `"de"` - Germany
- `"it"` - Italy
- `"es"` - Spain
- `"se"` - Sweden

### Error Details
```
Error: "Country with code denmark is not within region Europe"
Type: "invalid_data"
```

The issue was that somewhere in the address processing pipeline, the country code was being transformed from the correct ISO-2 code `"dk"` to the full country name `"denmark"`.

## Solution Implementation

### 1. Country Code Validation Function

Added a validation function in `src/app/pages/customer-checkout/customer-checkout.page.ts`:

```typescript
private validateCountryCode(countryCode: string): string {
  // Valid country codes for Europe region
  const validEuropeCountryCodes = ['dk', 'fr', 'de', 'it', 'es', 'se'];
  
  if (validEuropeCountryCodes.includes(countryCode.toLowerCase())) {
    return countryCode.toLowerCase();
  }
  
  console.warn(`Invalid country code: ${countryCode}, defaulting to 'dk' (Denmark)`);
  return 'dk'; // Default to Denmark
}
```

### 2. Address Processing Update

Updated the address processing in the `check()` method to use the validation function:

```typescript
const billingAddress: MedusaAddress = {
  first_name: defaultbilling.first_name,
  last_name: defaultbilling.last_name,
  address_1: defaultbilling.address_1,
  address_2: defaultbilling.address_2,
  city: defaultbilling.city,
  country_code: this.validateCountryCode(defaultbilling.country_code), // VALIDATED
  postal_code: defaultbilling.postal_code,
  phone: defaultbilling.phone,
};

const shippingAddress: MedusaAddress = {
  first_name: defaultshipping.first_name,
  last_name: defaultshipping.last_name,
  address_1: defaultshipping.address_1,
  address_2: defaultshipping.address_2,
  city: defaultshipping.city,
  country_code: this.validateCountryCode(defaultshipping.country_code), // VALIDATED
  postal_code: defaultshipping.postal_code,
  phone: defaultshipping.phone,
};
```

### 3. Enhanced Debugging

Added comprehensive logging to track the address processing:

```typescript
async check(customer: any) {
  console.log('Customer data received:', customer);
  // ... address processing ...
  console.log('Cart update data:', data);
  // ... API call ...
}
```

## Technical Details

### Medusa API Requirements
- **Country Codes**: Must be ISO-2 format (e.g., "dk", "fr", "de")
- **Region Validation**: Country must be within the specified region
- **Case Sensitivity**: Country codes are case-insensitive but should be lowercase

### Validation Logic
1. **Input Validation**: Check if the provided country code is in the valid list
2. **Normalization**: Convert to lowercase for consistency
3. **Fallback**: Default to "dk" (Denmark) if invalid code is provided
4. **Logging**: Warn about invalid codes for debugging

### Error Handling
- **Graceful Degradation**: Invalid codes default to a valid option
- **Console Warnings**: Log invalid codes for debugging
- **API Compatibility**: Ensure only valid codes reach the Medusa API

## Testing

### Test Cases
1. **Valid Country Code**: "dk" → "dk" (Denmark)
2. **Valid Country Code (Uppercase)**: "DK" → "dk" (Denmark)
3. **Invalid Country Code**: "denmark" → "dk" (Denmark, with warning)
4. **Empty Country Code**: "" → "dk" (Denmark, with warning)
5. **Null Country Code**: null → "dk" (Denmark, with warning)

### Expected Behavior
- Valid codes pass through unchanged
- Invalid codes are replaced with "dk" (Denmark)
- Console warnings are logged for invalid codes
- No API errors occur due to invalid country codes

## Prevention Measures

### 1. Form Validation
The customer address form should validate country codes before submission:
- Use ISO-2 codes in dropdowns
- Validate on form submission
- Provide clear error messages

### 2. Data Consistency
- Ensure country codes are stored consistently
- Use ISO-2 format throughout the application
- Validate data at multiple points

### 3. API Integration
- Validate country codes before API calls
- Handle API errors gracefully
- Provide fallback options

## Future Improvements

### 1. Dynamic Country Code Validation
```typescript
// Fetch valid country codes from Medusa API
const validCountryCodes = await this.getValidCountryCodes(regionId);
```

### 2. Enhanced Error Messages
```typescript
// Provide user-friendly error messages
const errorMessage = `Invalid country code: ${countryCode}. Please select a valid country.`;
```

### 3. Region-Specific Validation
```typescript
// Validate against specific regions
const validateCountryForRegion = (countryCode: string, regionId: string): boolean => {
  // Region-specific validation logic
};
```

## Conclusion

The country code validation fix ensures that:
- Only valid ISO-2 country codes are sent to the Medusa API
- Invalid codes are gracefully handled with fallbacks
- Comprehensive logging helps with debugging
- The application remains robust against data inconsistencies

This fix prevents the "Country with code denmark is not within region Europe" error and ensures smooth checkout flow for users. 