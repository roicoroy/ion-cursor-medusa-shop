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
  public formPath = 'auth.signupForm';
  public signupForm!: FormGroup;
  public matching_passwords_group!: FormGroup;
  public loading = false;
  public error: string | null = null;
  public submitted = false;

  // Validation messages
  public validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'username': [
      { type: 'required', message: 'Username is required.' },
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required' }
    ],
    'matching_passwords': [
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
    this.matching_passwords_group = new FormGroup({
      'password': new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      'confirm_password': new FormControl('', Validators.required)
    }, (formGroup: FormGroup | any) => {
      return PasswordValidator.areNotEqual(formGroup);
    });

    this.signupForm = new FormGroup({
      'email': new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'matching_passwords': this.matching_passwords_group,
    });
  }

  /**
   * Handle form submission
   */
  async onSubmit(): Promise<void> {
    if (this.signupForm.invalid || this.registerAddressForm.invalid) {
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
        first_name: 'User', // TODO: Add first name field
        last_name: 'User',  // TODO: Add last name field
        email: this.signupForm.value.email,
        password: this.matching_passwords_group.value.password
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
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
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
    this.signupForm.reset();
    this.registerAddressForm.reset();
    this.submitted = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
