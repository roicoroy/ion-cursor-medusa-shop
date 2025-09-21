import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { IonRadio, IonItem, IonRadioGroup, IonLabel, IonNote, IonText, IonIcon } from '@ionic/angular/standalone';
import { CheckoutActions } from 'src/app/store/checkout/checkout.actions';
import { CheckoutState } from 'src/app/store/checkout/checkout.state';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MedusaCartState } from 'src/app/store/medusa-cart/medusa-cart.state';


@Component({
    selector: 'app-shipping-options',
    templateUrl: './shipping-options.component.html',
    standalone: true,
    imports: [
    IonNote, 
    IonLabel,
    IonRadioGroup,
    IonItem,
    IonRadio,
    IonText,
    IonIcon,
    CommonModule
  ],
})
export class ShippingOptionsComponent implements OnInit, OnDestroy {

    shipping_options$: Observable<any[]> = inject(Store).select(CheckoutState.getShippingOptions);    
    selected_shipping_method$: Observable<any> = inject(Store).select(CheckoutState.getSelectedShippingMethod);
    currencyCode?: string;
    private store = inject(Store);
    private readonly ngUnsubscribe = new Subject<void>();

    ngOnInit(): void {
        this.currencyCode = this.store.selectSnapshot(MedusaCartState.getMedusaCart)?.currency_code;
        // Initialize shipping options
        this.store.dispatch(new CheckoutActions.GetShippingOptions());
        
        // Debug: Log shipping options
        this.shipping_options$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(options => {
            console.log('Shipping Options loaded:', options);
        });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    selectShippingOption($event: any) {
        console.log('selectShippingOption', $event.detail.value);
        const selectedOption = $event.detail.value;
        if (selectedOption && selectedOption.id) {
            // Add shipping method to cart
            this.store.dispatch(new CheckoutActions.AddShippingMethod(selectedOption.id));
            
            // Create payment providers after shipping method is selected
            console.log('Creating payment providers after shipping selection...');
            console.log('Dispatching CreatePaymentProviders action...');
            this.store.dispatch(new CheckoutActions.CreatePaymentProviders());
            
            // Debug: Check state after dispatch
            setTimeout(() => {
                const currentState = this.store.selectSnapshot(CheckoutState.getPaymentProviders);
                console.log('Payment providers state after dispatch:', currentState);
            }, 1000);
        }
    }
} 