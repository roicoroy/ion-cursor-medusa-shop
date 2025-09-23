import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.page').then((m) => m.ProductsPage),
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.page').then((m) => m.CartPage),
  },
  {
    path: 'product-details',
    loadComponent: () =>
      import('./pages/products/products-components/product-details/product-details.page').then(m => m.ProductDetailsPage)
  },
  {
    path: 'medusa-profile',
    loadComponent: () => import('./pages/medusa-profile/medusa-profile.page').then((m) => m.MedusaProfilePage),
  },
  {
    path: 'customer-address',
    loadComponent: () => import('./pages/customer-address/customer-address.page').then((m) => m.CustomerAddressPage),
  },
  {
    path: 'customer-checkout',
    loadChildren: () => import('./pages/customer-checkout/customer-checkout-routing.module').then((m) => m.CustomerCheckoutRoutingModule),
  },
  {
    path: 'customer-orders',
    loadComponent: () => import('./pages/orders/customer-orders/customer-orders.page').then((m) => m.CustomerOrdersPage),
  },
  {
    path: 'order-review',
    loadComponent: () => import('./pages/orders/order-review/order-review.page').then((m) => m.OrderReviewPage),
  },
  {
    path: 'add-address',
    loadComponent: () => import('./pages/add-address/add-address.page').then((m) => m.AddAddressPage),
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./pages/wishlist-page/wishlist.page').then((m) => m.WishlistPage),
  },
  {
    path: 'returns',
    loadComponent: () => import('./pages/returns/returns-list/returns-list.page').then((m) => m.ReturnsListPage),
  },
  {
    path: 'return-details/:id',
    loadComponent: () => import('./pages/returns/return-details/return-details.page').then((m) => m.ReturnDetailsPage),
  },
  {
    path: 'create-return',
    loadComponent: () => import('./pages/returns/create-return/create-return.page').then((m) => m.CreateReturnPage),
  },
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
];
