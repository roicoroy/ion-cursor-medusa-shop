import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { MedusaCart } from '../shared/interfaces/medusa-cart.interface';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge, CommonModule],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  private store = inject(Store);
  
  cart$: Observable<MedusaCart | null>;

  constructor() {
    this.cart$ = this.store.select((state: any) => state.medusaCart?.medusaCart);
  }

  getItemCount(cart: MedusaCart | null): number {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
  }
}
