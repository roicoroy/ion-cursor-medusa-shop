import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgxsModule, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { KeypadModule } from 'src/app/shared/native/keyboard/keypad.module';
import { PasswordValidator } from 'src/app/shared/validators/password.validator';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { AppFacade, IAppFacadeState } from 'src/app/store/app.facade';
import { ModalController } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { RegisterPayload } from 'src/app/shared/interfaces/auth.interface';
import { AuthActions } from 'src/app/store/auth/auth.actions';
import { MedusaAddress } from 'src/app/shared/interfaces/medusa-address';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    KeypadModule,
    NgxsModule,
    NgxsFormPluginModule,
    TranslateModule
  ]
})
export class RegisterComponent implements OnInit {
  @ViewChild('addressForm') addressForm!: ElementRef | any;

  // Public properties
  public viewState$!: Observable<IAppFacadeState>;
  public registerForm!: FormGroup;
  public loading = false;
  public error: string | null = null;
  public submitted = false;

  // Validation messages
  public validation_messages = {
    'firstName': [
      { type: 'required', message: 'First Name is required.' }
    ],
    'lastName': [
      { type: 'required', message: 'Last Name is required.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ],
    'confirmPassword': [
      { type: 'required', message: 'Confirm password is required' }
    ],
    'passwordMismatch': [
      { type: 'areNotEqual', message: 'Password mismatch' }
    ]
  };

  // Private services
  private readonly modalCtrl = inject(ModalController);
  private readonly store = inject(Store);
  private readonly facade = inject(AppFacade);
  private readonly fb = inject(FormBuilder);
  private readonly subscription = new Subscription();

  public registerAddressForm = this.fb.group({
    medusaAddress: [null, Validators.required],
  });

  ngOnInit(): void {
    this.viewState$ = this.facade.viewState$;
    this.initForms();
  }

  /**
   * Initialize the registration forms
   */
  private initForms(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      password: ['', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])],
      confirmPassword: ['', Validators.required]
    }, {
      validators: [PasswordValidator.areNotEqual]
    });
  }

  /**
   * Handle form submission
   */
  async register(): Promise<void> {
    if (this.registerForm.invalid || this.registerAddressForm.invalid) {
      this.markFormsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const addressValue = this.registerAddressForm.value.medusaAddress;
      if (!addressValue) {
        this.error = 'Address is required.';
        this.loading = false;
        return;
      }

      const address: MedusaAddress = addressValue;
      const registerPayload: RegisterPayload = {
        first_name: this.registerForm.value.firstName,
        last_name: this.registerForm.value.lastName,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      this.store.dispatch(new AuthActions.Register(registerPayload, address))
        .subscribe({
          next: (state: any) => {
            if (state.auth.isLoggedIn) {
              this.dismiss();
            } else if (state.auth.error) {
              this.error = state.auth.error;
            }
            this.loading = false;
          },
          error: (error) => {
            this.error = 'Registration failed. Please try again.';
            this.loading = false;
            console.error('Registration error:', error);
          }
        });
    } catch (error) {
      this.error = 'An unexpected error occurred.';
      this.loading = false;
      console.error('Registration error:', error);
    }
  }

  /**
   * Mark all form controls as touched for validation display
   */
  private markFormsTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });

    Object.keys(this.registerAddressForm.controls).forEach(key => {
      const control = this.registerAddressForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Dismiss the modal
   */
  dismiss(): void {
    this.modalCtrl.dismiss();
  }

  /**
   * Reset the forms
   */
  onReset(): void {
    this.registerForm.reset();
    this.registerAddressForm.reset();
    this.submitted = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}