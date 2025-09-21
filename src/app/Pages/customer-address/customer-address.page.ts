import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonContent, IonButton, IonIcon, IonTitle, IonSpinner } from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IAppFacadeState, AppFacade } from 'src/app/store/app.facade';
import { TranslateModule } from '@ngx-translate/core';
import { AuthActions } from '../../store/auth/auth.actions';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { DefaultAddressesViewComponent } from "./default-addresses-view/default-addresses-view.component";
import { DefaultAddressesListComponent } from "./default-addresses-list/default-addresses-list.component";
import { IonModal } from '@ionic/angular/standalone';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-customer-address',
  templateUrl: './customer-address.page.html',
  styleUrls: ['./customer-address.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonHeader,
    IonToolbar,
    IonButton,
    IonButtons,
    IonTitle,
    IonSpinner,
    CommonModule,
    IonContent,
    TranslateModule,
    DefaultAddressesViewComponent,
    DefaultAddressesListComponent
],
})
export class CustomerAddressPage {
  @ViewChild(IonModal) modal!: IonModal;
  viewState$: Observable<IAppFacadeState>;

  private facade = inject(AppFacade);
  private store = inject(Store);
  private nav = inject(NavigationService);

  constructor() {
    this.viewState$ = this.facade.viewState$;
    this.store.dispatch(new AuthActions.GetSession());
  }

  addNewAddress() {
    this.nav.navigateTo('add-address');
  }
  
  back() {
    this.nav.goBack();
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
}
