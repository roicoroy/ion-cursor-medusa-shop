import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthState } from 'src/app/store/auth/auth.state';
import { AuthActions } from 'src/app/store/auth/auth.actions';
import { LoginComponent } from 'src/app/components/auth-component';

@Injectable({
  providedIn: 'root'
})
export class AuthFlowService {
  private store = inject(Store);
  private router = inject(Router);
  private modalCtrl = inject(ModalController);

  /**
   * Check if user is authenticated and redirect to login if not
   * @param returnUrl URL to redirect to after successful login
   * @returns Observable<boolean> true if authenticated, false if login required
   */
  requireAuth(returnUrl?: string): Observable<boolean> {
    return this.store.select(AuthState.isLoggedIn).pipe(
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          return from(Promise.resolve(true));
        } else {
          return this.showLoginModal(returnUrl);
        }
      })
    );
  }

  /**
   * Show login modal and handle authentication flow
   * @param returnUrl URL to redirect to after successful login
   * @returns Observable<boolean> true if login successful, false if cancelled
   */
  private showLoginModal(returnUrl?: string): Observable<boolean> {
    return from(this.createLoginModal(returnUrl)).pipe(
      switchMap(modal => {
        return from(modal.present()).pipe(
          switchMap(() => {
            return from(modal.onWillDismiss());
          }),
          map(result => {
            const isLoggedIn = this.store.selectSnapshot(AuthState.isLoggedIn);
            if (isLoggedIn && result.data?.returnUrl) {
              this.router.navigate([result.data.returnUrl]);
            }
            return isLoggedIn;
          })
        );
      })
    );
  }

  /**
   * Create login modal with proper configuration
   * @param returnUrl URL to redirect to after successful login
   * @returns Promise<HTMLIonModalElement>
   */
  private async createLoginModal(returnUrl?: string): Promise<HTMLIonModalElement> {
    return await this.modalCtrl.create({
      component: LoginComponent,
      cssClass: 'auth-modal',
      backdropDismiss: false,
      showBackdrop: true,
      componentProps: {
        returnUrl: returnUrl
      }
    });
  }

  /**
   * Force logout and redirect to home
   */
  forceLogout(): void {
    this.store.dispatch(new AuthActions.AuthLogout());
    this.router.navigate(['/tabs/products']);
  }

  /**
   * Check if user is authenticated
   * @returns boolean
   */
  isAuthenticated(): boolean {
    return this.store.selectSnapshot(AuthState.isLoggedIn);
  }

  /**
   * Get current authentication state as observable
   * @returns Observable<boolean>
   */
  getAuthState(): Observable<boolean> {
    return this.store.select(AuthState.isLoggedIn);
  }
} 