import { mockDeliveryPageFormValue } from '../models/delivery-page-form-value.mock';
import { deliveryPageFromValueValidator } from './delivery-page-form.validator';

describe('Delivery Page Form Validator', () => {
  it('should return null if form is valid', () => {
    const actual = deliveryPageFromValueValidator(mockDeliveryPageFormValue);
    const expected: any = null;
    expect(actual).toEqual(expected);
  });

  it('should return shippingAddress if shipping address is not same and shipping address is missing', () => {
    const invalidForm = {
      billingAddress: {
        first_name: 'Joe',
        last_name: 'Doe',
        address_1: 'address line 1',
        address_2: '',
        region_code: '',
        country_code: 'gb',
        city: 'Edinbrugh',
        postal_code: 'eh64uh',
        phone: '123',
      },
      isShippingSame: true,
      shippingAddress: {
        first_name: 'Joe',
        last_name: 'Doe',
        address_1: 'address line 1',
        address_2: '',
        region_code: '',
        country_code: 'gb',
        city: 'Edinbrugh',
        postal_code: 'eh64uh',
        phone: '123',
      },
    };
    const actual = deliveryPageFromValueValidator(invalidForm);
    const expected = { shippingAddress: true };
    expect(actual).toEqual(expected);
  });
});
