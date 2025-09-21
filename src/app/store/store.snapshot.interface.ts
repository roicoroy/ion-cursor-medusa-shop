import { ProductsState } from "./products/products.state";

export interface StoreSnapshotModel {
    products: ProductsState;
}