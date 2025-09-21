import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonCard, IonCardContent, IonRow, IonCol, IonBackButton, IonText, IonImg, IonCardHeader, IonCardTitle, IonBadge, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { MedusaCartActions } from '../../../store/medusa-cart/medusa-cart.actions';
import { Observable, Subject, takeUntil } from 'rxjs';
import { NavigationService } from '../../../shared/navigation/navigation.service';
import { MedusaOrder } from '../../../shared/interfaces/medusa-order';
import { ActivatedRoute, Params } from '@angular/router';
import { MedusaCartState } from '../../../store/medusa-cart/medusa-cart.state';
import { MedusaCurrency } from "../../../shared/pipes/medusa-currency/medusa-currency.pipe";
import { ShortNumber } from "../../../shared/pipes/short-number/short-number.pipe";
import { Router } from '@angular/router';

export interface OrderIdParam {
  orderId: string
}
@Component({
  selector: 'app-order-review',
  templateUrl: './order-review.page.html',
  styleUrls: ['./order-review.page.scss'],
  standalone: true,
  imports: [IonText, IonBackButton, IonCol, IonRow, IonCardContent, IonCard, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonCardHeader, IonCardTitle, IonBadge, IonButton, IonIcon, CommonModule, FormsModule, MedusaCurrency, ShortNumber]
})
export class OrderReviewPage implements OnInit, OnDestroy, AfterViewInit {

  completedOrder$: Observable<MedusaOrder | null> = inject(Store).select(MedusaCartState.getCompleterdOrder);
  orderId: string = '';
  fromPayment: boolean = false;
  order!: MedusaOrder;

  private store = inject(Store);
  private nav = inject(NavigationService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private readonly ngUnsubscribe = new Subject();

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params: Params) => {
        this.orderId = JSON.parse(params['orderId'] || '""');
        this.fromPayment = JSON.parse(params['payment'] || 'false');
        if (this.orderId) {
          this.store.dispatch(new MedusaCartActions.RetriveCompletedOrder(this.orderId))
        }
      });
  }

  async ngAfterViewInit() {
    this.completedOrder$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((state: MedusaOrder | null) => {
        if (state) {
          this.order = state;
        }
      });
  }

  home() {
    this.nav.navigateTo('welcome');
    this.store.dispatch(new MedusaCartActions.LogOut());
  }

  onImageError(event: any) {
    // Fallback to a default product image
    event.target.src = 'assets/img/product/product-1.jpg';
  }

  createReturn() {
    this.router.navigate(['/create-return'], { 
      queryParams: { orderId: this.order.id } 
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
      case 'captured':
        return 'success';
      case 'pending':
        return 'warning';
      case 'canceled':
        return 'danger';
      case 'requires_action':
        return 'warning';
      default:
        return 'medium';
    }
  }

  canCreateReturn(status: string): boolean {
    // Allow returns for completed, captured, or fulfilled orders
    return ['completed', 'captured', 'fulfilled'].includes(status);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
