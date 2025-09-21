import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { WishlistService } from 'src/app/shared/services/wishlist.service';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonBackButton, IonList, IonItem, IonLabel, IonThumbnail, IonImg, IonText, IonSpinner } from "@ionic/angular/standalone";
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthState } from '../../store/auth/auth.state';
import { MedusaProduct } from '../../shared/interfaces/customer-product.interface';
import { MedusaCurrency } from '../../shared/pipes/medusa-currency/medusa-currency.pipe';

@Component({
  selector: 'app-wishlist-page',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
  standalone: true,
  imports: [
    IonHeader, 
    IonContent,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonThumbnail,
    IonImg,
    IonText,
    IonSpinner,
    CommonModule,
    MedusaCurrency
  ]
})
export class WishlistPage implements OnInit, OnDestroy {
  wishlistProducts$: Observable<MedusaProduct[]>;
  isLoggedIn$: Observable<boolean>;
  loading = false;

  private store = inject(Store);
  private wishlistService = inject(WishlistService);
  private router = inject(Router);
  private readonly ngUnsubscribe = new Subject<void>();

  constructor() {
    this.wishlistProducts$ = this.wishlistService.wishlistProducts$;
    this.isLoggedIn$ = this.store.select(AuthState.isLoggedIn);
  }

  ngOnInit(): void {
    // Load wishlist when component initializes
    this.wishlistService.loadWishlistFromCustomer();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  removeFromWishlist(index: number): void {
    this.loading = true;
    this.wishlistService.removeFromWishlist(index)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.loading = false;
      });
  }

  addToCart(wishlistItem: any): void {
    this.wishlistService.addWishlistItemToCart(wishlistItem);
  }

  goToProduct(product: MedusaProduct): void {
    if (product.handle) {
      this.router.navigate(['/products', product.handle]);
    }
  }

  goToCart(): void {
    this.router.navigate(['/tabs/cart']);
  }

  goBack(): void {
    this.router.navigate(['/tabs']);
  }
}
