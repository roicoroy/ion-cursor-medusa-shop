import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonItem, IonInput, IonLabel, IonSelect, IonSelectOption, IonIcon, IonBackButton } from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthActions } from '../../store/auth/auth.actions';
import { IAppFacadeState, AppFacade } from '../../store/app.facade';
import { MedusaAddress } from '../../shared/interfaces/medusa-address';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { AlertService } from '../../shared/alert/alert.service';
import { nameRegex } from '../../shared/const/regexes.const';

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
    IonItem,
    IonInput,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonIcon,
    IonBackButton
  ]
})
export class AddAddressPage implements OnInit, OnDestroy {
  addressForm!: FormGroup;
  viewState$: Observable<IAppFacadeState>;
  loading = false;
  submitted = false;

  private store = inject(Store);
  private nav = inject(NavigationService);
  private alert = inject(AlertService);
  private fb = inject(FormBuilder);
  private facade = inject(AppFacade);
  private readonly ngUnsubscribe = new Subject();

  constructor() {
    this.viewState$ = this.facade.viewState$;
    this.initForm();
  }

  ngOnInit(): void {
    // Subscribe to view state for country/region data
    this.viewState$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(vs => {
      if (vs.defaultRegions?.country) {
        this.addressForm.patchValue({
          country_code: vs.defaultRegions.country
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  private initForm(): void {
    this.addressForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.pattern(nameRegex)]],
      last_name: ['', [Validators.required, Validators.pattern(nameRegex)]],
      address_1: ['', Validators.required],
      address_2: [''],
      city: ['', Validators.required],
      country_code: ['', Validators.required],
      postal_code: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.addressForm.valid) {
      this.loading = true;

      const addressData: MedusaAddress = {
        first_name: this.addressForm.value.first_name,
        last_name: this.addressForm.value.last_name,
        address_1: this.addressForm.value.address_1,
        address_2: this.addressForm.value.address_2,
        city: this.addressForm.value.city,
        country_code: this.addressForm.value.country_code,
        postal_code: this.addressForm.value.postal_code,
        phone: this.addressForm.value.phone
      };

      this.store.dispatch(new AuthActions.AddACustomerAddress(addressData));

      // Show success message and navigate back
      this.alert.presentSimpleAlertNavigate('Address Added Successfully!', 'customer-orders');
    } else {
      this.addressForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.nav.goBack();
  }

  // Helper methods for form validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.addressForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched || this.submitted)) : false;
  }

  getFieldError(fieldName: string): string {
    const field = this.addressForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return 'This field is required';
      }
      if (field.errors['pattern']) {
        if (fieldName === 'first_name' || fieldName === 'last_name') {
          return 'Please enter a valid name (letters only)';
        }
      }
    }
    return '';
  }

  // Country options - you can expand this list
  getCountryOptions(): Array<{code: string, name: string}> {
    return [
      { code: 'dk', name: 'Denmark' },
      { code: 'us', name: 'United States' },
      { code: 'gb', name: 'United Kingdom' },
      { code: 'de', name: 'Germany' },
      { code: 'fr', name: 'France' },
      { code: 'es', name: 'Spain' },
      { code: 'it', name: 'Italy' },
      { code: 'nl', name: 'Netherlands' },
      { code: 'se', name: 'Sweden' },
      { code: 'no', name: 'Norway' }
    ];
  }
}
