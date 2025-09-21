import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonContent, IonBackButton, IonList, IonItem, IonLabel, IonListHeader, IonTitle } from '@ionic/angular/standalone';
import { MedusaService } from '../../../shared/api/medusa.service';
import { MedusaOrder } from '../../../shared/interfaces/medusa-order';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ShortNumber } from "../../../shared/pipes/short-number/short-number.pipe";
import { MedusaCurrency } from "../../../shared/pipes/medusa-currency/medusa-currency.pipe";

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.page.html',
  styleUrls: ['./customer-orders.page.scss'],
  standalone: true,
  imports: [IonListHeader,
    IonLabel,
    IonItem,
    IonList,
    IonBackButton,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    CommonModule,
    IonContent,
    ShortNumber, 
    MedusaCurrency]
})
export class CustomerOrdersPage implements OnInit, OnDestroy {
  storeOrders!: MedusaOrder[];
  private router = inject(Router);
  private medusaApi = inject(MedusaService);
  private readonly ngUnsubscribe = new Subject();

  ngOnInit(): void {
    this.medusaApi.retriveOrdersList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((orders: any) => {
        this.storeOrders = orders.orders;
      });
  }
  // 
  navigateOrderDetails(order: any) {
    this.router.navigate(
      ['/order-review'],
      { queryParams: { orderId: JSON.stringify(order.id), payment: false } }
    );

  }
  back() {
    this.router.navigate(
      ['/welcome']
    );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
