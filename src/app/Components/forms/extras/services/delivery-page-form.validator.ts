import { FormGroup } from '@angular/forms';

import { DeliveryPageFormValue } from '../models/delivery-page-form-value.interface';

export function deliveryPageFromValidator(deliveryPageFrom: FormGroup): { [key: string]: any } | null {
  const formValue: DeliveryPageFormValue = deliveryPageFrom.value;
  return deliveryPageFromValueValidator(formValue);
}

export function deliveryPageFromValueValidator(deliveryPageFromValue: DeliveryPageFormValue): { [key: string]: any } | null {
  const errors: any = {};
  if (!deliveryPageFromValue.isShippingSame && !deliveryPageFromValue.shippingAddress) {
    errors['shippingAddress'] = true;
  }
  return Object.keys(errors).length ? errors : null;
}
