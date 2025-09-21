import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonThumbnail, IonImg, IonLabel, IonNote, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { NavigationService } from 'src/app/shared/navigation/navigation.service';
import { CheckoutActions } from 'src/app/store/checkout/checkout.actions';
import { CheckoutState } from 'src/app/store/checkout/checkout.state';
import { MedusaCartState } from 'src/app/store/medusa-cart/medusa-cart.state';
import { AppFacade, IAppFacadeState } from 'src/app/store/app.facade';

@Component({
  selector: 'app-review-step',
  templateUrl: './review-step.component.html',
  styleUrls: ['./review-step.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonThumbnail,
    IonImg,
    IonLabel,
    IonNote,
    IonButton,
    IonButtons,
    IonIcon,
  ]
})
export class ReviewStepComponent implements OnDestroy {

  viewState$: Observable<IAppFacadeState>;
  selectedShippingMethod$: Observable<any> = inject(Store).select(CheckoutState.getSelectedShippingMethod);
  secret_key$: Observable<string> = inject(Store).select(CheckoutState.getSecretKey);

  private store = inject(Store);
  private nav = inject(NavigationService);
  private facade = inject(AppFacade);
  private readonly ngUnsubscribe = new Subject<void>();

  constructor() {
    this.viewState$ = this.facade.viewState$;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onImageError(event: any) {
    // Fallback to a default product image
    event.target.src = 'assets/img/product/product-1.jpg';
  }

  placeOrder() {
    this.store.dispatch(new CheckoutActions.CreateOrder());
    // Optionally navigate to an order confirmation page
    this.nav.navigateTo('/customer-orders');
  }

  goBack() {
    this.nav.navigateTo('/customer-checkout/payment');
  }
}
