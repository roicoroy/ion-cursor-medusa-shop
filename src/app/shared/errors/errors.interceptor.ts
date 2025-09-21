import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { Store } from '@ngxs/store';
import { AuthState } from 'src/app/store/auth/auth.state';
import { GlobalErrorHandlerService } from './global-error-handler/global-error-handler.service';
import { MedusaCartActions } from 'src/app/store/medusa-cart/medusa-cart.actions';
import { AlertService } from '../alert/alert.service';
import { AuthActions } from 'src/app/store/auth/auth.actions';
import { NavigationService } from '../navigation/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

  isLoggedIn$: Observable<boolean> = inject(Store).select(AuthState.isLoggedIn);

  private store = inject(Store);

  private globalErrors = inject(GlobalErrorHandlerService);

  private alert = inject(AlertService);

  private nav = inject(NavigationService);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      tap(null, error => {
        if (error.status === 400) {
          this.globalErrors.handleError(error);
          // this.store.dispatch(new MedusaCartActions.LogOut());
        }
        if (error.status === 401) {
          this.globalErrors.handleError(error);
          this.store.dispatch(new AuthActions.AuthLogout());
          this.nav.navigateTo('welcome');
        }
        if (error.status === 404) {
          this.globalErrors.handleError(error);
          // this.store.dispatch(new MedusaCartActions.LogOut());
        }
        if (error.status === 422) {
          this.globalErrors.handleError(error);
        }
        if (error.status === 500) {
          this.globalErrors.handleError(error);
        }
      })
    );
  }
}
