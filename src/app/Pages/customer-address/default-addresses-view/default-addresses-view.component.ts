import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonGrid, IonCardContent, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';
import { AddressViewComponent } from "../../../components/address-view/address-view.component";
import { MedusaCustomer } from 'src/app/shared/interfaces/customer-product.interface';
import { MedusaAddress } from '../../../shared/interfaces/medusa-address';

@Component({
    selector: 'app-default-addresses-view',
    templateUrl: './default-addresses-view.component.html',
    styleUrls: ['./default-addresses-view.component.scss'],
    standalone: true,
    imports: [
        IonCardTitle,
        IonCardHeader,
        IonCard,
        IonCol,
        IonRow,
        IonCardContent,
        IonGrid,
        CommonModule,
        AddressViewComponent],
})
export class DefaultAddressesViewComponent {
    @Input() customer!: MedusaCustomer | null;

    get billingAddress(): MedusaAddress | undefined {
        if (!this.customer || !this.customer.billing_address_id || !this.customer.addresses) {
            return undefined;
        }
        return this.customer.addresses.find(addr => addr.id === this.customer?.billing_address_id);
    }
}
