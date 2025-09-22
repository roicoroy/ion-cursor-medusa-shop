import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonGrid, IonCardContent, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';
import { AddressViewComponent } from "../../../components/address-view/address-view.component";
import { MedusaCustomer } from 'src/app/shared/interfaces/customer-product.interface';

@Component({
    selector: 'app-default-addresses-view',
    templateUrl: './default-addresses-view.component.html',
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
}
