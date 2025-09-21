import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonBadge, IonSegment, IonSegmentButton, IonLabel, IonList, IonItem, IonThumbnail, ModalController } from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, inject, OnDestroy } from '@angular/core';
import { MedusaProduct } from '../../../../shared/interfaces/customer-product.interface';
import { AppFacade } from '../../../../store/app.facade';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { MedusaCurrency } from '../../../../shared/pipes/medusa-currency/medusa-currency.pipe';
import { WishlistService } from '../../../../shared/services/wishlist.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonBadge,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonItem,
    IonThumbnail,
    MedusaCurrency
  ]
})
export class ProductListComponent implements OnDestroy {
  products$: Observable<MedusaProduct[]> = inject(AppFacade).products$;
  private navigationsService = inject(NavigationService);
  private modalCtrl = inject(ModalController);
  private wishlistService = inject(WishlistService);
  private readonly ngUnsubscribe = new Subject();

  viewMode: 'grid' | 'list' = 'grid';

  detailsPage(product: MedusaProduct): void {
    this.navigationsService.navigateWithParams('/product-details', { productId: product.id });
  }

  addToWishlist(product: MedusaProduct, event: Event): void {
    event.stopPropagation(); // Prevent triggering the details page navigation
    this.wishlistService.addToWishlist(product)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((success) => {
        if (success) {
          console.log('Product added to wishlist successfully');
        }
      });
  }

  isInWishlist(product: MedusaProduct): boolean {
    return this.wishlistService.isInWishlist(product.id);
  }

  async openLoginModal(): Promise<void> {
    try {
      const { LoginComponent } = await import('../../../../Components/auth-component/login/login.component');
      const modal = await this.modalCtrl.create({
        component: LoginComponent,
        cssClass: 'auth-modal',
        backdropDismiss: false,
        showBackdrop: true
      });

      await modal.present();

      // Listen for modal dismissal
      modal.onWillDismiss().then(() => {
      });
    } catch (error: any) {
      console.error('Error opening login modal:', error);
    }
  }

  onViewModeChange(event: any): void {
    this.viewMode = event.detail.value;
  }

  quickView(product: MedusaProduct, event: Event): void {
    event.stopPropagation();
    // Implement quick view functionality
    console.log('Quick view for product:', product.title);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
