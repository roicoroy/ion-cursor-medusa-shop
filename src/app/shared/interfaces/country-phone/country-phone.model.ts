import { getExampleNumber, NumberFormat, PhoneNumberType } from 'libphonenumber-js';

export class CountryPhone {
  iso: string;
  name: string;
  code: string;
  sample_phone: string;

  constructor (iso: string, name: string) {
    this.iso = iso;
    this.name = name;

    const exampleNumber = getExampleNumber(this.iso as any, PhoneNumberType.MOBILE);

    if (exampleNumber) {
      this.sample_phone = exampleNumber.format(NumberFormat.NATIONAL);
      this.code = '+' + exampleNumber.countryCallingCode;
    } else {
      this.sample_phone = '';
      this.code = '';
    }
  }
}