import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonIcon, IonBackButton } from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { AuthActions } from '../../store/auth/auth.actions';
import { MedusaAddress } from '../../shared/interfaces/medusa-address';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { AlertService } from '../../shared/alert/alert.service';
import { AddressFormComponent } from '../../components/forms/address-form/address-form.component';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonIcon,
    IonBackButton,
    AddressFormComponent
  ]
})
export class AddAddressPage implements OnInit, OnDestroy {
  @ViewChild(AddressFormComponent) addressFormComponent!: AddressFormComponent;

  loading = false;

  private store = inject(Store);
  private nav = inject(NavigationService);
  private alert = inject(AlertService);
  private readonly ngUnsubscribe = new Subject();

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  onSubmit(): void {
    this.addressFormComponent.markAllAsTouched();

    if (this.addressFormComponent.isValid()) {
      this.loading = true;

      const addressData: MedusaAddress = this.addressFormComponent.getValue();

      this.store.dispatch(new AuthActions.AddACustomerAddress(addressData));

      // Show success message and navigate back
      this.alert.presentSimpleAlertNavigate('Address Added Successfully!', 'customer-orders');
    } 
  }

  onCancel(): void {
    this.nav.goBack();
  }
}