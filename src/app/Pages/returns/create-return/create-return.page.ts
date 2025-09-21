import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReturnsState } from '../../../store/returns/returns.state';
import { ReturnsActions } from '../../../store/returns/returns.actions';
import { MedusaCartState } from '../../../store/medusa-cart/medusa-cart.state';
import { MedusaOrder } from '../../../shared/interfaces/medusa-order';
import { ReturnReason } from '../../../shared/interfaces/medusa-return.interface';
import { MedusaCurrency } from '../../../shared/pipes/medusa-currency/medusa-currency.pipe';
import { AlertService } from '../../../shared/alert/alert.service';

@Component({
  selector: 'app-create-return',
  templateUrl: './create-return.page.html',
  styleUrls: ['./create-return.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, MedusaCurrency]
})
export class CreateReturnPage implements OnInit, OnDestroy {
  returnForm: FormGroup;
  order$: Observable<MedusaOrder | null>;
  returnReasons$: Observable<ReturnReason[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  selectedItems: { [key: string]: { selected: boolean; quantity: number; reason_id?: string; note?: string } } = {};
  
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {
    this.returnForm = this.formBuilder.group({
      return_shipping: this.formBuilder.group({
        option_id: ['', Validators.required],
        price: [0]
      }),
      no_notification: [false],
      metadata: this.formBuilder.group({
        note: ['']
      })
    });

    this.order$ = this.store.select(MedusaCartState.getCompleterdOrder);
    this.returnReasons$ = this.store.select(ReturnsState.getReturnReasons);
    this.loading$ = this.store.select(ReturnsState.getLoading);
    this.error$ = this.store.select(ReturnsState.getError);
  }

  ngOnInit() {
    this.store.dispatch(new ReturnsActions.GetReturnReasons());
    
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const orderId = params['orderId'];
      if (orderId) {
        // Load order details if needed
        // You might need to dispatch an action to load the order
      }
    });

    this.order$.pipe(takeUntil(this.destroy$)).subscribe(order => {
      if (order) {
        this.initializeSelectedItems(order);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeSelectedItems(order: MedusaOrder) {
    order.items.forEach(item => {
      this.selectedItems[item.id] = {
        selected: false,
        quantity: 0,
        reason_id: '',
        note: ''
      };
    });
  }

  toggleItemSelection(itemId: string) {
    if (this.selectedItems[itemId]) {
      this.selectedItems[itemId].selected = !this.selectedItems[itemId].selected;
      if (!this.selectedItems[itemId].selected) {
        this.selectedItems[itemId].quantity = 0;
        this.selectedItems[itemId].reason_id = '';
        this.selectedItems[itemId].note = '';
      }
    }
  }

  updateItemQuantity(itemId: string, event: any) {
    const quantity = parseInt(event.detail.value);
    if (this.selectedItems[itemId]) {
      this.selectedItems[itemId].quantity = quantity;
    }
  }

  updateItemReason(itemId: string, event: any) {
    const reasonId = event.detail.value;
    if (this.selectedItems[itemId]) {
      this.selectedItems[itemId].reason_id = reasonId;
    }
  }

  updateItemNote(itemId: string, event: any) {
    const note = event.detail.value;
    if (this.selectedItems[itemId]) {
      this.selectedItems[itemId].note = note;
    }
  }

  getSelectedItemsCount(): number {
    return Object.values(this.selectedItems).filter(item => item.selected).length;
  }

  getTotalRefundAmount(order: MedusaOrder): number {
    let total = 0;
    order.items.forEach(item => {
      if (this.selectedItems[item.id]?.selected && this.selectedItems[item.id]?.quantity > 0) {
        total += (item.unit_price * this.selectedItems[item.id].quantity);
      }
    });
    return total;
  }

  async submitReturn() {
    if (this.returnForm.invalid) {
      this.alertService.presentSimpleAlert('Please fill in all required fields');
      return;
    }

    const selectedItems = Object.entries(this.selectedItems)
      .filter(([_, item]) => item.selected && item.quantity > 0)
      .map(([itemId, item]) => ({
        item_id: itemId,
        quantity: item.quantity,
        reason_id: item.reason_id,
        note: item.note
      }));

    if (selectedItems.length === 0) {
      this.alertService.presentSimpleAlert('Please select at least one item to return');
      return;
    }

    const order = this.store.selectSnapshot(MedusaCartState.getCompleterdOrder);
    if (!order) {
      this.alertService.presentSimpleAlert('Order not found');
      return;
    }

    const returnData = {
      order_id: order.id,
      items: selectedItems,
      ...this.returnForm.value
    };

    try {
      await this.store.dispatch(new ReturnsActions.CreateReturn(returnData)).toPromise();
      this.alertService.presentSimpleAlert('Return created successfully!');
      this.router.navigate(['/returns']);
    } catch (error) {
      console.error('Error creating return:', error);
      this.alertService.presentSimpleAlert('Failed to create return. Please try again.');
    }
  }

  goBack() {
    this.router.navigate(['/returns']);
  }

  isFormValid(): boolean {
    if (this.returnForm.invalid) return false;
    
    const hasSelectedItems = Object.values(this.selectedItems).some(item => 
      item.selected && item.quantity > 0
    );
    
    return hasSelectedItems;
  }
} 