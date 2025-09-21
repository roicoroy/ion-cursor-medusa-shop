import { AfterViewInit, Component, forwardRef, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { emailPatterRegex, nameRegex } from '../extras/regexes.const';
import { AddressFormValue } from '../extras/models/address-form-value.interface';
import { Store } from '@ngxs/store';
import { IAppFacadeState, AppFacade } from 'src/app/store/app.facade';
import { RegionsActions } from 'src/app/store/regions/regions.actions';
import { CommonModule } from '@angular/common';
import { IonItem, IonList, IonLabel, IonInput } from "@ionic/angular/standalone";
import { MaterialModule } from '../material.module';
import { CountryPhone } from 'src/app/shared/interfaces/country-phone/country-phone.model';
import { RegionSelectComponent } from '../../region-select/region-select.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonLabel,
    RegionSelectComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
    NgxsFormPluginModule,
    IonItem,
    IonList
],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AddressFormComponent), multi: true }
  ]
})
export class AddressFormComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges, AfterViewInit {

  @Input() touched?: boolean;

  @Input() isShippingTheSame?: boolean;

  @Input() isRegisterForm?: boolean;

  phoneNumberPlaceholder!: string;

  emailRegex = emailPatterRegex;

  addressForm!: FormGroup;;

  viewState$!: Observable<IAppFacadeState>;

  selectedCoutryCode!: string;

  onChange: any = (_: AddressFormValue) => { };

  onTouch: any = () => { };

  formPath = 'form.addressForm';

  private store = inject(Store);

  private facade = inject(AppFacade);

  private subscription = new Subscription();

  private fb = inject(FormBuilder);

  constructor() {
    this.viewState$ = this.facade.viewState$;

    this.addressForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern(emailPatterRegex)]],
      first_name: [null, [Validators.required, Validators.pattern(nameRegex)]],
      last_name: [null, [Validators.required, Validators.pattern(nameRegex)]],
      address_1: [null, Validators.required],
      address_2: [null],
      country_code: [null, Validators.required],
      city: [null, Validators.required],
      postal_code: [null, Validators.required],
      phone: [null, Validators.required]
    });
  }
  
  ngOnInit(): void {
    // Optionally, you can initialize or fetch data here if needed in the future.
    // Currently, all initialization is handled in the constructor and ngAfterViewInit.
  }
  

  ngAfterViewInit(): void {
    this.subscription.add(
      this.addressForm.valueChanges.subscribe((value: any) => {
        this.onChange(value);
      })
    );

    this.subscription.add(
      this.viewState$
        // .pipe(take(1))
        .subscribe((vs) => {
          // console.log(vs.defaultRegions);
          this.selectedCoutryCode = vs.defaultRegions.country;
          this.phoneNumberPlaceholder = this.buildPhoneNumberPlaceholder(vs.defaultRegions.country, vs.defaultRegions.label)
          this.store.dispatch(new RegionsActions.SetSelectedCountry(vs.defaultRegions.region_id));
          this.addressForm.get('country_code')?.setValue(vs.defaultRegions.country as string);
        })
    );
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['touched'] && simpleChanges['touched'].currentValue) {
      this.addressForm?.markAllAsTouched();
    }
  }

  writeValue(value: any | AddressFormValue): void {
    if (value) {
      this.addressForm.reset(value);
    }
  }

  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: AddressFormValue) => {}): void {
    this.onTouch = fn;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private buildPhoneNumberPlaceholder(iso_2: any, name: string): string {
    const string = new CountryPhone(iso_2, name);
    const phoneNumberPlaceholder = `${string.code} ${string.sample_phone}`;
    return phoneNumberPlaceholder;
  }

}
