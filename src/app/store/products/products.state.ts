import { Injectable, inject } from '@angular/core';
import { State, Action, Selector, StateContext, Store } from '@ngxs/store';
import { ProductsActions } from './products.actions';
import { MedusaService } from '../../shared/api/medusa.service';
import { MedusaProduct } from '../../shared/interfaces/customer-product.interface'
import { Observable, take, tap } from 'rxjs';
import { MedusaCategory } from '../../shared/interfaces/medusa-categories.interface';
import { RegionsState } from '../regions/regions.state';
import { MedusaVariant } from '../../shared/interfaces/medusa-variant.interface';

export interface MedusaProductsResponse {
    count: number,
    limit: number,
    offset: number,
    products: MedusaProduct[],
}
export interface MedusaProductsCategoriesResponse {
    count: number,
    limit: number,
    offset: number,
    product_categories: MedusaCategory[],
}
export interface ProductsStateModel {
    selectedProduct: MedusaProduct | any;
    selectedVariant: MedusaVariant | any;
    products: MedusaProduct[];
    categories: MedusaCategory[];
    selectedCategory: MedusaProduct[];
}

@State<ProductsStateModel>({
    name: 'products',
    defaults: {
        selectedProduct: null,
        selectedVariant: null,
        selectedCategory: [],
        products: [],
        categories: [],
    }
})
@Injectable()
export class ProductsState {
    private medusaApi = inject(MedusaService);

    private store = inject(Store);

    @Selector()
    static getProductList(state: ProductsStateModel): MedusaProduct[] {
        return state.products;
    }

    @Selector()
    static getSelectedProduct(state: ProductsStateModel): MedusaProduct {
        return state.selectedProduct;
    }

    @Selector()
    static getSelectedVariant(state: ProductsStateModel) {
        return state.selectedVariant;
    }

    @Selector()
    static getProductsCategories(state: ProductsStateModel): MedusaCategory[] {
        return state.categories;
    }

    @Selector()
    static getSelectgedCategory(state: ProductsStateModel): MedusaProduct[] {
        return state.selectedCategory;
    }

    @Action(ProductsActions.GetProductsId)
    getProductsId(ctx: StateContext<ProductsStateModel>) {
        const defaultRegion = this.store.selectSnapshot(RegionsState.getDefaultRegion);
        
        if (defaultRegion?.region_id) {
            const response$ = this.medusaApi.medusaProductsList(defaultRegion.region_id);
            response$.pipe(
                take(1)
            ).subscribe({
                next: (response: MedusaProductsResponse) => {
                    ctx.patchState({
                        products: [...response.products],
                    });
                },
                error: (error) => {
                    console.error('Error loading products with region:', error);
                    // Fallback to basic products loading
                    this.store.dispatch(new ProductsActions.GetProducts());
                }
            });
        } else {
            // If no region is available, fallback to basic products loading
            this.store.dispatch(new ProductsActions.GetProducts());
        }
    }

    @Action(ProductsActions.GetProducts)
    getProducts(ctx: StateContext<ProductsStateModel>) {
        const state = ctx.getState();
        
        // Always load products when this action is called
        const response$ = this.medusaApi.productsRetrieve();
        response$.pipe(
            take(1)
        ).subscribe({
            next: (response: MedusaProductsResponse) => {
                ctx.patchState({
                    products: [...response.products],
                });
            },
            error: (error) => {
                console.error('Error loading products:', error);
                // Set empty array to prevent infinite loading
                ctx.patchState({
                    products: [],
                });
            }
        });
    }

    @Action(ProductsActions.GetSingleProduct)
    getSingleProduct(ctx: StateContext<ProductsStateModel>, { productId }: ProductsActions.GetSingleProduct) {
        const selectedRegion = this.store.selectSnapshot(RegionsState.getDefaultRegion);
        this.medusaApi.showProductVariantPrice(productId, selectedRegion?.region_id)
            .subscribe((response: any) => {
                ctx.patchState({
                    selectedProduct: response?.product,
                });
            });
    }

    @Action(ProductsActions.GetCategories)
    getCategories(ctx: StateContext<ProductsStateModel>) {
        const state = ctx.getState();
        if (state.categories.length == 0) {
            const response$ = this.medusaApi.getCategories();
            response$.pipe(
                // take(1)
            ).subscribe((response: MedusaProductsCategoriesResponse) => {
                // console.log(response)
                ctx.patchState({
                    categories: [...response.product_categories],
                });
            });
        }
    }
    // 
    @Action(ProductsActions.GetCategory)
    getCategory(ctx: StateContext<ProductsStateModel>, { categoryId }: ProductsActions.GetCategory) {
        // console.log(categoryId);
        const response$ = this.medusaApi.getCategory(categoryId);
        response$.pipe(
            take(1)
        ).subscribe((response: any) => {
            ctx.patchState({
                selectedCategory: response.products
            });
        });
    }
    //
    @Action(ProductsActions.addSelectedProduct)
    addProductToState(ctx: StateContext<ProductsStateModel>, { payload, region_id }: ProductsActions.addSelectedProduct): Observable<any> {
        return this.medusaApi.showProductVariantPrice(payload.id, region_id)
            .pipe(
                tap((response: any) => {
                    return ctx.patchState({
                        selectedProduct: response.product,
                    });
                })
            );
    }
    // 
    @Action(ProductsActions.clearSelectedProduct)
    clearProductFromState(ctx: StateContext<ProductsStateModel>): void {
        ctx.patchState({
            selectedProduct: undefined,
        });
    }
    // 
    @Action(ProductsActions.addSelectedVariant)
    addVariantToState(ctx: StateContext<ProductsStateModel>, { payload }: ProductsActions.addSelectedVariant) {
        ctx.patchState({
            selectedVariant: payload,
        });
    }
    // 
    @Action(ProductsActions.clearSelectedVariant)
    clearVariantFromState(ctx: StateContext<ProductsStateModel>) {
        ctx.patchState({
            selectedVariant: undefined,
        });
    }

    @Action(ProductsActions.ProductsLogOut)
    productsLogOut(ctx: StateContext<ProductsStateModel>) {
        ctx.patchState({
            selectedProduct: undefined,
            selectedVariant: undefined,
            products: [],
            categories: []
        });
    }
}
