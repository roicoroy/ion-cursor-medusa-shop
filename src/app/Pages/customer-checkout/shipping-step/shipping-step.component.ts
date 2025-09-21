import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonButtons } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { CheckoutActions } from 'src/app/store/checkout/checkout.actions';
import { CheckoutState } from 'src/app/store/checkout/checkout.state';
import { ShippingOptionsComponent } from "../../../Components/shipping-options/shipping-options.component";
import { NavigationService } from 'src/app/shared/navigation/navigation.service';

@Component({
  selector: 'app-shipping-step',
  templateUrl: './shipping-step.component.html',
  styleUrls: ['./shipping-step.component.scss'],
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
    IonButton,
    IonButtons,
    ShippingOptionsComponent,
  ]
})
export class ShippingStepComponent implements OnInit {

  selectedShippingMethod$: Observable<any> = inject(Store).select(CheckoutState.getSelectedShippingMethod);
  shippingOption: any;

  private store = inject(Store);
  private nav = inject(NavigationService);

  constructor() { }

  ngOnInit(): void {
    this.store.dispatch(new CheckoutActions.GetShippingOptions());
  }

  goToPayment() {
    this.nav.navigateTo('/customer-checkout/payment');
  }

  goBack() {
    this.nav.navigateTo('/customer-checkout/address');
  }
}
