export interface AddressFormValue {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  region_code: string;
  country_code: string;
  city: string;
  postal_code: string;
  phone: string;
}

export function addressFormValueToHTML(addressFormValue: AddressFormValue): string {
  if (!addressFormValue) {
    return '';
  }
  return (
    addressFormValue.first_name +
    ' ' +
    addressFormValue.last_name +
    '<br>' +
    addressFormValue.address_1 +
    ' ' +
    addressFormValue.address_2 +
    '<br>' +
    addressFormValue.region_code +
    ', ' +
    addressFormValue.country_code +
    ', ' +
    addressFormValue.city +
    '<br>' +
    addressFormValue.postal_code +
    '<br>' +
    addressFormValue.phone
  );
}
