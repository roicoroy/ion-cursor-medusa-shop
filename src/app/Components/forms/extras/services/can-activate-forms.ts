import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
// import * as FormsSelectors from '../store/forms.selectors';
// import { RoutePath } from '../../models/route-path.enum';

@Injectable({
  providedIn: 'root'
})
export class CanActivateForms implements CanActivate {
  private store = inject(Store);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    // if (route.url[0].path === RoutePath.payment) {
    //   return this.store.select(FormsSelectors.isPaymentEnabled);
    // }
    // if (route.url[0].path === RoutePath.shipping) {
    //   return this.store.select(FormsSelectors.isDeliveryFormValid);
    // }
    return true;
  }
}
