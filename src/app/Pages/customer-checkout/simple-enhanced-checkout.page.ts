import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonLabel, IonItem, IonList, IonRadio, IonRadioGroup, IonCheckbox, IonTextarea, IonSelect, IonSelectOption, IonProgressBar } from '@ionic/angular/standalone';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-simple-enhanced-checkout',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button (click)="goBack()">
            <ion-icon name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Simple Enhanced Checkout</ion-title>
      </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <!-- Progress Bar -->
    <ion-progress-bar [value]="(currentStep + 1) / 4" color="primary"></ion-progress-bar>
    
    <!-- Step Indicator -->
    <div class="step-indicator">
      <div class="step" [class.active]="currentStep === 0">1. Customer Info</div>
      <div class="step" [class.active]="currentStep === 1">2. Addresses</div>
      <div class="step" [class.active]="currentStep === 2">3. Shipping & Payment</div>
      <div class="step" [class.active]="currentStep === 3">4. Review</div>
    </div>

    <!-- Form -->
    <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()">
      <!-- Step 1: Customer Information -->
      <div *ngIf="currentStep === 0">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Customer Information</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label position="stacked">Email</ion-label>
              <ion-input formControlName="email" type="email"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">First Name</ion-label>
              <ion-input formControlName="firstName"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Last Name</ion-label>
              <ion-input formControlName="lastName"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Phone</ion-label>
              <ion-input formControlName="phone" type="tel"></ion-input>
            </ion-item>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Step 2: Addresses -->
      <div *ngIf="currentStep === 1">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Shipping Address</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label position="stacked">Address Line 1</ion-label>
              <ion-input formControlName="address1"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">City</ion-label>
              <ion-input formControlName="city"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Postal Code</ion-label>
              <ion-input formControlName="postalCode"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Country</ion-label>
              <ion-select formControlName="country">
                <ion-select-option value="gb">United Kingdom</ion-select-option>
                <ion-select-option value="us">United States</ion-select-option>
                <ion-select-option value="ca">Canada</ion-select-option>
              </ion-select>
            </ion-item>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Step 3: Shipping & Payment -->
      <div *ngIf="currentStep === 2">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Shipping Method</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-radio-group formControlName="shippingMethod">
              <ion-item>
                <ion-radio value="standard"></ion-radio>
                <ion-label>Standard Shipping (3-5 days)</ion-label>
              </ion-item>
              <ion-item>
                <ion-radio value="express"></ion-radio>
                <ion-label>Express Shipping (1-2 days)</ion-label>
              </ion-item>
            </ion-radio-group>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Payment Method</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-radio-group formControlName="paymentMethod">
              <ion-item>
                <ion-radio value="card"></ion-radio>
                <ion-label>Credit/Debit Card</ion-label>
              </ion-item>
              <ion-item>
                <ion-radio value="paypal"></ion-radio>
                <ion-label>PayPal</ion-label>
              </ion-item>
            </ion-radio-group>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Step 4: Review -->
      <div *ngIf="currentStep === 3">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Review & Complete</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p><strong>Email:</strong> {{ checkoutForm.get('email')?.value }}</p>
            <p><strong>Name:</strong> {{ checkoutForm.get('firstName')?.value }} {{ checkoutForm.get('lastName')?.value }}</p>
            <p><strong>Address:</strong> {{ checkoutForm.get('address1')?.value }}, {{ checkoutForm.get('city')?.value }}</p>
            <p><strong>Shipping:</strong> {{ checkoutForm.get('shippingMethod')?.value }}</p>
            <p><strong>Payment:</strong> {{ checkoutForm.get('paymentMethod')?.value }}</p>
            
            <ion-item>
              <ion-checkbox formControlName="termsAccepted"></ion-checkbox>
              <ion-label>I agree to the terms and conditions</ion-label>
            </ion-item>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Navigation Buttons -->
      <div class="navigation-buttons">
        <ion-button 
          *ngIf="currentStep > 0"
          (click)="previousStep()" 
          fill="outline">
          Previous
        </ion-button>

        <ion-button 
          *ngIf="currentStep < 3"
          (click)="nextStep()" 
          [disabled]="!canProceedToNextStep()"
          fill="solid">
          Next
        </ion-button>

        <ion-button 
          *ngIf="currentStep === 3"
          type="submit"
          [disabled]="!checkoutForm.valid"
          fill="solid" 
          color="success">
          Complete Order
        </ion-button>
      </div>
    </form>
  </ion-content>
  `,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonLabel,
    IonItem,
    IonList,
    IonRadio,
    IonRadioGroup,
    IonCheckbox,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonProgressBar
  ]
})
export class SimpleEnhancedCheckoutPage {
  checkoutForm: FormGroup;
  currentStep = 0;

  constructor() {
    const fb = inject(FormBuilder);
    
    this.checkoutForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      address1: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['gb', Validators.required],
      shippingMethod: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      termsAccepted: [false, Validators.requiredTrue]
    });
  }

  nextStep(): void {
    if (this.canProceedToNextStep()) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  canProceedToNextStep(): boolean {
    switch (this.currentStep) {
      case 0:
        return this.checkoutForm.get('email')!.valid && 
               this.checkoutForm.get('firstName')!.valid && 
               this.checkoutForm.get('lastName')!.valid && 
               this.checkoutForm.get('phone')!.valid;
      case 1:
        return this.checkoutForm.get('address1')!.valid && 
               this.checkoutForm.get('city')!.valid && 
               this.checkoutForm.get('postalCode')!.valid && 
               this.checkoutForm.get('country')!.valid;
      case 2:
        return this.checkoutForm.get('shippingMethod')!.valid && 
               this.checkoutForm.get('paymentMethod')!.valid;
      default:
        return false;
    }
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      console.log('Form submitted:', this.checkoutForm.value);
      alert('Order completed successfully!');
    }
  }

  goBack(): void {
    window.history.back();
  }
}
