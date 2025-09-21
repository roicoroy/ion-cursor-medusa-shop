import { AfterViewInit, Component, forwardRef, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { IAppFacadeState, AppFacade } from 'src/app/store/app.facade';
import { IonInput, IonSelect, IonSelectOption, IonItem, IonList } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { nameRegex } from 'src/app/components/forms/extras/regexes.const';
import { MaterialModule } from 'src/app/components/forms/material.module';
import { fade } from 'src/app/shared/animations/animations';
import { RegionsActions } from 'src/app/store/regions/regions.actions';
import { CountryPhone } from 'src/app/shared/interfaces/country-phone/country-phone.model';

@Component({
  selector: 'app-customer-address-form',
  templateUrl: './customer-address-form.component.html',
  styleUrls: ['./customer-address-form.component.scss'],
  standalone: true,
  animations: [
    fade()
  ],
  imports: [
    IonSelect,
    IonInput,
    IonSelectOption,
    IonList,
    IonItem,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    TranslateModule,
  ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CustomerAddressFormComponent), multi: true }
  ]
})
export class CustomerAddressFormComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges, AfterViewInit {

  @Input() touched!: boolean;

  phoneNumberPlaceholder!: string;

  cusAddressForm!: FormGroup;;

  viewState$!: Observable<IAppFacadeState>;

  selectedCoutryCode!: string;

  onChange: any = (_: any) => { };

  onTouch: any = () => { };

  private store = inject(Store);
  private facade = inject(AppFacade);
  private subscription = new Subscription();
  private fb = inject(FormBuilder);

  async ngOnInit() {
    this.viewState$ = this.facade.viewState$;
    this.cusAddressForm = this.fb.group({
      first_name: [null, [Validators.required, Validators.pattern(nameRegex)]],
      last_name: [null, [Validators.required, Validators.pattern(nameRegex)]],
      address_1: [null, Validators.required],
      address_2: [null],
      country_code: [null, Validators.required],
      city: [null, Validators.required],
      postal_code: [null, Validators.required],
      phone: [null, Validators.required]
    });

    this.subscription.add(
      this.cusAddressForm.valueChanges.subscribe((value: any) => {
        this.onChange(value);
      })
    );
  }

  ngAfterViewInit(): void {
    this.subscription.add(
      this.viewState$
        .subscribe((vs) => {
          this.selectedCoutryCode = vs.defaultRegions.country;
          this.phoneNumberPlaceholder = this.buildPhoneNumberPlaceholder(vs.defaultRegions.country, vs.defaultRegions.label)
          this.store.dispatch(new RegionsActions.SetSelectedCountry(vs.defaultRegions.region_id));
          this.cusAddressForm.get('country_code')!.setValue(vs.defaultRegions.country as any);
        })
    );
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['touched'] && simpleChanges['touched'].currentValue) {
      this.cusAddressForm?.markAllAsTouched();
    }
  }

  writeValue(value: any | any): void {
    if (value) {
      this.cusAddressForm.reset(value);
    }
  }

  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: any) => {}): void {
    this.onTouch = fn;
  }

  onIonRadioChange($vent: any) {
    this.store.dispatch(new RegionsActions.SetSelectedCountry($vent.target.value));
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
