import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, inject } from '@angular/core';
import { MedusaVariant } from '../../../../shared/interfaces/medusa-variant.interface';
import { Store } from '@ngxs/store';
import { IonButton, IonLabel, IonAccordion, IonButtons, IonItem, IonNote, IonAccordionGroup, IonIcon } from '@ionic/angular/standalone';
import { MedusaCurrency } from '../../../../shared/pipes/medusa-currency/medusa-currency.pipe';
import { ShortNumber } from '../../../../shared/pipes';
import { MedusaCartActions } from '../../../../store/medusa-cart/medusa-cart.actions';
import { WishlistService } from '../../../../shared/services/wishlist.service';
import { MedusaProduct } from '../../../../shared/interfaces/customer-product.interface';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-price-view',
    templateUrl: './price-view.component.html',
    styleUrls: ['./price-view.component.scss'],
    standalone: true,
    imports: [
    IonAccordionGroup,
    IonNote,
    IonButtons,
    IonLabel,
    IonButton,
    IonItem,
    IonIcon,
    CommonModule,
    ShortNumber,
    MedusaCurrency,
    IonAccordion
],
})
export class PriceViewComponent {

    @ViewChild('accordionGroup', { static: true }) accordionGroup!: IonAccordionGroup;

    @Input() variants!: MedusaVariant[];
    @Input() product!: MedusaProduct; // Add product input for wishlist functionality
    @Input() isAccordion: boolean = false;

    private store = inject(Store);
    private wishlistService = inject(WishlistService);
    private readonly ngUnsubscribe = new Subject<void>();

    toggleAccordion() {
        const nativeEl = this.accordionGroup;
        if (nativeEl?.value === 'pricesList') {
            nativeEl!.value = undefined;
        } else {
            nativeEl!.value = 'pricesList';
        }
    };

    addToCart(variant: MedusaVariant) {
        const nativeEl = this.accordionGroup;
        console.log(nativeEl)
        this.store.dispatch(new MedusaCartActions.AddToMedusaCart(variant));
        this.toggleAccordion();
    }

    addToWishlist(variant: MedusaVariant) {
        if (this.product) {
            this.wishlistService.addToWishlist(this.product, variant.id)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe((success) => {
                    if (success) {
                        console.log('Product added to wishlist successfully');
                    }
                });
        }
    }

    isInWishlist(): boolean {
        return this.product ? this.wishlistService.isInWishlist(this.product.id) : false;
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
