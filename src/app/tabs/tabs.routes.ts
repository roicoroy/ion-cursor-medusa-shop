import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'products',
        loadComponent: () =>
          import('../Pages/products/products.page').then((m) => m.ProductsPage),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('../Pages/cart/cart.page').then((m) => m.CartPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../Pages/medusa-profile/medusa-profile.page').then((m) => m.MedusaProfilePage),
      },
      {
        path: '',
        redirectTo: '/tabs/products',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/products',
    pathMatch: 'full',
  },
];
