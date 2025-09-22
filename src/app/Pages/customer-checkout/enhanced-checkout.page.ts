import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonThumbnail, IonImg, IonNote, IonLabel, IonSpinner, IonList, IonItem } from '@ionic/angular/standalone';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { MedusaCartActions } from 'src/app/store/medusa-cart/medusa-cart.actions';
import { NavigationService } from 'src/app/shared/navigation/navigation.service';
import { ModalController, AlertController } from '@ionic/angular/standalone';
import { CardPaymentModal } from '../../components/card-payment-modal/card-payment-modal';
import { CheckoutActions } from 'src/app/store/checkout/checkout.actions';
import { CheckoutState } from 'src/app/store/checkout/checkout.state';
import { MedusaCartState } from 'src/app/store/medusa-cart/medusa-cart.state';
import { AppFacade, IAppFacadeState } from 'src/app/store/app.facade';
import { CheckoutFormComponent, CheckoutFormData } from '../../components/checkout-form/checkout-form.component';
import { MedusaAddress } from '../../shared/interfaces/medusa-address';
import { RegionsState } from 'src/app/store/regions/regions.state';

@Component({
  selector: 'app-enhanced-checkout',
  templateUrl: './enhanced-checkout.page.html',
  styleUrls: ['./enhanced-checkout.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CheckoutFormComponent,
    IonIcon,
    IonButton,
    IonButtons,
    IonTitle,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonThumbnail,
    IonImg,
    IonNote,
    IonLabel,
    IonContent,
    IonHeader,
    IonToolbar,
    IonSpinner,
    IonList,
    IonItem
  ]
})
export class EnhancedCheckoutPage implements OnDestroy {
  viewState$: Observable<IAppFacadeState>;
  selectedShippingMethod$: Observable<any> = inject(Store).select(CheckoutState.getSelectedShippingMethod);
  secret_key$: Observable<string> = inject(Store).select(CheckoutState.getSecretKey);
  cart$: Observable<any> = inject(Store).select(MedusaCartState.getMedusaCart);

  // Checkout form state
  isCheckoutFormVisible = true;
  isProcessingCheckout = false;
  checkoutError: string | null = null;

  private store: Store;
  private nav: NavigationService;
  private modalController: ModalController;
  private alertController: AlertController;
  private facade: AppFacade;
  private readonly ngUnsubscribe = new Subject<void>();

  private modalOpen = false;

  constructor() {
    this.store = inject(Store);
    this.nav = inject(NavigationService);
    this.modalController = inject(ModalController);
    this.alertController = inject(AlertController);
    this.facade = inject(AppFacade);
    
    this.viewState$ = this.facade.viewState$;
    
    // Initialize checkout data
    this.store.dispatch(new CheckoutActions.GetShippingOptions());
    this.store.dispatch(new CheckoutActions.CreatePaymentProviders());
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // Handle form submission from checkout form component
  async onCheckoutFormSubmit(formData: CheckoutFormData): Promise<void> {
    try {
      this.isProcessingCheckout = true;
      this.checkoutError = null;

      console.log('Processing checkout form data:', formData);

      // Step 1: Update cart with customer and address information
      await this.updateCartWithFormData(formData);

      // Step 2: Process payment
      await this.processPayment(formData);

      // Step 3: Complete checkout
      await this.completeCheckout();

    } catch (error) {
      console.error('Checkout processing failed:', error);
      this.checkoutError = this.getErrorMessage(error);
      await this.showCheckoutError(this.checkoutError);
    } finally {
      this.isProcessingCheckout = false;
    }
  }

  // Handle step changes in the checkout form
  onCheckoutStepChange(step: number): void {
    console.log('Checkout step changed to:', step);
    // You can add additional logic here for step changes
  }
  

  private async updateCartWithFormData(formData: CheckoutFormData): Promise<void> {
    const cart = this.store.selectSnapshot(MedusaCartState.getMedusaCart);
    if (!cart?.id) {
      throw new Error('No active cart found');
    }

    
    // Prepare address data
    const billingAddress: MedusaAddress = {
      first_name: formData.billingAddress.first_name,
      last_name: formData.billingAddress.last_name,
      address_1: formData.billingAddress.address_1,
      address_2: formData.billingAddress.address_2,
      city: formData.billingAddress.city,
      country_code: this.validateCountryCode(formData.billingAddress.country_code),
      postal_code: formData.billingAddress.postal_code,
      phone: formData.billingAddress.phone,
    };

    const shippingAddress: MedusaAddress = {
      first_name: formData.shippingAddress.first_name,
      last_name: formData.shippingAddress.last_name,
      address_1: formData.shippingAddress.address_1,
      address_2: formData.shippingAddress.address_2,
      city: formData.shippingAddress.city,
      country_code: this.validateCountryCode(formData.shippingAddress.country_code),
      postal_code: formData.shippingAddress.postal_code,
      phone: formData.shippingAddress.phone,
    };

    const regionId = this.getRegionIdForCountry(billingAddress.country_code);

    const cartUpdateData = {
      email: formData.customerInfo.email,
      billing_address: billingAddress,
      shipping_address: shippingAddress,
      region_id: regionId,
    };

    console.log('Updating cart with data:', cartUpdateData);

    // Update cart
    await this.store.dispatch(new MedusaCartActions.UpdateMedusaCart(cartUpdateData)).toPromise();
    
    // Refresh shipping options
    this.store.dispatch(new CheckoutActions.GetShippingOptions());
  }

  private async processPayment(formData: CheckoutFormData): Promise<void> {
    // Add shipping method if selected
    if (formData.shippingMethod) {
      await this.store.dispatch(new CheckoutActions.AddShippingMethod(formData.shippingMethod)).toPromise();
    }

    // Set payment session
    if (formData.paymentMethod) {
      await this.store.dispatch(new CheckoutActions.SetPaymentSession(formData.paymentMethod)).toPromise();
    }
  }

  private async completeCheckout(): Promise<void> {
    // Get the secret key for payment processing
    const secretKey = this.store.selectSnapshot(CheckoutState.getSecretKey);
    
    if (secretKey) {
      // Open payment modal
      await this.paymentModal(secretKey);
    } else {
      throw new Error('Payment session not initialized');
    }
  }

  // Payment modal handling
  async paymentModal(secret_key?: string): Promise<void> {
    if (secret_key && !this.modalOpen) {
      this.modalOpen = true;
      
      const modal = await this.modalController.create({
        component: CardPaymentModal,
        componentProps: { secret_key },
        id: "payment-modal",
        backdropDismiss: true,
        showBackdrop: true,
        breakpoints: [0, 0.8, 1],
        initialBreakpoint: 0.8,
      });
      
      modal.onDidDismiss().then(() => {
        console.log('Payment modal dismissed');
        this.modalOpen = false;
        this.store.dispatch(new CheckoutActions.UnSetSecretKey());
      });
      
      await modal.present();
    }
  }

  // Navigation methods
  back(): void {
    this.nav.goBack();
  }

  address(): void {
    this.nav.navigateTo('customer-address');
  }

  // Error handling
  private getErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    if (error?.error?.message) {
      return error.error.message;
    }
    
    return 'An unexpected error occurred during checkout. Please try again.';
  }

  private async showCheckoutError(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Checkout Error',
      message: message,
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        },
        {
          text: 'Try Again',
          handler: () => {
            // Reset form or retry logic
          }
        }
      ]
    });
    
    await alert.present();
  }

  // Utility methods from original checkout page
  private validateCountryCode(countryCode: string): string {
    const validEuropeCountryCodes = [
      'dk', 'fr', 'de', 'it', 'es', 'se', 'gb', 'uk', 'nl', 'be', 'at', 'ch', 
      'pt', 'ie', 'fi', 'no', 'pl', 'cz', 'hu', 'ro', 'bg', 'hr', 'si', 'sk', 
      'ee', 'lv', 'lt', 'mt', 'cy', 'lu', 'gr'
    ];
    
    if (!countryCode) {
      return 'gb';
    }
    
    const normalizedCode = countryCode.toLowerCase().trim();
    
    if (validEuropeCountryCodes.includes(normalizedCode)) {
      return normalizedCode;
    }
    
    const countryCodeMap: { [key: string]: string } = {
      'united kingdom': 'gb', 'uk': 'gb', 'great britain': 'gb', 'england': 'gb',
      'denmark': 'dk', 'france': 'fr', 'germany': 'de', 'italy': 'it', 'spain': 'es',
      'sweden': 'se', 'netherlands': 'nl', 'belgium': 'be', 'austria': 'at',
      'switzerland': 'ch', 'portugal': 'pt', 'ireland': 'ie', 'finland': 'fi',
      'norway': 'no', 'poland': 'pl', 'czech republic': 'cz', 'hungary': 'hu',
      'romania': 'ro', 'bulgaria': 'bg', 'croatia': 'hr', 'slovenia': 'si',
      'slovakia': 'sk', 'estonia': 'ee', 'latvia': 'lv', 'lithuania': 'lt',
      'malta': 'mt', 'cyprus': 'cy', 'luxembourg': 'lu', 'greece': 'gr'
    };
    
    if (countryCodeMap[normalizedCode]) {
      return countryCodeMap[normalizedCode];
    }
    
    return 'gb';
  }

  private getRegionIdForCountry(countryCode: string): string {
    const regionList = this.store.selectSnapshot(RegionsState.getRegionList);
    const defaultRegion = this.store.selectSnapshot(RegionsState.getDefaultRegion);
    
    if (!regionList || regionList.length === 0) {
      return defaultRegion?.region_id || '';
    }
    
    const region = regionList.find(r => r.country.toLowerCase() === countryCode.toLowerCase());
    
    if (region) {
      return region.region_id;
    }
    
    return defaultRegion?.region_id || '';
  }

  // Get initial form data from customer
  getInitialFormData(customer: any): Partial<CheckoutFormData> {
    if (!customer) return {};

    const defaultAddress = customer.addresses?.find((addr: any) => addr.is_default_shipping) || {};
    
    return {
      customerInfo: {
        email: customer.email || '',
        firstName: customer.first_name || '',
        lastName: customer.last_name || '',
        phone: defaultAddress.phone || ''
      },
      shippingAddress: {
        first_name: defaultAddress.first_name || '',
        last_name: defaultAddress.last_name || '',
        address_1: defaultAddress.address_1 || '',
        address_2: defaultAddress.address_2 || '',
        city: defaultAddress.city || '',
        country_code: defaultAddress.country_code || 'gb',
        postal_code: defaultAddress.postal_code || '',
        phone: defaultAddress.phone || ''
      },
      billingAddress: {
        first_name: defaultAddress.first_name || '',
        last_name: defaultAddress.last_name || '',
        address_1: defaultAddress.address_1 || '',
        address_2: defaultAddress.address_2 || '',
        city: defaultAddress.city || '',
        country_code: defaultAddress.country_code || 'gb',
        postal_code: defaultAddress.postal_code || '',
        phone: defaultAddress.phone || ''
      }
    };
  }

  // Image error handling
  onImageError(event: any): void {
    event.target.src = 'assets/img/product/product-1.jpg';
  }
}
