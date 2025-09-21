import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { lastValueFrom, Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { MedusaCartActions } from 'src/app/store/medusa-cart/medusa-cart.actions';
import { NavigationService } from 'src/app/shared/navigation/navigation.service';
import { AlertController } from '@ionic/angular/standalone';
import { CheckoutActions } from 'src/app/store/checkout/checkout.actions';
import { MedusaCartState } from 'src/app/store/medusa-cart/medusa-cart.state';
import { AppFacade, IAppFacadeState } from 'src/app/store/app.facade';
import { DefaultAddressesViewComponent } from "../../customer-address/default-addresses-view/default-addresses-view.component";
import { MedusaAddress } from 'src/app/shared/interfaces/medusa-address';
import { RegionsState } from 'src/app/store/regions/regions.state';

@Component({
  selector: 'app-address-step',
  templateUrl: './address-step.component.html',
  styleUrls: ['./address-step.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    DefaultAddressesViewComponent,
  ]
})
export class AddressStepComponent implements OnDestroy {

  viewState$: Observable<IAppFacadeState>;

  private store = inject(Store);
  private nav = inject(NavigationService);
  private alertController = inject(AlertController);
  private facade = inject(AppFacade);
  private readonly ngUnsubscribe = new Subject<void>();

  constructor() {
    this.viewState$ = this.facade.viewState$;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async check(customer: any) {
    const cart = this.store.selectSnapshot(MedusaCartState.getMedusaCart);
    // Check if the cart has a shipping address
    if (!cart?.shipping_address) {
      console.log('Cart does not have a shipping address, updating with customer defaults.');
      const validationResult = this.validateDefaultAddresses(customer);
      if (!validationResult.isValid) {
        await this.showAddressValidationAlert(validationResult.missingAddresses);
        return;
      }
      let defaultbilling: MedusaAddress = {} as MedusaAddress;
      let defaultshipping: MedusaAddress = {} as MedusaAddress;
      for (let index = 0; index < customer.addresses.length; index++) {
        const element = customer.addresses[index];
        console.log('Address element:', element);
        if (element.is_default_billing) {
          defaultbilling = element;
        }
        if (element.is_default_shipping) {
          defaultshipping = element;
        }
      }
      const billingValidation = this.validateAddressFields(defaultbilling, 'billing');
      const shippingValidation = this.validateAddressFields(defaultshipping, 'shipping');
      if (!billingValidation.isValid || !shippingValidation.isValid) {
        const missingFields = [...billingValidation.missingFields, ...shippingValidation.missingFields];
        await this.showAddressFieldsAlert(missingFields);
        return;
      }
      const billingAddress: MedusaAddress = {
        first_name: defaultbilling.first_name,
        last_name: defaultbilling.last_name,
        address_1: defaultbilling.address_1,
        address_2: defaultbilling.address_2,
        city: defaultbilling.city,
        country_code: this.validateCountryCode(defaultbilling.country_code),
        postal_code: defaultbilling.postal_code,
        phone: defaultbilling.phone,
      };
      const shippingAddress: MedusaAddress = {
        first_name: defaultshipping.first_name,
        last_name: defaultshipping.last_name,
        address_1: defaultshipping.address_1,
        address_2: defaultshipping.address_2,
        city: defaultshipping.city,
        country_code: this.validateCountryCode(defaultshipping.country_code),
        postal_code: defaultshipping.postal_code,
        phone: defaultshipping.phone,
      };
      const regionId = this.getRegionIdForCountry(billingAddress.country_code);
      console.log(`Country code: ${billingAddress.country_code}, Region ID: ${regionId}`);
      const data = {
        email: customer.email,
        billing_address: billingAddress,
        shipping_address: shippingAddress,
        region_id: regionId,
      }
      console.log('Cart update data:', data);
      if (data) {
        try {
          const res = await lastValueFrom(this.store.dispatch(new MedusaCartActions.UpdateMedusaCart(data)));
          this.store.dispatch(new CheckoutActions.GetShippingOptions());
        } catch (error) {
          console.error('Error updating cart with address:', error);
        }
      }
    } else {
      console.log('Cart already has a shipping address.');
      this.store.dispatch(new CheckoutActions.GetShippingOptions());
    }
  }

  address() {
    this.nav.navigateTo('customer-address');
  }

  private validateDefaultAddresses(customer: any): { isValid: boolean; missingAddresses: string[] } {
    const missingAddresses: string[] = [];

    if (!customer.addresses || customer.addresses.length === 0) {
      missingAddresses.push('billing address', 'shipping address');
      return { isValid: false, missingAddresses };
    }

    const hasDefaultBilling = customer.addresses.some((addr: any) => addr.is_default_billing === true);
    const hasDefaultShipping = customer.addresses.some((addr: any) => addr.is_default_shipping === true);

    if (!hasDefaultBilling) {
      missingAddresses.push('default billing address');
    }

    if (!hasDefaultShipping) {
      missingAddresses.push('default shipping address');
    }

    return {
      isValid: missingAddresses.length === 0,
      missingAddresses
    };
  }

  private validateAddressFields(address: any, type: string): { isValid: boolean; missingFields: string[] } {
    const missingFields: string[] = [];
    const requiredFields = ['first_name', 'last_name', 'address_1', 'city', 'country_code', 'postal_code', 'phone'];

    requiredFields.forEach(field => {
      if (!address[field] || address[field].trim() === '') {
        missingFields.push(`${type} ${field.replace('_', ' ')}`);
      }
    });

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }

  private async showAddressValidationAlert(missingAddresses: string[]): Promise<void> {
    const missingList = missingAddresses.join(' and ');

    const alert = await this.alertController.create({
      header: 'Address Required',
      message: `Please set up your ${missingList} before proceeding with checkout.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Manage Addresses',
          handler: () => {
            this.nav.navigateTo('customer-address');
          }
        }
      ]
    });

    await alert.present();
  }

  private async showAddressFieldsAlert(missingFields: string[]): Promise<void> {
    const missingList = missingFields.join(', ');

    const alert = await this.alertController.create({
      header: 'Incomplete Address',
      message: `Please complete the following fields in your addresses: ${missingList}`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Edit Addresses',
          handler: () => {
            this.nav.navigateTo('customer-address');
          }
        }
      ]
    });

    await alert.present();
  }

  private getRegionIdForCountry(countryCode: string): string {
    const regionList = this.store.selectSnapshot(RegionsState.getRegionList);
    const defaultRegion = this.store.selectSnapshot(RegionsState.getDefaultRegion);

    console.log('Available regions:', regionList);
    console.log('Default region:', defaultRegion);

    if (!regionList || regionList.length === 0) {
      console.warn('No regions available, using default region');
      return defaultRegion?.region_id || '';
    }

    // Find the region for the given country code
    const region = regionList.find(r => r.country.toLowerCase() === countryCode.toLowerCase());

    if (region) {
      console.log(`Found region for country ${countryCode}:`, region);
      return region.region_id;
    }

    console.warn(`No region found for country code: ${countryCode}, using default region`);
    return defaultRegion?.region_id || '';
  }

  private validateCountryCode(countryCode: string): string {
    // Valid country codes for Europe region (expanded list)
    const validEuropeCountryCodes = [
      'dk', 'fr', 'de', 'it', 'es', 'se', 'gb', 'uk', 'nl', 'be', 'at', 'ch',
      'pt', 'ie', 'fi', 'no', 'pl', 'cz', 'hu', 'ro', 'bg', 'hr', 'si', 'sk',
      'ee', 'lv', 'lt', 'mt', 'cy', 'lu', 'gr'
    ];

    if (!countryCode) {
      console.warn('No country code provided, defaulting to "gb" (United Kingdom)');
      return 'gb';
    }

    const normalizedCode = countryCode.toLowerCase().trim();

    if (validEuropeCountryCodes.includes(normalizedCode)) {
      return normalizedCode;
    }

    // Handle common variations
    const countryCodeMap: { [key: string]: string } = {
      'united kingdom': 'gb',
      'uk': 'gb',
      'great britain': 'gb',
      'england': 'gb',
      'denmark': 'dk',
      'france': 'fr',
      'germany': 'de',
      'italy': 'it',
      'spain': 'es',
      'sweden': 'se',
      'netherlands': 'nl',
      'belgium': 'be',
      'austria': 'at',
      'switzerland': 'ch',
      'portugal': 'pt',
      'ireland': 'ie',
      'finland': 'fi',
      'norway': 'no',
      'poland': 'pl',
      'czech republic': 'cz',
      'hungary': 'hu',
      'romania': 'ro',
      'bulgaria': 'bg',
      'croatia': 'hr',
      'slovenia': 'si',
      'slovakia': 'sk',
      'estonia': 'ee',
      'latvia': 'lv',
      'lithuania': 'lt',
      'malta': 'mt',
      'cyprus': 'cy',
      'luxembourg': 'lu',
      'greece': 'gr'
    };

    if (countryCodeMap[normalizedCode]) {
      return countryCodeMap[normalizedCode];
    }

    console.warn(`Unsupported country code: ${countryCode}, defaulting to "gb" (United Kingdom)`);
    return 'gb'; // Default to United Kingdom instead of Denmark
  }
}
