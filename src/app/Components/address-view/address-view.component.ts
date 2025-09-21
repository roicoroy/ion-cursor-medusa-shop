import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonItem, IonLabel, IonText, IonButton, IonIcon } from '@ionic/angular/standalone';

export interface Address {
  id?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  country_code?: string;
  postal_code?: string;
  phone?: string;
  company?: string;
  first_name?: string;
  last_name?: string;
}

@Component({
  selector: 'app-address-view',
  templateUrl: './address-view.component.html',
  styleUrls: ['./address-view.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonItem,
    IonLabel,
    IonText,
    IonButton,
    IonIcon
  ]
})
export class AddressViewComponent {
  @Input() address!: Address;
  @Input() showActions: boolean = true;
  @Input() isDefaultBilling: boolean = false;
  @Input() isDefaultShipping: boolean = false;

  onEdit() {
    // Emit edit event or handle edit logic
    console.log('Edit address:', this.address.id);
  }

  onDelete() {
    // Emit delete event or handle delete logic
    console.log('Delete address:', this.address.id);
  }

  onSetDefaultBilling() {
    // Handle set default billing
    console.log('Set default billing:', this.address.id);
  }

  onSetDefaultShipping() {
    // Handle set default shipping
    console.log('Set default shipping:', this.address.id);
  }
} 