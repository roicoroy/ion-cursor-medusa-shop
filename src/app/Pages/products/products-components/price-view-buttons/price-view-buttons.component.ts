import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MedusaVariant } from 'src/app/shared/interfaces/medusa-variant.interface';
import { Store } from '@ngxs/store';
import { MedusaCurrency } from 'src/app/shared/pipes/medusa-currency/medusa-currency.pipe';
import { ShortNumber } from 'src/app/shared/pipes';
import { MedusaCartActions } from 'src/app/store/medusa-cart/medusa-cart.actions';

@Component({
    selector: 'app-price-view-buttons',
    templateUrl: './price-view-buttons.component.html',
    styleUrls: ['./price-view-buttons.component.scss'],
    standalone: true,
    imports: [
    CommonModule,
    ShortNumber,
    MedusaCurrency
],
})
export class PriceViewButtonsComponent {

    @Input() variants!: MedusaVariant[];
    
    private store = inject(Store);

    addToCartButton(variant: MedusaVariant) {
        this.store.dispatch(new MedusaCartActions.AddToMedusaCart(variant));
    }
}
