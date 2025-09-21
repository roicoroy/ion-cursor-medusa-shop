import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-test-checkout',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Test Checkout</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      <h1>Test Checkout Page</h1>
      <p>If you can see this, the routing is working!</p>
      
      <ion-button (click)="goBack()" fill="solid" color="primary">
        Go Back
      </ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButton]
})
export class TestCheckoutPage {
  
  goBack() {
    window.history.back();
  }
}
