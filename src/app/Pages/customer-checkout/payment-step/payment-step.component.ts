import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { NavigationService } from 'src/app/shared/navigation/navigation.service';
import { ModalController } from '@ionic/angular/standalone';
import { CardPaymentModal } from '../../Components/card-payment-modal/card-payment-modal';
import { CheckoutActions } from 'src/app/store/checkout/checkout.actions';
import { CheckoutState } from 'src/app/store/checkout/checkout.state';
import { MedusaCartState } from 'src/app/store/medusa-cart/medusa-cart.state';
import { PaymentProvidersComponent } from "../../Components/payment-providers/payment-providers.component";

@Component({
  selector: 'app-payment-step',
  templateUrl: './payment-step.component.html',
  styleUrls: ['./payment-step.component.scss'],
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
    IonButtons,
    IonIcon,
    PaymentProvidersComponent,
  ]
})
export class PaymentStepComponent implements OnDestroy {

  secret_key$: Observable<string> = inject(Store).select(CheckoutState.getSecretKey);

  private store = inject(Store);
  private nav = inject(NavigationService);
  private modalController = inject(ModalController);
  private readonly ngUnsubscribe = new Subject<void>();

  private modalOpen = false; // Track if modal is already open

  constructor() {
    // // Subscribe to secret key changes to open payment modal with debounce
    // this.secret_key$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(secretKey => {
    //   if (secretKey && !this.modalOpen) {
    //     console.log('Secret key received in checkout page, opening payment modal:', secretKey);
    //     this.modalOpen = true; // Prevent multiple modals
    //     this.paymentModal(secretKey);
    //   }p
    // });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async paymentModal(secret_key?: string) {
    if (secret_key != null) {
      this.modalOpen = true; // Set flag before creating modal
      
      const modal = await this.modalController.create({
        component: CardPaymentModal,
        componentProps: { secret_key },
        id: "payment-modal",
        backdropDismiss: true,
        showBackdrop: true,
        breakpoints: [0, 0.8, 1],
        initialBreakpoint: 0.8,
      });
      
      // Handle modal dismissal
      modal.onDidDismiss().then(() => {
        console.log('Payment modal dismissed');
        this.modalOpen = false; // Reset flag when modal is dismissed
        
        // Clear any existing payment session to ensure fresh session on next attempt
        this.store.dispatch(new CheckoutActions.UnSetSecretKey());
      });
      
      await modal.present();
    }
  }

  testPaymentProviders() {
    console.log('=== DEBUGGING PAYMENT PROVIDERS ===');
    console.log('Current cart:', this.store.selectSnapshot(MedusaCartState.getMedusaCart));
    console.log('Current payment providers state:', this.store.selectSnapshot(CheckoutState.getPaymentProviders));
    console.log('Selected shipping method:', this.store.selectSnapshot(CheckoutState.getSelectedShippingMethod));
    console.log('Shipping options:', this.store.selectSnapshot(CheckoutState.getShippingOptions));
    
    // Clear any existing client secret to allow retry
    this.store.dispatch(new CheckoutActions.UnSetSecretKey());
    this.modalOpen = false; // Reset modal state
    
    // Manually dispatch the action
    this.store.dispatch(new CheckoutActions.CreatePaymentProviders());
    
    // Check state after dispatch
    setTimeout(() => {
      const updatedState = this.store.selectSnapshot(CheckoutState.getPaymentProviders);
      const selectedShipping = this.store.selectSnapshot(CheckoutState.getSelectedShippingMethod);
      console.log('Payment providers state after manual dispatch:', updatedState);
      console.log('Selected shipping method after dispatch:', selectedShipping);
    }, 2000);
  }

  goToReview() {
    this.nav.navigateTo('/customer-checkout/review');
  }

  goBack() {
    this.nav.navigateTo('/customer-checkout/shipping');
  }
}
