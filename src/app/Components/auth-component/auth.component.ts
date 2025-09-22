import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonButton, IonCol, IonRow, IonLabel, IonPopover, ModalController, MenuController, IonText, IonButtons, IonIcon, IonItem, IonContent, IonList, IonItemDivider } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { AppFacade, IAppFacadeState } from 'src/app/store/app.facade';
import { Platform } from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { MedusaService } from 'src/app/shared/api/medusa.service';
import { AuthActions } from 'src/app/store/auth/auth.actions';
import { AuthState } from 'src/app/store/auth/auth.state';
import { RegisterComponent } from './register/register.component';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationService } from 'src/app/shared/navigation/navigation.service';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonButton,
    IonIcon,
    IonLabel,
    IonPopover,
    IonContent,
    IonList,
    IonItem,
    IonItemDivider,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule
  ]
})
export class AuthComponent implements OnInit {
  // Public observables for template
  public isLoggedIn$!: Observable<boolean>;
  public viewState$!: Observable<IAppFacadeState>;

  // Private services
  private readonly platform = inject(Platform);
  private readonly modalCtrl = inject(ModalController);
  private readonly store = inject(Store);
  private readonly medusaApi = inject(MedusaService);
  private readonly facade = inject(AppFacade);
  private readonly navigationService = inject(NavigationService);

  ngOnInit(): void {
    this.viewState$ = this.facade.viewState$;
    this.isLoggedIn$ = this.store.select(AuthState.isLoggedIn);
  }

  /**
   * Opens the login modal
   */
  async openLoginModal(): Promise<void> {
    try {
      const modal = await this.modalCtrl.create({
        component: LoginComponent,
        cssClass: 'auth-modal',
        backdropDismiss: false,
        showBackdrop: true
      });

      await modal.present();

      // Listen for modal dismissal
      modal.onWillDismiss().then(() => {
        console.log('Login modal dismissed');
      });
    } catch (error) {
      console.error('Error opening login modal:', error);
    }
  }

  /**
   * Opens the register modal
   */
  async openRegisterModal(): Promise<void> {
    try {
      const modal = await this.modalCtrl.create({
        component: RegisterComponent,
        cssClass: 'auth-modal',
        backdropDismiss: false,
        showBackdrop: true
      });

      await modal.present();

      // Listen for modal dismissal
      modal.onWillDismiss().then(() => {
        console.log('Register modal dismissed');
      });
    } catch (error) {
      console.error('Error opening register modal:', error);
    }
  }

  /**
   * Handles user logout
   */
  async handleLogout(): Promise<void> {
    try {
      const isLoggedIn = this.store.selectSnapshot(AuthState.isLoggedIn);
      if (isLoggedIn) {
        await this.medusaApi.medusaLogout();
      }
      this.store.dispatch(new AuthActions.AuthLogout());

      // Navigate to products page after logout
      this.navigationService.navigateTo('/tabs/products');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  /**
   * Navigate to user profile
   */
  navigateToProfile(): void {
    this.navigationService.navigateTo('medusa-profile');
  }

  /**
   * Navigate to user orders
   */
  navigateToOrders(): void {
    // Navigate to profile page with orders tab
    this.navigationService.navigateTo('medusa-profile');
  }

  /**
   * Navigate to user addresses
   */
  navigateToAddresses(): void {
    this.navigationService.navigateTo('customer-address');
  }
}
