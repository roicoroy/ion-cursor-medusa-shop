import { Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonButton, IonButtons, IonToolbar, IonModal, IonTitle, IonIcon, IonGrid, IonRow, IonCol, IonAvatar, IonSegment, IonSegmentButton, IonLabel, IonList, IonItem, IonChip, IonToggle, IonInput } from '@ionic/angular/standalone';
import { Observable, Subject } from 'rxjs';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { Store } from '@ngxs/store';
import { IAppFacadeState, AppFacade } from '../../store/app.facade';
import { AuthActions } from '../../store/auth/auth.actions';
import { DefaultAddressesListComponent } from "../customer-address/default-addresses-list/default-addresses-list.component";
import { DefaultAddressesViewComponent } from "../customer-address/default-addresses-view/default-addresses-view.component";
import { CustomerDetailsFormComponent } from "../customer-address/customer-details-form/customer-details-form.component";
import { OverlayEventDetail } from '@ionic/core';
import { takeUntil } from 'rxjs/operators';
import { AppFooterComponent } from "../../Components/footer/footer.component";


export interface OrderIdParam {
  orderId: string
}

@Component({
  selector: 'app-medusa-profile',
  templateUrl: './medusa-profile.page.html',
  styleUrls: ['./medusa-profile.page.scss'],
  standalone: true,
  imports: [IonModal,
    IonToolbar,
    IonButtons,
    IonButton,
    IonHeader,
    IonTitle,
    IonIcon,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonAvatar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonItem,
    IonChip,
    IonToggle,
    IonInput,
    CommonModule,
    FormsModule,
    DefaultAddressesListComponent,
    DefaultAddressesViewComponent,
    CustomerDetailsFormComponent,
    AppFooterComponent]
})
export class MedusaProfilePage implements OnInit, OnDestroy {
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('accountModal') accountModal!: IonModal;

  private readonly ngUnsubscribe = new Subject();

  public genderSelectOptions = [
    { value: 'male', text: 'Male' },
    { value: 'female', text: 'Female' },
    { value: 'others', text: 'Others' },
  ];

  public tabsList = [
    { id: 'nav-profile-tab', button: 'Profile', active: false },
    { id: 'nav-information-tab', button: 'Information', active: false },
    { id: 'nav-address-tab', button: 'Address', active: true },
    // { id: 'nav-order-tabremove', button: 'Order', active: false },
    { id: 'nav-notification-tab', button: 'Notification', active: false },
    { id: 'nav-password-tab', button: 'Password', active: false },
  ];

  tabsListSignal = signal(this.tabsList);
  selectedTab = 'nav-address-tab'; // Default selected tab

  private nav = inject(NavigationService);
  viewState$: Observable<IAppFacadeState>;
  private facade = inject(AppFacade);
  private store = inject(Store);

  constructor() {
    this.viewState$ = this.facade.viewState$;
  }

  ngOnInit(): void {
    this.viewState$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(vs => {
      // If user is not logged in, try to get session
      if (!vs.isLoggedIn) {
        this.store.dispatch(new AuthActions.GetSession());
      } else if (vs.isLoggedIn && !vs.customer) {
        this.store.dispatch(new AuthActions.GetSession());
      }
    });

    // Initial session check
    this.store.dispatch(new AuthActions.GetSession());
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  changeHandler(selectedOption: { value: string; text: string }) {
    console.log('Selected option:', selectedOption);
  }

  onTabButtonPressed(tabId: string) {
    if (tabId === 'nav-order-tab') {
      // Navigate to customer orders page
      this.nav.navigateTo('customer-orders');
      return;
    }

    this.selectedTab = tabId;
    const newDa = this.tabsList.map((tabItem, i: number) => ({
      id: tabItem.id,
      button: this.tabsList[i].button,
      active: tabItem.id === tabId,
    }));
    this.tabsListSignal.set(newDa);
  }

  onSegmentChange(event: any) {
    const selectedValue = event.detail.value;
    this.onTabButtonPressed(selectedValue);
  }

  addNewAddress() {
    this.nav.navigateTo('add-address');
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(null, 'confirm');
  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirm') {
      // Handle confirmation
    }
  }

  wishlist() {
    // Navigate to wishlist page when implemented
    console.log('Navigate to wishlist');
  }

  returns() {
    this.nav.navigateTo('returns');
  }

  openLogin() {
    // Navigate to login page or open login modal
    this.nav.navigateTo('auth');
  }

  logout() {
    this.store.dispatch(new AuthActions.AuthLogout());
  }

  testLogin() {
    console.log('Testing login with test credentials...');
    const loginPayload = {
      email: 'test2@email.com',
      password: 'Rwbento123!'
    };
    this.store.dispatch(new AuthActions.Login(loginPayload));
  }

  openAccountDetails() {
    this.accountModal.present();
  }
}
