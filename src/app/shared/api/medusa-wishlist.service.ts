import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MedusaCustomer } from 'src/app/shared/interfaces/customer-product.interface';
import { environment } from 'src/environments/environment';

export interface IMedusaWishListPostData {
    variant_id: string;
    quantity: number;
    metadata?: any;
}

@Injectable({
    providedIn: 'root'
})
export class MedusaWishListService {

    private http = inject(HttpClient);

    // The POST API Route at /store/customers/<CUSTOMER_ID>/wishlist allows customers to add items to their existing or new wishlist, where <CUSTOMER_ID> is the ID of the customer. It accepts the following body parameters:
    // variant_id: a string indicating the ID of the product variant to add to the wishlist.
    // quantity: (optional) a number indicating the quantity of the product variant.
    // metadata: (optional) any metadata to attach to the wishlist item.
    // The request returns the full customer object. The wishlist is available at customer.metadata.wishlist, where its value is an array of items.
    createWishlist(customerId: string, postData: IMedusaWishListPostData) {
        const url = `${environment.MEDUSA_API_BASE_PATH}/store/customers/${customerId}/wishlist`;

        return this.http.post<MedusaCustomer>(url, postData).pipe(
            catchError(err => {
                const error = throwError(() => new Error(JSON.stringify(err)));
                return error;
            }),
        );
    }

    // The DELETE API Route at /store/customers/<CUSTOMER_ID>/wishlist allows customers to delete items from their wishlist, where <CUSTOMER_ID> is the ID of the customer.
    // The API Route accepts one request body parameter index, which indicates the index of the item in the customer.metadata.wishlist array.
    // The request returns the full customer object. The wishlist is available at customer.metadata.wishlist, where its value is an array of items.
    deleteItemFromWishlist(customerId: string, postData: any) {
        const url = `${environment.MEDUSA_API_BASE_PATH}/store/customers/${customerId}/wishlist`;

        return this.http.delete(url, postData).pipe(
            catchError(err => {
                const error = throwError(() => new Error(JSON.stringify(err)));
                return error;
            }),
        );
    }

    generateWishlistToken(customerId: string) {
        const url = `${environment.MEDUSA_API_BASE_PATH}/store/customers/${customerId}/wishlist/share-token`;

        return this.http.post<MedusaCustomer>(url, {}).pipe(
            catchError(err => {
                const error = throwError(() => new Error(JSON.stringify(err)));
                return error;
            }),
        );
    }

    getWishlistWithToken(token: string) {
        const url = `${environment.MEDUSA_API_BASE_PATH}/wishlists/${token}`;

        return this.http.get<MedusaCustomer>(url).pipe(
            catchError(err => {
                const error = throwError(() => new Error(JSON.stringify(err)));
                return error;
            }),
        );
    }
}
