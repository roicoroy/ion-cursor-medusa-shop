
import { Injectable, inject } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Store } from '@ngxs/store';
import { AuthState } from 'src/app/store/auth/auth.state';

@Injectable({
  providedIn: 'root'
})
export class MedusaInterceptor implements HttpInterceptor {
  private store = inject(Store);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip translation files
    if (request.url.startsWith('../assets/i18n/en.json')) {
      return next.handle(request);
    }

    // Only modify Medusa API requests
    if (request.url.includes(environment.MEDUSA_BACKEND_URL) || request.url.includes(environment.MEDUSA_API_BASE_PATH)) {
      return next.handle(this.medusaRequest(request));
    }

    return next.handle(request);
  }

  private medusaRequest(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.store.selectSnapshot(AuthState.getToken);

    let headers = request.headers
      .set('Content-Type', 'application/json;charset=UTF-8')
      .set('Accept', 'application/json')
      .set('x-publishable-api-key', environment.MEDUSA_PUBLISHABLE_KEY);

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return request.clone({
      headers,
      withCredentials: true
    });
  }
}
