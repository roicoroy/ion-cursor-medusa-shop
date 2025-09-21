import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, ViewChild, inject } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { NgxStripeModule, StripePaymentElementComponent, StripeService } from 'ngx-stripe';
import { lastValueFrom, Subject } from 'rxjs';
import { MedusaCartActions } from 'src/app/store/medusa-cart/medusa-cart.actions';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { Store } from '@ngxs/store';
import { PaymentIntentResult } from '@stripe/stripe-js';
import { CheckoutActions } from 'src/app/store/checkout/checkout.actions';

@Component({
    selector: 'card-payment-modal',
    standalone: true,
    imports: [
        IonicModule,
        CommonModule,
        NgxStripeModule,
    ],
    templateUrl: './card-payment-modal.html',
    styleUrls: ['./card-payment-modal.scss'],
})
export class CardPaymentModal implements OnDestroy {

    @ViewChild(StripePaymentElementComponent) paymentElement!: StripePaymentElementComponent;

    @Input() secret_key: string = '';

    private modalController = inject(ModalController);
    private stripeService = inject(StripeService);
    private router = inject(Router);
    private alert = inject(AlertService);
    private store = inject(Store);
    private readonly ngUnsubscribe = new Subject();

    async confirmPayment() {
        try {
            // Validate that we have the required elements
            if (!this.paymentElement?.elements) {
                console.error('Payment element not available');
                this.alert.presentSimpleAlertNavigate(
                    'Payment form not ready. Please try again.', 
                    '/tabs/cart'
                );
                await this.closeModal();
                return;
            }

            const result: PaymentIntentResult = await lastValueFrom(this.stripeService.confirmPayment({
                elements: this.paymentElement.elements,
                redirect: 'if_required'
            }));
            
            if (result.error) {
                console.error('Payment confirmation error:', result.error);
                
                // Clear the payment session on error to allow retry
                this.store.dispatch(new CheckoutActions.UnSetSecretKey());
                
                // Check if it's a payment intent state error
                if (result.error.code === 'payment_intent_unexpected_state') {
                    this.alert.presentSimpleAlertNavigate(
                        'Payment session expired. Please try again with a fresh payment session.', 
                        '/tabs/cart'
                    );
                } else {
                    this.alert.presentSimpleAlertNavigate(
                        `Payment error: ${result.error.message}`, 
                        '/tabs/cart'
                    );
                }
                
                await this.closeModal();
            } else {
                console.log('Payment confirmed successfully:', result);
                const vs: any = await lastValueFrom(this.store.dispatch(new MedusaCartActions.CompleteCart()));
                if (vs.medusaCart.completed_order_id) {
                    await this.closeModal();
                    await this.router.navigate(
                        ['/order-review'],
                        { queryParams: { orderId: JSON.stringify(vs.medusaCart.completed_order_id), payment: true } }
                    );
                }
            }
        } catch (error) {
            console.error('Error during payment confirmation:', error);
            
            // Clear the payment session on any error
            this.store.dispatch(new CheckoutActions.UnSetSecretKey());
            
            this.alert.presentSimpleAlertNavigate(
                'An unexpected error occurred during payment. Please try again.', 
                '/tabs/cart'
            );
            
            await this.closeModal();
        }
    }

    async closeModal() {
        try {
            // Clear the payment session when modal is closed
            this.store.dispatch(new CheckoutActions.UnSetSecretKey());
            this.store.dispatch(new MedusaCartActions.LogOut());
            await this.modalController.dismiss();
        } catch (error) {
            console.error('Error dismissing modal:', error);
            // Force dismiss if normal dismiss fails
            await this.modalController.dismiss(null, 'cancel');
        }
    }

    async handleBackdropDismiss() {
        await this.closeModal();
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
}
