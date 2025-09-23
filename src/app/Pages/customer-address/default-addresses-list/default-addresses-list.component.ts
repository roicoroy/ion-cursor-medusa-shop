import { CommonModule } from '@angular/common';
import { Component, Input, inject, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngxs/store';
import { IonButton, IonCardContent, IonCard, IonIcon } from '@ionic/angular/standalone';
import { AddressViewComponent } from "../../../components/address-view/address-view.component";
import { Router } from '@angular/router';
import { AuthActions } from 'src/app/store/auth/auth.actions';
import { MedusaCustomer } from 'src/app/shared/interfaces/customer-product.interface';

@Component({
    selector: 'app-default-addresses-list',
    templateUrl: './default-addresses-list.component.html',
    styleUrls: ['./default-addresses-list.component.scss'],
    standalone: true,
    imports: [IonCard, IonCardContent,
    IonButton,
    IonIcon,
    CommonModule,
    AddressViewComponent],
})
export class DefaultAddressesListComponent implements OnChanges {

    @Input() customer!: MedusaCustomer | null;

    // Local copy of addresses to maintain order
    localAddresses: any[] = [];

    private router = inject(Router);
    private store = inject(Store);

    ngOnChanges(changes: SimpleChanges) {
        if (changes['customer'] && this.customer?.addresses) {
            // Only update local addresses if the structure changed (new/deleted addresses)
            // but preserve the order for existing addresses
            if (this.localAddresses.length !== this.customer.addresses.length) {
                this.localAddresses = [...this.customer.addresses];
            } else {
                // Update existing addresses in place to preserve order
                this.customer.addresses.forEach(updatedAddress => {
                    const localIndex = this.localAddresses.findIndex(addr => addr.id === updatedAddress.id);
                    if (localIndex !== -1) {
                        // Update the properties but keep the same position
                        this.localAddresses[localIndex] = { ...this.localAddresses[localIndex], ...updatedAddress };
                    }
                });
            }
        }
    }

    // TrackBy function to prevent list reordering
    trackByAddressId(index: number, address: any): any {
        return address.id || index;
    }

    // Set default billing address
    isDefaultBilling(currentValue: boolean | undefined, addressId: string) {
        if (!addressId) return;

        // Only dispatch if we're setting it as default (not unsetting)
        if (!currentValue) {
            // Immediately update local state for instant visual feedback
            this.updateLocalAddressBilling(addressId, true);

            // Then dispatch the action
            this.store.dispatch(new AuthActions.SetDefaultCustomerBillingAddress(addressId, true));
        }
    }

    // Set default shipping address
    isDefaultShipping(currentValue: boolean | undefined, addressId: string) {
        if (!addressId) return;

        // Only dispatch if we're setting it as default (not unsetting)
        if (!currentValue) {
            // Immediately update local state for instant visual feedback
            this.updateLocalAddressShipping(addressId, true);

            // Then dispatch the action
            this.store.dispatch(new AuthActions.SetDefaultCustomerShippingAddress(addressId, true));
        }
    }

    // Helper method to update local billing state
    private updateLocalAddressBilling(addressId: string, isDefault: boolean) {
        this.localAddresses.forEach(address => {
            if (address.id === addressId) {
                address.is_default_billing = isDefault;
            } else if (isDefault) {
                // Remove default from other addresses
                address.is_default_billing = false;
            }
        });
    }

    // Helper method to update local shipping state
    private updateLocalAddressShipping(addressId: string, isDefault: boolean) {
        this.localAddresses.forEach(address => {
            if (address.id === addressId) {
                address.is_default_shipping = isDefault;
            } else if (isDefault) {
                // Remove default from other addresses
                address.is_default_shipping = false;
            }
        });
    }
    //
    addNewAddress() {
        // console.log('㊗️ add');
        const isEdit = false;
        const url = `add-address`;
        this.router.navigateByUrl(url);
    }
    editAddress(address: any) {
        const isEdit = true;
        const url = `manage-address?addressId=${address.id}`;
        this.router.navigateByUrl(url);
    }
    deleteAddress(addressId: string) {
        this.store.dispatch(new AuthActions.DeleteCustomerAddress(addressId));
    }
}
