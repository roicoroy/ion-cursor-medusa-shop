import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonList, IonItem, IonIcon, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonThumbnail, IonImg, IonNote, IonLabel, IonProgressBar, IonInput, IonTextarea, IonCheckbox, IonRadio, IonRadioGroup, IonSelect, IonSelectOption, IonBadge, IonChip, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { Observable, Subject, takeUntil, BehaviorSubject } from 'rxjs';
import { Store } from '@ngxs/store';
import { CheckoutActions } from 'src/app/store/checkout/checkout.actions';
import { CheckoutState } from 'src/app/store/checkout/checkout.state';
import { MedusaCartState } from 'src/app/store/medusa-cart/medusa-cart.state';
import { AppFacade, IAppFacadeState } from 'src/app/store/app.facade';
import { MaterialModule } from '../forms/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { MedusaAddress } from '../../shared/interfaces/medusa-address';

export interface CheckoutFormData {
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  shippingAddress: MedusaAddress;
  billingAddress: MedusaAddress;
  shippingMethod: string;
  paymentMethod: string;
  orderNotes?: string;
  termsAccepted: boolean;
}

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonList,
    IonItem,
    IonIcon,
    IonTitle,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonThumbnail,
    IonImg,
    IonNote,
    IonLabel,
    IonProgressBar,
    IonInput,
    IonTextarea,
    IonCheckbox,
    IonRadio,
    IonRadioGroup,
    IonSelect,
    IonSelectOption,
    IonBadge,
    IonChip,
    IonGrid,
    IonRow,
    IonCol
  ]
})
export class CheckoutFormComponent implements OnInit, OnDestroy {
  @Input() initialData?: Partial<CheckoutFormData>;
  @Output() formSubmit = new EventEmitter<CheckoutFormData>();
  @Output() formStepChange = new EventEmitter<number>();

  // Form and state
  checkoutForm!: FormGroup;
  currentStep = 0;
  totalSteps = 4;
  isSubmitting = false;
  
  // Observables
  viewState$: Observable<IAppFacadeState>;
  shippingOptions$: Observable<any[]>;
  selectedShippingMethod$: Observable<any>;
  paymentProviders$: Observable<any[]>;
  cart$: Observable<any>;
  
  // Form validation state
  formErrors: { [key: string]: string } = {};
  stepValidation: boolean[] = [false, false, false, false];
  
  // Private properties
  private readonly ngUnsubscribe = new Subject<void>();
  private store: Store;
  private fb: FormBuilder;
  private facade: AppFacade;

  constructor() {
    this.store = inject(Store);
    this.fb = inject(FormBuilder);
    this.facade = inject(AppFacade);
    this.viewState$ = this.facade.viewState$;
    this.shippingOptions$ = this.store.select(CheckoutState.getShippingOptions);
    this.selectedShippingMethod$ = this.store.select(CheckoutState.getSelectedShippingMethod);
    this.paymentProviders$ = this.store.select(CheckoutState.getPaymentProviders);
    this.cart$ = this.store.select(MedusaCartState.getMedusaCart);
  }



  ngOnInit(): void {
    this.initializeForm();
    this.loadInitialData();
    this.setupFormValidation();
    this.loadShippingAndPaymentOptions();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private initializeForm(): void {
    this.checkoutForm = this.fb.group({
      customerInfo: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        phone: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]]
      }),
      shippingAddress: this.fb.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        address_1: ['', Validators.required],
        address_2: [''],
        city: ['', Validators.required],
        country_code: ['', Validators.required],
        postal_code: ['', Validators.required],
        phone: ['', Validators.required]
      }),
      billingAddress: this.fb.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        address_1: ['', Validators.required],
        address_2: [''],
        city: ['', Validators.required],
        country_code: ['', Validators.required],
        postal_code: ['', Validators.required],
        phone: ['', Validators.required]
      }),
      shippingMethod: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      orderNotes: [''],
      termsAccepted: [false, Validators.requiredTrue]
    });

    // Set up billing address same as shipping
    this.checkoutForm.get('shippingAddress')?.valueChanges.subscribe(shippingAddress => {
      if (this.checkoutForm.get('billingSameAsShipping')?.value) {
        this.checkoutForm.patchValue({
          billingAddress: { ...shippingAddress }
        });
      }
    });
  }

  private loadInitialData(): void {
    if (this.initialData) {
      this.checkoutForm.patchValue(this.initialData);
    }
  }

  private setupFormValidation(): void {
    // Monitor form validity for each step
    this.checkoutForm.valueChanges.subscribe(() => {
      this.updateStepValidation();
    });
  }

  private loadShippingAndPaymentOptions(): void {
    this.store.dispatch(new CheckoutActions.GetShippingOptions());
    this.store.dispatch(new CheckoutActions.CreatePaymentProviders());
  }

  private updateStepValidation(): void {
    const form = this.checkoutForm;
    
    // Step 1: Customer Info
    this.stepValidation[0] = form.get('customerInfo')?.valid || false;
    
    // Step 2: Addresses
    this.stepValidation[1] = form.get('shippingAddress')?.valid && 
                              form.get('billingAddress')?.valid || false;
    
    // Step 3: Shipping & Payment
    this.stepValidation[2] = form.get('shippingMethod')?.valid && 
                              form.get('paymentMethod')?.valid || false;
    
    // Step 4: Review & Terms
    this.stepValidation[3] = form.get('termsAccepted')?.value || false;
  }

  // Navigation methods
  nextStep(): void {
    if (this.canProceedToNextStep()) {
      this.currentStep++;
      this.formStepChange.emit(this.currentStep);
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.formStepChange.emit(this.currentStep);
    }
  }

  goToStep(step: number): void {
    if (this.canGoToStep(step)) {
      this.currentStep = step;
      this.formStepChange.emit(this.currentStep);
    }
  }

  canProceedToNextStep(): boolean {
    return this.stepValidation[this.currentStep];
  }

  canGoToStep(step: number): boolean {
    // Can only go to steps that are completed or the next available step
    for (let i = 0; i < step; i++) {
      if (!this.stepValidation[i]) {
        return false;
      }
    }
    return true;
  }

  // Form submission
  async onSubmit(): Promise<void> {
    if (this.checkoutForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      try {
        const formData: CheckoutFormData = this.checkoutForm.value;
        
        // Emit form data for parent component to handle
        this.formSubmit.emit(formData);
        
        // Process the checkout flow
        await this.processCheckout(formData);
        
      } catch (error) {
        console.error('Checkout error:', error);
        this.handleCheckoutError(error);
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private async processCheckout(formData: CheckoutFormData): Promise<void> {
    // This would integrate with your existing checkout flow
    // For now, we'll emit the data and let the parent handle it
    console.log('Processing checkout with data:', formData);
  }

  private handleCheckoutError(error: any): void {
    // Handle checkout errors
    console.error('Checkout processing failed:', error);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      const control = this.checkoutForm.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched();
      } else {
        control?.markAsTouched();
      }
    });
  }

  // Helper methods
  getFormControl(path: string): AbstractControl | null {
    return this.checkoutForm.get(path);
  }

  isFieldInvalid(path: string): boolean {
    const control = this.getFormControl(path);
    return !!(control && control.invalid && control.touched);
  }

  getFieldError(path: string): string {
    const control = this.getFormControl(path);
    if (control && control.errors) {
      const firstError = Object.keys(control.errors)[0];
      return this.getErrorMessage(firstError, control.errors[firstError]);
    }
    return '';
  }

  private getErrorMessage(errorType: string, errorValue: any): string {
    const errorMessages: { [key: string]: string } = {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      minlength: `Minimum length is ${errorValue.requiredLength} characters`,
      pattern: 'Please enter a valid value'
    };
    
    return errorMessages[errorType] || 'Invalid input';
  }

  // Shipping method selection
  onShippingMethodSelect(optionId: string): void {
    this.checkoutForm.patchValue({ shippingMethod: optionId });
    this.store.dispatch(new CheckoutActions.AddShippingMethod(optionId));
  }

  // Payment method selection
  onPaymentMethodSelect(providerId: string): void {
    this.checkoutForm.patchValue({ paymentMethod: providerId });
    this.store.dispatch(new CheckoutActions.SetPaymentSession(providerId));
  }

  // Get payment icon based on provider
  getPaymentIcon(providerId: string): string {
    const iconMap: { [key: string]: string } = {
      'stripe': 'card',
      'paypal': 'logo-paypal',
      'apple_pay': 'logo-apple',
      'google_pay': 'logo-google',
      'default': 'card'
    };
    return iconMap[providerId] || iconMap['default'];
  }

  // Open terms and conditions
  openTerms(event: Event): void {
    event.preventDefault();
    // Implement terms modal or navigation
    console.log('Opening terms and conditions');
  }

  // Open privacy policy
  openPrivacyPolicy(event: Event): void {
    event.preventDefault();
    // Implement privacy policy modal or navigation
    console.log('Opening privacy policy');
  }

  // Address handling
  onBillingSameAsShippingChange(checked: boolean): void {
    if (checked) {
      const shippingAddress = this.checkoutForm.get('shippingAddress')?.value;
      this.checkoutForm.patchValue({
        billingAddress: { ...shippingAddress }
      });
    }
  }

  // Progress calculation
  getProgressPercentage(): number {
    return ((this.currentStep + 1) / this.totalSteps) * 100;
  }

  // Step titles
  getStepTitle(step: number): string {
    const titles = ['Customer Info', 'Addresses', 'Shipping & Payment', 'Review & Complete'];
    return titles[step] || '';
  }

  // Step descriptions
  getStepDescription(step: number): string {
    const descriptions = [
      'Enter your contact information',
      'Provide shipping and billing addresses',
      'Choose shipping method and payment',
      'Review your order and complete checkout'
    ];
    return descriptions[step] || '';
  }
}
