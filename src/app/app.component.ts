import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonTitle, IonButtons } from '@ionic/angular/standalone';
import { IconsService } from './shared/icons/icons.service';
import { NavigationService } from './shared/navigation/navigation.service';
import { fade, fadeWithZoom } from './shared/animations/animations';
import { MedusaStartService } from './shared/start/medusa-start.service';
import { LanguageService } from './shared/language/language.service';
import { MedusaService } from './shared/api/medusa.service';
import { AuthActions } from './store/auth/auth.actions';
import { AuthState } from './store/auth/auth.state';
import { Store } from '@ngxs/store';
import { MedusaProduct } from './shared/interfaces/customer-product.interface';
import { Input } from '@angular/core';
import { AuthComponent } from './components/auth-component/auth.component';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  animations: [
    fade(),
    fadeWithZoom()
  ],
  imports: [
    CommonModule,
    IonApp,
    IonRouterOutlet,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    AuthComponent
],
})
export class AppComponent implements OnInit {
  currentUrl: any;

  private medusaApi = inject(MedusaService);
  private readonly store = inject(Store);
  private icons = inject(IconsService);
  private navigation = inject(NavigationService);
  private startService = inject(MedusaStartService);
  private language = inject(LanguageService);

  @Input() medusaProduct: MedusaProduct | null = null;


  async ngOnInit(): Promise<void> {
    this.startService.medusaInit();
    await this.initializeApp();

  }

  async initializeApp() {
    try {
      this.icons.initIcons();
      this.language.initTranslate();
    } catch (err) {
      console.log('This is normal in a browser', err);
    }
  }

  checkout() {
    this.navigation.navigateTo('checkout');
  }

  navigate(route: string) {
    this.navigation.navigateTo(route);
  }

  async logout() {
    const isLoggedIn = this.store.selectSnapshot(AuthState.isLoggedIn);
    if (isLoggedIn) {
      this.medusaApi.medusaLogout();
    }
    this.store.dispatch(new AuthActions.AuthLogout());
  }
}
