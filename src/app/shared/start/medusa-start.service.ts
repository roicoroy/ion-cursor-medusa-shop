import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { RegionsActions } from 'src/app/store/regions/regions.actions';
import { ProductsActions } from 'src/app/store/products/products.actions';

@Injectable({
  providedIn: 'root'
})
export class MedusaStartService {

  private store = inject(Store);

  async medusaInit() {
    try {
      // Load regions first
      await this.store.dispatch(new RegionsActions.GetCountries());
      
      // Then load products and categories
      this.store.dispatch(new ProductsActions.GetProductsId());
      this.store.dispatch(new ProductsActions.GetCategories());
    } catch (error) {
      console.error('Error during Medusa initialization:', error);
      // Fallback to basic products loading if regions fail
      this.store.dispatch(new ProductsActions.GetProducts());
    }
  }
}
