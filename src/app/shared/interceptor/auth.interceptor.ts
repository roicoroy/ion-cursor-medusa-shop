import { Injectable, inject } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AuthState } from 'src/app/store/auth/auth.state';
import { AuthActions } from 'src/app/store/auth/auth.actions';
import { AuthFlowService } from 'src/app/shared/services/auth-flow.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  private store = inject(Store);
  private authFlowService = inject(AuthFlowService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('/auth/session')) {
      return next.handle(request);
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Check if it's an authentication error (401 Unauthorized)
        if (error.status === 401) {
          const isLoggedIn = this.store.selectSnapshot(AuthState.isLoggedIn);
          
          if (!isLoggedIn) {
            // User is not logged in, show login modal
            this.authFlowService.requireAuth().subscribe();
          } else {
            // User is logged in but token might be expired, try to refresh
            return this.handleTokenRefresh(request, next);
          }
        }
        
        return throwError(() => error);
      })
    );
  }

  private handleTokenRefresh(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.dispatch(new AuthActions.GetSession()).pipe(
      switchMap(() => {
        // Retry the original request with new token
        const isLoggedIn = this.store.selectSnapshot(AuthState.isLoggedIn);
        if (isLoggedIn) {
          // If GetSession was successful, the token should be updated in the state
          // Re-fetch the token from the state or assume the original request will now work
          // For simplicity, we'll just retry the original request without explicitly adding a new token header
          // as Medusa's session management should handle it automatically after a successful GetSession.
          return next.handle(request);
        } else {
          // Session retrieval failed, show login modal
          this.authFlowService.requireAuth().subscribe();
          return throwError(() => new Error('Authentication failed'));
        }
      }),
      catchError((error) => {
        // Session retrieval failed, show login modal
        this.authFlowService.requireAuth().subscribe();
        return throwError(() => error);
      })
    );
  }
} 