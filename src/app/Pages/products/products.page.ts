import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonSpinner, IonIcon, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { MedusaProduct } from '../../shared/interfaces/customer-product.interface';
import { MedusaVariant } from '../../shared/interfaces/medusa-variant.interface';
import { ProductsActions } from '../../store/products/products.actions';
import { MedusaCartActions } from '../../store/medusa-cart/medusa-cart.actions';
import { AppFacade } from '../../store/app.facade';
import { RegionSelectComponent } from '../../components/region-select/region-select.component';
import { AuthActions } from '../../store/auth/auth.actions';
import { MedusaService } from '../../shared/api/medusa.service';
import { ProductListComponent } from './products-components';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonSpinner,
    IonIcon,
    IonButton,
    CommonModule,
    ProductListComponent,
    RegionSelectComponent
  ]
})
export class ProductsPage implements OnInit, OnDestroy {
  private readonly ngUnsubscribe = new Subject();

  loading = true;
  error: string | null = null;

  viewState$: Observable<any>;
  products$: Observable<MedusaProduct[]>;
  cart$: Observable<any>;

  private store = inject(Store);
  private facade = inject(AppFacade);
  private medusaApi = inject(MedusaService);

  constructor() {
    this.viewState$ = this.facade.viewState$;
    this.products$ = this.facade.products$;
    this.cart$ = this.facade.cart$;

    // Subscribe to products directly for loading state
    this.products$.subscribe((products) => {
      if (products && products.length > 0) {
        this.loading = false;
      }
    });
  }

  ngOnInit() {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  loadProducts() {
    this.error = null;

    // Dispatch action to get products
    this.store.dispatch(new ProductsActions.GetProductsId());
  }

  addToCart(variant: MedusaVariant | undefined) {
    if (variant) {
      // Dispatch action to add variant to cart using store
      this.store.dispatch(new MedusaCartActions.AddToMedusaCart(variant));
    }
  }

  async logout() {
    try {
      const isLoggedIn = this.store.selectSnapshot((state: any) => state.auth?.isLoggedIn);
      if (isLoggedIn) {
        await this.medusaApi.medusaLogout();
      }
      this.store.dispatch(new AuthActions.AuthLogout());
    } catch (error) {
      console.error('Error during logout:', error);
      // Force logout even if API call fails
      this.store.dispatch(new AuthActions.AuthLogout());
    }
  }

  getProductPrice(product: MedusaProduct): string {
    if (product.variants && product.variants.length > 0) {
      const variant = product.variants[0];
      if (variant.prices && variant.prices.length > 0) {
        const price = variant.prices[0];
        return `$${(price.amount / 100).toFixed(2)}`;
      }
    }
    return 'Price not available';
  }

  getProductImage(product: MedusaProduct): string {
    if (product.thumbnail) {
      return product.thumbnail;
    }
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    return 'assets/placeholder-product.png'; // You'll need to add this image
  }

  onProductClick(product: MedusaProduct) {
    // Dispatch action to select product
    const regionId = this.store.selectSnapshot((state: any) => state.regions?.defaultRegion?.region_id);
    this.store.dispatch(new ProductsActions.addSelectedProduct(product, regionId));
  }

  onAddToCart(product: MedusaProduct, event: Event) {
    event.stopPropagation();
    if (product.variants && product.variants.length > 0) {
      this.addToCart(product.variants[0]);
    }
  }
}
