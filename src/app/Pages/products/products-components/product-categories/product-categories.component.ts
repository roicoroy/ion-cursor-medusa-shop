import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { MedusaProduct } from '../../../../shared/interfaces/customer-product.interface';
import { ProductsActions } from '../../../../store/products/products.actions';
import { IAppFacadeState, AppFacade } from '../../../../store/app.facade';
import { IonicModule } from '@ionic/angular';
import { fade } from '../../../../shared/animations/animations';
import { MedusaCategory } from '../../../../shared/interfaces/medusa-categories.interface';
import { ProductsState } from '../../../../store/products/products.state';

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.component.scss'],
  standalone: true,
  animations: [
    fade()
  ],
  imports: [
    IonicModule,
    CommonModule,
  ]
})
export class ProductCategoriesComponent implements OnInit, OnDestroy {
  selectedCategory$: Observable<MedusaCategory[]> = inject(Store).select(ProductsState.getProductsCategories);
  productsCategories$: Observable<MedusaCategory[]> = inject(Store).select(ProductsState.getProductsCategories);
  viewState$!: Observable<IAppFacadeState>;
  
  productsList: MedusaProduct[] = [];
  allProductsList: MedusaProduct[] = [];
  productCategories: MedusaCategory[] = [];
  type: string | null = null;

  private productCategory!: MedusaCategory;
  private navigationsService = inject(NavigationService);
  private router = inject(Router);
  private facade = inject(AppFacade);
  private store = inject(Store);
  private readonly ngUnsubscribe = new Subject();

  ngOnInit() {
    this.viewState$ = this.facade.viewState$;
    this.viewState$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (p) => {
          console.log('state', p);
          if(p.productsCategories){
            this.productCategories = p.productsCategories;
          }
        },
      });
    this.productCategory = this.productCategories[0]
    this.navigateSegment(this.productCategory);
  }

  navigateSegment(category?: MedusaCategory) {
    if (category) {
      this.type = category.id;
      this.store.dispatch(new ProductsActions.GetCategory(category.id));
    }
  }

  all() {
    this.type = 'all';
  }

  homePage() {
    this.navigationsService.navigateFlip('/home');
  }

  detailsPage(product: MedusaProduct) {
    this.router.navigate(['/product-details'], { queryParams: { productId: product.id } });
  }

  segmentChanged(ev: any) {
    this.type = ev.target.value;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
