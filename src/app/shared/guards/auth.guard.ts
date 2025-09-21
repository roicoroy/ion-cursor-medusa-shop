import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Store } from '@ngxs/store';
import { AuthState } from 'src/app/store/auth/auth.state';
import { ModalController } from '@ionic/angular/standalone';
import { LoginComponent } from 'src/app/Components/auth-component/login-component/login-component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private store = inject(Store);
  private router = inject(Router);
  private modalCtrl = inject(ModalController);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.select(AuthState.isLoggedIn).pipe(
      map(isLoggedIn => {
        if (isLoggedIn) {
          return true;
        } else {
          // User is not logged in, show login modal
          this.showLoginModal(state.url);
          return false;
        }
      })
    );
  }

  private async showLoginModal(returnUrl: string): Promise<void> {
    try {
      const modal = await this.modalCtrl.create({
        component: LoginComponent,
        cssClass: 'auth-modal',
        backdropDismiss: false,
        showBackdrop: true,
        componentProps: {
          returnUrl: returnUrl
        }
      });
      
      await modal.present();
      
      // Listen for modal dismissal
      modal.onWillDismiss().then(() => {
        const isLoggedIn = this.store.selectSnapshot(AuthState.isLoggedIn);
        if (isLoggedIn) {
          // User logged in successfully, navigate to the intended route
          this.router.navigate([returnUrl]);
        } else {
          // User didn't log in, redirect to home
          this.router.navigate(['/tabs/products']);
        }
      });
    } catch (error) {
      console.error('Error showing login modal:', error);
      this.router.navigate(['/tabs/products']);
    }
  }
} 