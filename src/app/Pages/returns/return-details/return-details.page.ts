import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReturnsState } from '../../../store/returns/returns.state';
import { ReturnsActions } from '../../../store/returns/returns.actions';
import { MedusaReturn } from '../../../shared/interfaces/medusa-return.interface';
import { MedusaCurrency } from '../../../shared/pipes/medusa-currency/medusa-currency.pipe';

@Component({
  selector: 'app-return-details',
  templateUrl: './return-details.page.html',
  styleUrls: ['./return-details.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, MedusaCurrency]
})
export class ReturnDetailsPage implements OnInit, OnDestroy {
  return$: Observable<MedusaReturn | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.return$ = this.store.select(ReturnsState.getSelectedReturn);
    this.loading$ = this.store.select(ReturnsState.getLoading);
    this.error$ = this.store.select(ReturnsState.getError);
  }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const returnId = params['id'];
      if (returnId) {
        this.store.dispatch(new ReturnsActions.GetReturn(returnId));
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack() {
    this.router.navigate(['/returns']);
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

  getTimelineItems(returnItem: MedusaReturn): any[] {
    const timeline = [];
    
    if (returnItem.created_at) {
      timeline.push({
        date: returnItem.created_at,
        title: 'Return Created',
        description: 'Your return request was submitted',
        icon: 'create-outline',
        color: 'primary'
      });
    }

    if (returnItem.requested_at) {
      timeline.push({
        date: returnItem.requested_at,
        title: 'Return Requested',
        description: 'Return request has been confirmed',
        icon: 'checkmark-circle-outline',
        color: 'success'
      });
    }

    if (returnItem.received_at) {
      timeline.push({
        date: returnItem.received_at,
        title: 'Return Received',
        description: 'Items have been received',
        icon: 'bag-check-outline',
        color: 'success'
      });
    }

    return timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
} 