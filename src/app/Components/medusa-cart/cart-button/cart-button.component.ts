import { Component, inject } from '@angular/core';
import { IonBadge, IonButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { fadeWithZoom } from 'src/app/shared/animations/animations';
import { MedusaCartState } from 'src/app/store/medusa-cart/medusa-cart.state';
import { Store } from '@ngxs/store';
import { MedusaCart } from 'src/app/shared/interfaces/medusa-cart.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-button',
  templateUrl: './cart-button.component.html',
  styleUrls: ['./cart-button.component.scss'],
  standalone: true,
  animations: [
    fadeWithZoom()
  ],
  imports: [
    IonBadge,
    IonIcon,
    IonButton,
    CommonModule
  ]
})
export class CartButtonComponent {

  medusaCart$: Observable<MedusaCart | null> = inject(Store).select(MedusaCartState.getMedusaCart);

  private router = inject(Router);

  navigateToCart() {
    this.router.navigate(['/tabs/cart']);
  }
  
  getItemCount(cart: MedusaCart | null): number {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
  }
  
  checkout() {
    // TODO: Implement checkout functionality
    console.log('Checkout clicked');
  }
}
