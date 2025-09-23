import { AfterViewInit, Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { lastValueFrom, Observable, Subscription } from 'rxjs';
import { IAppFacadeState, AppFacade } from 'src/app/store/app.facade';
import { NgxsFormPluginModule, UpdateFormValue } from '@ngxs/form-plugin';
import { AuthActions } from 'src/app/store/auth/auth.actions';
import { MedusaService } from 'src/app/shared/api/medusa.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { NewCountryListModel } from 'src/app/store/regions/regions.state';
import { ActivatedRoute } from '@angular/router';
import { RegionsActions } from 'src/app/store/regions/regions.actions';
import { AddressFormComponent } from 'src/app/components/forms';

@Component({
  selector: 'app-details-customer-address',
  templateUrl: './details-customer-address.page.html',
  styleUrls: [
    './details-customer-address.page.scss'
  ],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgxsFormPluginModule,
    AddressFormComponent,
  ],
})
export class DetailsCustomerAddressPage implements AfterViewInit {
  addressId!: string;
  viewState$: Observable<IAppFacadeState>;
  submitted = false;
  selectedCountry!: NewCountryListModel;
  formPath = 'auth.customerAddressForm';
  customerAddressForm = this.fb.group({
    address: [null],
  });
  defaultHref: string = 'medusa-profile'

  private facade = inject(AppFacade);
  private isEdit: boolean = false;
  private store = inject(Store);
  private subscription = new Subscription();
  private medusaApi = inject(MedusaService);
  private alert = inject(AlertService);
  private activatedRoute = inject(ActivatedRoute);

  constructor(
    private fb: FormBuilder
  ) {
    this.viewState$ = this.facade.viewState$;
    this.subscription.add(
      this.activatedRoute.queryParams
        .subscribe(async (params: any) => {
          this.addressId = params.addressId;
        }
        )
    );
    this.subscription.add(
      this.customerAddressForm.valueChanges
        .subscribe(() => {
          this.submitted = false;
        })
    );
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.addressId) {
      this.isEdit = false;
      this.populateCustomerAddressForm({
        adddress: {
          email: null,
          first_name: null,
          last_name: null,
          address_1: null,
          address_2: null,
          region_code: null,
          country_code: null,
          city: null,
          postal_code: null,
          phone: null,
        }
      });
    } else {
      this.isEdit = true;
      const res: any = await lastValueFrom(this.medusaApi.getCutomerAddress(this.addressId));
      this.populateCustomerAddressForm(res.address);
    }
  }
  async ngOnInit() {
    this.subscription.add(
      this.store.select(state => state.form.customerAddressForm)
        .subscribe(formState => {
          this.customerAddressForm.patchValue(formState.model);
        })
    );
    this.subscription.add(
      this.customerAddressForm.valueChanges.subscribe(() => {
        this.submitted = false;
      })
    );
  }
  onSubmit() {
    this.submitted = true;
    this.customerAddressForm.markAllAsTouched();
    const add: any = this.customerAddressForm.value.address;
    if (this.isEdit) {
      this.store.dispatch(new AuthActions.UpdateCustomerAddress(this.addressId, add));
      // this.alert.presentSimpleAlertNavigate('Address Edited', "customer-address");
      this.alert.presentSimpleAlertNavigate('Address Edited', "medusa-profile");
    } else {
      this.store.dispatch(new AuthActions.AddACustomerAddress(add));
      // this.alert.presentSimpleAlertNavigate('Adress Added', "customer-address");
      this.alert.presentSimpleAlertNavigate('Adress Added', "medusa-profile");
    }
  }
  //
  populateCustomerAddressForm(address: any) {
    this.store.dispatch(new UpdateFormValue({
      path: this.formPath,
      value: {
        address: {
          email: address.email ? address.email : null,
          first_name: address.first_name ? address.first_name : null,
          last_name: address.last_name ? address.last_name : null,
          address_1: address.address_1 ? address.address_1 : null,
          address_2: address.address_2 ? address.address_2 : null,
          country_code: address.country_code ? address.country_code : this.selectedCountry?.country,
          city: address.city ? address.city : null,
          postal_code: address.postal_code ? address.postal_code : null,
          phone: address.phone ? address.phone : null,
        },
      }
    }));
    this.store.dispatch(new RegionsActions.SetSelectedCountry(address.country_code))
  }
  //
  onReset() {
    this.customerAddressForm.reset();
  }
  //
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
