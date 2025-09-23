import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable, Subject, takeUntil, take } from 'rxjs';
import { Store } from '@ngxs/store';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, IonContent, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { ProductsActions } from 'src/app/store/products/products.actions';
import Swiper from 'swiper';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MedusaProduct } from 'src/app/shared/interfaces/customer-product.interface';
import { SharedModule } from 'src/app/shared';
import { MedusaProductDetailsWrapperComponent } from './medusa-product-details-wrapper/medusa-product-details-wrapper.component';
import { IAppFacadeState, AppFacade } from 'src/app/store/app.facade';
import { LoadingService } from 'src/app/shared/loading/loading.service';
import { AppFooterComponent } from 'src/app/components/footer/footer.component';
import { CartButtonComponent } from 'src/app/components/medusa-cart/cart-button/cart-button.component';
import { WishlistService } from 'src/app/shared/services/wishlist.service';
import { ImageModalService } from 'src/app/shared/services/image-modal/image-modal.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
  standalone: true,
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    AppFooterComponent,
    CartButtonComponent,
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    SharedModule,
    MedusaProductDetailsWrapperComponent,
  ]
})
export class ProductDetailsPage implements OnDestroy, OnInit {

  @ViewChild('swiper') swiperRef: ElementRef | undefined;

  swiper!: Swiper;
  private alertController = inject(AlertController);

  private store = inject(Store);
  private _location = inject(Location);
  private activatedRoute = inject(ActivatedRoute);
  private wishlistService = inject(WishlistService);
  private imageModalService = inject(ImageModalService);

  private loading = inject(LoadingService);

  private readonly ngUnsubscribe = new Subject();
  private prodId!: string;

  activeImg!: string;

  selectedProd!: MedusaProduct;

  viewState$: Observable<IAppFacadeState>;
  private facade = inject(AppFacade);

  constructor() {
    this.viewState$ = this.facade.viewState$;
    this.viewState$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((vs) => {
        this.selectedProd = vs.selectedProduct;
        if (this.selectedProd && this.selectedProd.images && this.selectedProd.images.length > 0) {
          this.activeImg = this.selectedProd.images[0].url;
          this.handleImageActive(this.activeImg);
        }
      });
  }

  async ngOnInit() {
    await this.loading.presentLoading();

    this.activatedRoute.queryParams
      .pipe(take(1))
      .subscribe((params: any) => {
        const productId = params['productId'];
        if (productId) {
          this.prodId = productId;
          this.store.dispatch(new ProductsActions.GetSingleProduct(this.prodId));
        } else {
          // Optionally handle missing productId
          // e.g., show an error or navigate away
        }
        this.loading.dismissLoading();
      });
  }

  handleImageActive(url: string | any) {
    this.activeImg = '';
    this.activeImg = url;
  }

  openImage(imageUrl: string) {
    this.imageModalService.openImageModal(imageUrl);
  }

  navigateBack() {
    this._location.back();
  }

  addToWishlist() {
    if (this.selectedProd) {
      this.wishlistService.addToWishlist(this.selectedProd)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((success) => {
          if (success) {
            console.log('Product added to wishlist successfully');
          }
        });
    }
  }

  isInWishlist(): boolean {
    return this.selectedProd ? this.wishlistService.isInWishlist(this.selectedProd.id) : false;
  }

  ngOnDestroy(): void {
    this.store.dispatch(new ProductsActions.clearSelectedProduct());
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
