import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MultiStepCheckoutPage } from './multi-step-checkout.page';

const routes: Routes = [
  {
    path: '',
    component: MultiStepCheckoutPage,
    children: [
      {
        path: 'address',
        loadComponent: () => import('./address-step/address-step.component').then(m => m.AddressStepComponent)
      },
      {
        path: 'shipping',
        loadComponent: () => import('./shipping-step/shipping-step.component').then(m => m.ShippingStepComponent)
      },
      {
        path: 'payment',
        loadComponent: () => import('./payment-step/payment-step.component').then(m => m.PaymentStepComponent)
      },
      {
        path: 'review',
        loadComponent: () => import('./review-step/review-step.component').then(m => m.ReviewStepComponent)
      },
      {
        path: '',
        redirectTo: 'address',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerCheckoutRoutingModule { }