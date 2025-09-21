import { DeliveryPageFormValue } from './delivery-page-form-value.interface';

export const mockDeliveryPageFormValue: DeliveryPageFormValue = {
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
