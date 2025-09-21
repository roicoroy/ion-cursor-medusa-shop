import { Injectable, inject } from '@angular/core';
import { MedusaProduct } from '../interfaces/customer-product.interface';
import { MedusaWishListService, IMedusaWishListPostData } from '../api/medusa-wishlist.service';
import { Store } from '@ngxs/store';
import { Observable, BehaviorSubject, tap, catchError, of, map } from 'rxjs';
import { AuthState } from '../../store/auth/auth.state';
import { MedusaCartActions } from '../../store/medusa-cart/medusa-cart.actions';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private store = inject(Store);
  private medusaWishListService = inject(MedusaWishListService);
  private alertService = inject(AlertService);
  
  private wishlistProductsSubject = new BehaviorSubject<MedusaProduct[]>([]);
  public wishlistProducts$ = this.wishlistProductsSubject.asObservable();

  /**
   * Get wishlist products from customer metadata
   */
  getWishlistProducts(): MedusaProduct[] {
    return this.wishlistProductsSubject.value;
  }

  /**
   * Load wishlist from customer metadata
   */
  loadWishlistFromCustomer(): void {
    const customer = this.store.selectSnapshot(AuthState.getCustomer);
    if (customer?.metadata && typeof customer.metadata === 'object' && 'wishlist' in customer.metadata) {
      const wishlist = (customer.metadata as any).wishlist;
      if (Array.isArray(wishlist)) {
        // Convert wishlist items to MedusaProduct format
        const wishlistProducts = this.convertWishlistToProducts(wishlist);
        this.wishlistProductsSubject.next(wishlistProducts);
      } else {
        this.wishlistProductsSubject.next([]);
      }
    } else {
      this.wishlistProductsSubject.next([]);
    }
  }

  /**
   * Add product to wishlist via Medusa API
   */
  addToWishlist(product: MedusaProduct, variantId?: string): Observable<boolean> {
    const customer = this.store.selectSnapshot(AuthState.getCustomer);
    
    if (!customer?.id) {
      this.alertService.presentSimpleAlert('Please log in to add items to your wishlist');
      return of(false);
    }

    if (!variantId && product.variants && product.variants.length > 0) {
      variantId = product.variants[0].id;
    }

    if (!variantId) {
      this.alertService.presentSimpleAlert('No variant available for this product');
      return of(false);
    }

    const postData: IMedusaWishListPostData = {
      variant_id: variantId,
      quantity: 1,
      metadata: {
        product_id: product.id,
        product_title: product.title,
        product_thumbnail: product.thumbnail,
        product_handle: product.handle
      }
    };

    return this.medusaWishListService.createWishlist(customer.id, postData).pipe(
      tap((updatedCustomer) => {
        // Reload wishlist
        this.loadWishlistFromCustomer();
        
        this.alertService.presentSimpleAlert('Product added to wishlist successfully!');
      }),
      map(() => true),
      catchError((error) => {
        console.error('Error adding to wishlist:', error);
        this.alertService.presentSimpleAlert('Failed to add product to wishlist');
        return of(false);
      })
    );
  }

  /**
   * Remove product from wishlist via Medusa API
   */
  removeFromWishlist(index: number): Observable<boolean> {
    const customer = this.store.selectSnapshot(AuthState.getCustomer);
    
    if (!customer?.id) {
      this.alertService.presentSimpleAlert('Please log in to manage your wishlist');
      return of(false);
    }

    return this.medusaWishListService.deleteItemFromWishlist(customer.id, { index }).pipe(
      tap(() => {
        // Reload wishlist
        this.loadWishlistFromCustomer();
        
        this.alertService.presentSimpleAlert('Product removed from wishlist successfully!');
      }),
      map(() => true),
      catchError((error) => {
        console.error('Error removing from wishlist:', error);
        this.alertService.presentSimpleAlert('Failed to remove product from wishlist');
        return of(false);
      })
    );
  }

  /**
   * Check if product is in wishlist
   */
  isInWishlist(productId: string): boolean {
    return this.wishlistProductsSubject.value.some(p => p.id === productId);
  }

  /**
   * Add wishlist item to cart
   */
  addWishlistItemToCart(wishlistItem: any): void {
    if (wishlistItem.variant_id) {
      this.store.dispatch(new MedusaCartActions.AddToMedusaCart({
        id: wishlistItem.variant_id,
        product_id: wishlistItem.metadata?.product_id || '',
        title: wishlistItem.metadata?.product_title || 'Product',
        sku: '',
        barcode: null,
        ean: null,
        upc: null,
        variant_rank: 0,
        inventory_quantity: 0,
        allow_backorder: false,
        manage_inventory: true,
        hs_code: null,
        origin_country: null,
        mid_code: null,
        material: null,
        weight: null,
        length: null,
        height: null,
        width: null,
        metadata: null,
        options: null,
        prices: null,
        original_price: null,
        calculated_price: null,
        original_price_incl_tax: null,
        calculated_price_incl_tax: null,
        original_tax: null,
        calculated_tax: null,
        tax_rates: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null
      }));
      
      this.alertService.presentSimpleAlert('Product added to cart successfully!');
    }
  }

  /**
   * Clear wishlist
   */
  clearWishlist(): void {
    this.wishlistProductsSubject.next([]);
  }

  /**
   * Convert wishlist metadata to MedusaProduct format
   */
  private convertWishlistToProducts(wishlistItems: any[]): MedusaProduct[] {
    return wishlistItems.map((item, index) => ({
      id: item.metadata?.product_id || `wishlist-${index}`,
      title: item.metadata?.product_title || 'Product',
      thumbnail: item.metadata?.product_thumbnail || '',
      handle: item.metadata?.product_handle || '',
      description: '',
      status: 'published',
      external_id: null,
      subtitle: null,
      is_giftcard: false,
      discountable: true,
      collection_id: null,
      type_id: null,
      weight: 0,
      length: null,
      height: null,
      width: null,
      hs_code: null,
      origin_country: null,
      mid_code: null,
      material: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
      metadata: item.metadata,
      profile_id: '',
      collection: null,
      images: [],
      options: [],
      profiles: [],
      tags: [],
      type: null,
      variants: [],
      // Add wishlist-specific properties
      wishlist_index: index,
      variant_id: item.variant_id,
      quantity: item.quantity
    }));
  }
} 