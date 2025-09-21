import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'products',
    loadComponent: () => import('./Pages/products/products.page').then((m) => m.ProductsPage),
  },
  {
    path: 'cart',
    loadComponent: () => import('./Pages/cart/cart.page').then((m) => m.CartPage),
  },
  {
    path: 'product-details',
    loadComponent: () =>
      import('./Pages/products/products-components/product-details/product-details.page').then(m => m.ProductDetailsPage)
  },
  {
    path: 'medusa-profile',
    loadComponent: () => import('./Pages/medusa-profile/medusa-profile.page').then((m) => m.MedusaProfilePage),
  },
  {
    path: 'customer-address',
    loadComponent: () => import('./Pages/customer-address/customer-address.page').then((m) => m.CustomerAddressPage),
  },
  {
    path: 'customer-checkout',
    loadChildren: () => import('./Pages/customer-checkout/customer-checkout-routing.module').then((m) => m.CustomerCheckoutRoutingModule),
  },
  {
    path: 'customer-orders',
    loadComponent: () => import('./Pages/orders/customer-orders/customer-orders.page').then((m) => m.CustomerOrdersPage),
  },
  {
    path: 'order-review',
    loadComponent: () => import('./Pages/orders/order-review/order-review.page').then((m) => m.OrderReviewPage),
  },
  {
    path: 'add-address',
    loadComponent: () => import('./Pages/add-address/add-address.page').then((m) => m.AddAddressPage),
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./Pages/wishlist-page/wishlist.page').then((m) => m.WishlistPage),
  },
  {
    path: 'returns',
    loadComponent: () => import('./Pages/returns/returns-list/returns-list.page').then((m) => m.ReturnsListPage),
  },
  {
    path: 'return-details/:id',
    loadComponent: () => import('./Pages/returns/return-details/return-details.page').then((m) => m.ReturnDetailsPage),
  },
  {
    path: 'create-return',
    loadComponent: () => import('./Pages/returns/create-return/create-return.page').then((m) => m.CreateReturnPage),
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
