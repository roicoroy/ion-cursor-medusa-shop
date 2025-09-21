import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { ReturnsState } from '../../../store/returns/returns.state';
import { ReturnsActions } from '../../../store/returns/returns.actions';
import { MedusaReturn } from '../../../shared/interfaces/medusa-return.interface';
import { MedusaCurrency } from '../../../shared/pipes/medusa-currency/medusa-currency.pipe';

@Component({
  selector: 'app-returns-list',
  templateUrl: './returns-list.page.html',
  styleUrls: ['./returns-list.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, MedusaCurrency]
})
export class ReturnsListPage implements OnInit, OnDestroy {
  returns$: Observable<MedusaReturn[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private router: Router
  ) {
    this.returns$ = this.store.select(ReturnsState.getReturns);
    this.loading$ = this.store.select(ReturnsState.getLoading);
    this.error$ = this.store.select(ReturnsState.getError);
  }

  ngOnInit() {
    this.loadReturns();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReturns() {
    this.store.dispatch(new ReturnsActions.GetReturns());
  }

  viewReturn(returnItem: MedusaReturn) {
    this.store.dispatch(new ReturnsActions.SetSelectedReturn(returnItem));
    this.router.navigate(['/return-details', returnItem.id]);
  }

  createReturn() {
    this.router.navigate(['/create-return']);
  }

  goBack() {
    this.router.navigate(['/tabs/profile']);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'requested':
        return 'warning';
      case 'received':
        return 'success';
      case 'requires_action':
        return 'danger';
      case 'canceled':
        return 'medium';
      default:
        return 'primary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'requested':
        return 'Requested';
      case 'received':
        return 'Received';
      case 'requires_action':
        return 'Action Required';
      case 'canceled':
        return 'Canceled';
      default:
        return status;
    }
  }
} 