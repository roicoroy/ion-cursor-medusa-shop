import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { IonRadio, IonItem, IonRadioGroup, IonLabel, IonNote, IonText } from '@ionic/angular/standalone';
import { CheckoutActions } from 'src/app/store/checkout/checkout.actions';
import { CheckoutState } from 'src/app/store/checkout/checkout.state';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MedusaCartState } from 'src/app/store/medusa-cart/medusa-cart.state';


@Component({
    selector: 'app-payment-providers',
    templateUrl: './payment-providers.component.html',
    standalone: true,
    imports: [IonNote, IonLabel,
    IonRadioGroup,
    IonItem,
    IonRadio,
    IonText,
    CommonModule],
})
export class PaymentProvidersComponent implements OnInit, OnDestroy {

    payment_providers$: Observable<any[]> = inject(Store).select(CheckoutState.getPaymentProviders);
    secret_key$: Observable<string> = inject(Store).select(CheckoutState.getSecretKey);
    currencyCode?: string;
    private store = inject(Store);
    private readonly ngUnsubscribe = new Subject<void>();

    ngOnInit(): void {
        this.currencyCode = this.store.selectSnapshot(MedusaCartState.getMedusaCart)?.currency_code;
        
        // Debug: Log payment providers
        this.payment_providers$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(providers => {
            console.log('Payment Providers loaded:', providers);
            console.log('Payment Providers length:', providers?.length);
            console.log('Payment Providers type:', typeof providers);
        });
        
        // Debug: Check current state
        const currentState = this.store.selectSnapshot(CheckoutState.getPaymentProviders);
        console.log('Current payment providers state:', currentState);
        
        // Note: Payment modal opening is now handled by the parent component (customer-checkout page)
        // to prevent multiple modals from being opened simultaneously
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    createPaymentProviders($event: any) {
        console.log('createPaymentProviders', $event.detail.value);
        const selectedProvider = $event.detail.value;
        if (selectedProvider && selectedProvider.id) {
            console.log('Setting payment session for provider:', selectedProvider.id);
            this.store.dispatch(new CheckoutActions.SetPaymentSession(selectedProvider.id));
        }
    }


}
