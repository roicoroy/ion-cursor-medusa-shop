import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonList, IonItem, IonLabel, IonIcon, IonBadge, IonBackButton } from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IAppFacadeState, AppFacade } from '../../store/app.facade';
import { AuthActions } from '../../store/auth/auth.actions';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { AlertService } from '../../shared/alert/alert.service';

@Component({
  selector: 'app-address-management',
  templateUrl: './address-management.component.html',
  styleUrls: ['./address-management.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonBadge,
    IonBackButton
  ]
})
export class AddressManagementComponent implements OnInit, OnDestroy {
  viewState$: Observable<IAppFacadeState>;
  customer: MedusaCustomer | null = null;

  private store = inject(Store);
  private nav = inject(NavigationService);
  private alert = inject(AlertService);
  private facade = inject(AppFacade);
  private readonly ngUnsubscribe = new Subject();

  constructor() {
    this.viewState$ = this.facade.viewState$;
  }

  ngOnInit(): void {
    this.viewState$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(vs => {
      this.customer = vs.customer;
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  addNewAddress(): void {
    this.nav.navigateTo('add-address');
  }

  editAddress(addressId: string): void {
    this.nav.navigateTo(`details-customer-address?addressId=${addressId}`);
  }

  deleteAddress(addressId: string): void {
    this.alert.presentConfirmAlert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      () => {
        this.store.dispatch(new AuthActions.DeleteCustomerAddress(addressId));
      }
    );
  }

  setDefaultBilling(addressId: string): void {
    this.store.dispatch(new AuthActions.SetDefaultCustomerBillingAddress(addressId, true));
  }

  setDefaultShipping(addressId: string): void {
    this.store.dispatch(new AuthActions.SetDefaultCustomerShippingAddress(addressId, true));
  }

  getAddressDisplay(address: any): string {
    return `${address.address_1}, ${address.city}, ${address.postal_code}`;
  }

  getFullName(address: any): string {
    return `${address.first_name} ${address.last_name}`;
  }

  isDefaultBilling(address: any): boolean {
    return address.is_default_billing === true;
  }

  isDefaultShipping(address: any): boolean {
    return address.is_default_shipping === true;
  }

  goBack(): void {
    this.nav.goBack();
  }
}
