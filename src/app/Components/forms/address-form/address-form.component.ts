import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, IonIcon, IonCheckbox, IonText } from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MedusaAddress } from '../../../shared/interfaces/medusa-address';
import { RegionsState, NewCountryListModel } from '../../../store/regions/regions.state';
import { RegionsActions } from '../../../store/regions/regions.actions';
import { TranslateModule } from '@ngx-translate/core';

export interface AddressFormData {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  country_code: string;
  postal_code: string;
  phone: string;
  company?: string;
  email?: string;
}

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonCheckbox,
    IonText
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressFormComponent),
      multi: true
    }
  ]
})
export class AddressFormComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() addressType: 'billing' | 'shipping' | 'general' = 'general';
  @Input() showEmail: boolean = false;
  @Input() showCompany: boolean = false;
  @Input() required: boolean = true;
  @Input() initialData?: Partial<AddressFormData>;
  @Input() disabled: boolean = false;

  @Output() formValid = new EventEmitter<boolean>();
  @Output() formData = new EventEmitter<AddressFormData>();

  addressForm!: FormGroup;
  regionList$: Observable<NewCountryListModel[]>;
  currentRegion$: Observable<NewCountryListModel>;

  private store = inject(Store);
  private fb = inject(FormBuilder);
  private readonly ngUnsubscribe = new Subject<void>();

  // ControlValueAccessor implementation
  private onChange = (value: AddressFormData) => {};
  private onTouched = () => {};

  constructor() {
    this.regionList$ = this.store.select(RegionsState.getRegionList);
    this.currentRegion$ = this.store.select(RegionsState.getDefaultRegion);
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormSubscriptions();
    this.loadRegions();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private initializeForm(): void {
    const validators = this.required ? [Validators.required] : [];
    const nameValidators = this.required ? [Validators.required, Validators.minLength(2)] : [Validators.minLength(2)];
    const emailValidators = this.required ? [Validators.required, Validators.email] : [Validators.email];

    this.addressForm = this.fb.group({
      first_name: ['', nameValidators],
      last_name: ['', nameValidators],
      address_1: ['', validators],
      address_2: [''],
      city: ['', validators],
      country_code: ['', validators],
      postal_code: ['', validators],
      phone: ['', validators],
      company: [''],
      email: ['', this.showEmail ? emailValidators : []]
    });

    // Set initial data if provided
    if (this.initialData) {
      this.addressForm.patchValue(this.initialData);
    }

    // Set disabled state
    if (this.disabled) {
      this.addressForm.disable();
    }
  }

  private setupFormSubscriptions(): void {
    // Subscribe to form value changes
    this.addressForm.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        this.formData.emit(value);
        this.onChange(value);
      });

    // Subscribe to form validity changes
    this.addressForm.statusChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(status => {
        this.formValid.emit(status === 'VALID');
      });

    // Subscribe to current region changes
    this.currentRegion$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(region => {
        if (region?.country && !this.addressForm.get('country_code')?.value) {
          this.addressForm.patchValue({ country_code: region.country });
        }
      });
  }

  private loadRegions(): void {
    // Load regions if not already loaded
    const regionList = this.store.selectSnapshot(RegionsState.getRegionList);
    if (!regionList || regionList.length === 0) {
      this.store.dispatch(new RegionsActions.GetCountries());
    }
  }

  onCountryChange(event: any): void {
    const selectedCountry = event.detail.value;
    if (selectedCountry) {
      this.store.dispatch(new RegionsActions.SetSelectedCountry(selectedCountry));
    }
  }

  // ControlValueAccessor methods
  writeValue(value: AddressFormData | null): void {
    if (value) {
      this.addressForm.patchValue(value);
    }
  }

  registerOnChange(fn: (value: AddressFormData) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.addressForm.disable();
    } else {
      this.addressForm.enable();
    }
  }

  // Validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.addressForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.addressForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      first_name: 'First name',
      last_name: 'Last name',
      address_1: 'Address line 1',
      address_2: 'Address line 2',
      city: 'City',
      country_code: 'Country',
      postal_code: 'Postal code',
      phone: 'Phone number',
      company: 'Company',
      email: 'Email'
    };
    return labels[fieldName] || fieldName;
  }

  // Public methods for parent components
  markAllAsTouched(): void {
    this.addressForm.markAllAsTouched();
    this.onTouched();
  }

  reset(): void {
    this.addressForm.reset();
    if (this.initialData) {
      this.addressForm.patchValue(this.initialData);
    }
  }

  isValid(): boolean {
    return this.addressForm.valid;
  }

  getValue(): AddressFormData {
    return this.addressForm.value;
  }

  getFormattedAddress(): string {
    const value = this.getValue();
    const parts = [
      `${value.first_name} ${value.last_name}`.trim(),
      value.address_1,
      value.address_2,
      `${value.city}, ${value.postal_code}`.trim(),
      value.country_code?.toUpperCase()
    ].filter(part => part && part.trim());

    return parts.join('\n');
  }
}