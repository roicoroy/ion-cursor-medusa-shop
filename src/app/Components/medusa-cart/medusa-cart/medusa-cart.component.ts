import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel, IonThumbnail, IonButton, IonIcon, IonBadge, IonNote, IonInput, IonSpinner } from '@ionic/angular/standalone';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone';
import { fade } from 'src/app/shared/animations/animations';
import { MedusaCartActions } from 'src/app/store/medusa-cart/medusa-cart.actions';
import { MedusaCart } from 'src/app/shared/interfaces/medusa-cart.interface';
import { MedusaCartState } from 'src/app/store/medusa-cart/medusa-cart.state';
import { ShortNumber } from "src/app/shared/pipes/short-number/short-number.pipe";
import { MedusaCurrency } from "src/app/shared/pipes/medusa-currency/medusa-currency.pipe";
import { Item } from 'src/app/shared/interfaces/medusa-order';
import { ApplyDiscountComponent } from '../../apply-discount/apply-discount.component';

@Component({
  selector: 'app-medusa-cart',
  templateUrl: './medusa-cart.component.html',
  styleUrls: ['./medusa-cart.component.scss'],
  standalone: true,
  animations:[
    fade()
  ],
  imports: [
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonLabel,
    IonThumbnail,
    IonButton,
    IonIcon,
    IonBadge,
    IonNote,
    IonInput,
    IonSpinner,
    CommonModule,
    FormsModule,
    ShortNumber,
    MedusaCurrency,
    ApplyDiscountComponent
  ]
})
export class MedusaCartComponent implements OnInit, OnDestroy {

  private store = inject(Store);
  private router = inject(Router);
  private modalCtrl = inject(ModalController);
  private readonly ngUnsubscribe = new Subject<void>();

  medusaCart$: Observable<MedusaCart | null> = this.store.select(MedusaCartState.getMedusaCart);

  loading = false;
  error: string | null = null;

  constructor() {}

  ngOnInit() {
    this.refreshCart();
  }

  /**
   * Refresh cart data from the server
   */
  refreshCart() {
    this.loading = true;
    this.error = null;
    this.store.dispatch(new MedusaCartActions.RefreshCart());

    // Subscribe to cart changes to update loading state
    this.medusaCart$.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (cart) => {
        this.loading = false;
        // console.log('Cart component received cart:', cart);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load cart data';
        console.error('Cart refresh error:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Navigate to product details page
   */
  productDetails(id: number) {
    this.router.navigate(['/product-details', id]);
  }

  /**
   * Decrease item quantity in cart
   */
  decrementItem(item: Item) {
    if (item.quantity > 1) {
      this.store.dispatch(new MedusaCartActions.DecreaseCartItem(item));
    } else {
      this.delete(item);
    }
  }

  /**
   * Increase item quantity in cart
   */
  incrementItem(item: Item) {
    this.store.dispatch(new MedusaCartActions.IncreaseCartItem(item));
  }

  /**
   * Remove item from cart
   */
  delete(item: Item) {
    this.store.dispatch(new MedusaCartActions.DeleteCartItem(item.id));
  }

  /**
   * Get total number of items in cart
   */
  getItemCount(cart: MedusaCart | null): number {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
  }

  /**
   * Check if cart is empty
   */
  isCartEmpty(cart: MedusaCart | null): boolean {
    const isEmpty = !cart || !cart.items || cart.items.length === 0;
    // console.log('isCartEmpty check:', { cart, isEmpty, items: cart?.items });
    return isEmpty;
  }

  /**
   * Get item total price
   */
  getItemTotal(item: any): number {
    return (item.unit_price * item.quantity) / 100;
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount: number, currencyCode: string = 'usd'): string {
    const currencySymbols: { [key: string]: string } = {
      'usd': '$',
      'gbp': '£',
      'eur': '€',
      'brl': 'R$'
    };

    const symbol = currencySymbols[currencyCode.toLowerCase()] || '$';
    return `${symbol}${amount.toFixed(2)}`;
  }

  /**
   * Clear entire cart
   */
  clearCart() {
    const currentCart = this.store.selectSnapshot((state: any) => state.medusaCart?.medusaCart);
    if (currentCart?.items) {
      currentCart.items.forEach((item: any) => {
        this.store.dispatch(new MedusaCartActions.DeleteCartItem(item.id));
      });
    }
  }

  /**
   * Proceed to checkout
   */
  async checkout() {
    console.log('Proceeding to checkout...');

    // Navigate to checkout page
    this.router.navigate(['/customer-checkout']);
  }

  /**
   * Open payment providers selection modal
   */
  async openPaymentProvidersModal() {
    const { PaymentProvidersComponent } = await import('../../payment-providers/payment-providers.component');

    const modal = await this.modalCtrl.create({
      component: PaymentProvidersComponent,
      componentProps: {},
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.5,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.selectedProvider) {
      // Open payment modal with selected provider
      await this.openPaymentModal();
    }
  }

  /**
   * Open payment modal
   */
  async openPaymentModal() {
    const { CardPaymentModal } = await import('../../card-payment-modal/card-payment-modal');

    const modal = await this.modalCtrl.create({
      component: CardPaymentModal,
      componentProps: {
        secret_key: this.store.selectSnapshot((state: any) => state.checkout?.client_secret)
      },
      breakpoints: [0, 0.8, 1],
      initialBreakpoint: 0.8,
    });

    await modal.present();
  }

  /**
   * Continue shopping
   */
  continueShopping() {
    this.router.navigate(['/tabs/products']);
  }

  /**
   * Handle image loading errors
   */
  onImageError(event: any, item: any) {
    // Fallback to a default product image
    event.target.src = 'assets/img/product/product-1.jpg';
  }
}
