import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { MedusaCustomer, MedusaProduct } from '../shared/interfaces/customer-product.interface';
import { MedusaCategory } from '../shared/interfaces/medusa-categories.interface';
import { ProductsState } from './products/products.state';
import { MedusaCart } from '../shared/interfaces/medusa-cart.interface';
import { MedusaCartState } from './medusa-cart/medusa-cart.state';
import { NewCountryListModel, RegionsState } from './regions/regions.state';
import { CheckoutState } from './checkout/checkout.state';
import { AuthState } from './auth/auth.state';
import { ThemeState } from './theme/theme.state';

export interface IAppFacadeState {
    isDarkMode: boolean,
    isLoggedIn: boolean,
    token: string;
    products: MedusaProduct[];
    cart: MedusaCart | null;
    defaultRegions: NewCountryListModel;
    secret_key: string;
    customer: MedusaCustomer | null,
    region_list: NewCountryListModel[];
    productsCategories: MedusaCategory[];
    selectedCategory: any;
    selectedProduct: MedusaProduct
}

@Injectable({
    providedIn: 'root'
})
export class AppFacade {
    isDarkMode$: Observable<boolean> = inject(Store).select(ThemeState.isDarkMode);

    isLoggedIn$: Observable<boolean> = inject(Store).select(AuthState.isLoggedIn);

    token$: Observable<string> = inject(Store).select(AuthState.getToken);

    products$: Observable<MedusaProduct[]> = inject(Store).select(ProductsState.getProductList);

    productsCategories$: Observable<MedusaCategory[]> = inject(Store).select(ProductsState.getProductsCategories);

    selectedCategory$: Observable<any[]> = inject(Store).select(ProductsState.getSelectgedCategory);

    cart$: Observable<MedusaCart | null> = inject(Store).select(MedusaCartState.getMedusaCart);

    defaultRegions$: Observable<NewCountryListModel> = inject(Store).select(RegionsState.getDefaultRegion);

    secret_key$: Observable<string> = inject(Store).select(CheckoutState.getSecretKey);

    customer$: Observable<MedusaCustomer | null> = inject(Store).select(AuthState.getCustomer);

    region_list$: Observable<NewCountryListModel[]> = inject(Store).select(RegionsState.getRegionList);

    selectedProduct$: Observable<MedusaProduct> = inject(Store).select(ProductsState.getSelectedProduct);

    readonly viewState$: Observable<IAppFacadeState>;
    // 
    constructor() {
        this.viewState$ = combineLatest(
            [
                this.isDarkMode$,
                this.isLoggedIn$,
                this.token$,
                this.products$,
                this.cart$,
                this.defaultRegions$,
                this.secret_key$,
                this.customer$,
                this.region_list$,
                this.productsCategories$,
                this.selectedCategory$,
                this.selectedProduct$
            ]
        ).pipe(
            map((
                [
                    isDarkMode,
                    isLoggedIn,
                    token,
                    products,
                    cart,
                    defaultRegions,
                    secret_key,
                    customer,
                    region_list,
                    productsCategories,
                    selectedCategory,
                    selectedProduct
                ]
            ) => ({
                isDarkMode,
                isLoggedIn,
                token,
                products,
                cart,
                defaultRegions,
                secret_key,
                customer,
                region_list,
                productsCategories,
                selectedCategory,
                selectedProduct
            }))
        );
    }
}
