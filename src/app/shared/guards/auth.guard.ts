import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Store } from '@ngxs/store';
import { AuthState } from 'src/app/store/auth/auth.state';
import { ModalController } from '@ionic/angular/standalone';
import { LoginComponent } from 'src/app/components/auth-component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private store = inject(Store);
  private router = inject(Router);
  private modalCtrl = inject(ModalController);
  private isModalPresented = false;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    console.log('AuthGuard: canActivate called');
    return this.store.select(AuthState.isLoggedIn).pipe(
      map(isLoggedIn => {
        console.log('AuthGuard: isLoggedIn is', isLoggedIn);
        if (isLoggedIn) {
          this.isModalPresented = false; // Reset flag
          console.log('AuthGuard: User is logged in, allowing access');
          return true;
        } else {
          console.log('AuthGuard: User is not logged in, showing login modal');
          if (!this.isModalPresented) { // Check flag
            this.isModalPresented = true; // Set flag
            this.showLoginModal(state.url);
          }
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
        this.isModalPresented = false; // Reset flag
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
      this.isModalPresented = false; // Reset flag
      this.router.navigate(['/tabs/products']);
    }
  }
}
