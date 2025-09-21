import { AddressFormValue } from "./address-form-value.interface";

export interface DeliveryPageFormValue {
  billingAddress: AddressFormValue;
  isShippingSame: boolean;
  shippingAddress?: AddressFormValue;
}
