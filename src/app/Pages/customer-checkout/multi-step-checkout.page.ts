import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonRouterOutlet } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { NavigationService } from 'src/app/shared/navigation/navigation.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-multi-step-checkout',
  templateUrl: './multi-step-checkout.page.html',
  styleUrls: ['./multi-step-checkout.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonButtons,
    IonTitle,
    IonContent,
    IonHeader,
    IonToolbar,
    CommonModule,
    FormsModule,
    RouterModule,
    IonRouterOutlet
  ]
})
export class MultiStepCheckoutPage implements OnDestroy {

  private nav = inject(NavigationService);
  private readonly ngUnsubscribe = new Subject<void>();

  constructor() {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  
  back() {
    this.nav.goBack();
  }
}
