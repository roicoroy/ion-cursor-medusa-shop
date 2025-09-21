import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { KeypadModule } from 'src/app/shared/native/keyboard/keypad.module';
import { ShowHidePasswordComponent } from 'src/app/Components/show-hide-password/show-hide-password.component';
import { IonInput, IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonItem, ModalController, MenuController, IonSpinner } from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { LoginPayload } from 'src/app/shared/interfaces/auth.interface';
import { IAppFacadeState, AppFacade } from 'src/app/store/app.facade';
import { AuthActions } from 'src/app/store/auth/auth.actions';
import { AuthState } from 'src/app/store/auth/auth.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonItem,
    IonButtons,
    IonIcon,
    IonButton,
    IonContent,
    IonHeader,
    IonToolbar,
    IonSpinner,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    KeypadModule,
    ShowHidePasswordComponent,
    TranslateModule
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  // Public properties
  public loginForm!: FormGroup;
  public loading = false;
  public error: string | null = null;
  public isLoggedIn$: Observable<boolean>;
  public returnUrl?: string;
  public viewState$: Observable<IAppFacadeState>;

  // Validation messages
  public validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };

  // Private services
  private readonly facade = inject(AppFacade);
  private readonly modalCtrl = inject(ModalController);
  private readonly store = inject(Store);
  private readonly menuCtrl = inject(MenuController);
  private readonly ngUnsubscribe = new Subject();

  constructor() {
    this.viewState$ = this.facade.viewState$;
    this.isLoggedIn$ = this.store.select(AuthState.isLoggedIn);
  }

  ngOnInit(): void {
    this.initForm();
    this.subscribeToAuthState();
    this.getReturnUrl();
  }

  /**
   * Initialize the login form
   */
  private initForm(): void {
    this.loginForm = new FormGroup({
      'email': new FormControl('test02@test.com', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'password': new FormControl('Rwbento123!', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ]))
    });
  }

  /**
   * Subscribe to authentication state changes
   */
  private subscribeToAuthState(): void {
    this.isLoggedIn$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(isLoggedIn => {
        if (isLoggedIn) {
          this.dismiss();
        }
      });
  }

  /**
   * Get return URL from modal data if available
   */
  private async getReturnUrl(): Promise<void> {
    try {
      const modal = await this.modalCtrl.getTop();
      if (modal?.componentProps?.['returnUrl']) {
        this.returnUrl = modal.componentProps['returnUrl'];
      }
    } catch (error) {
      console.error('Error getting return URL:', error);
    }
  }

  /**
   * Handle login form submission
   */
  async doLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const loginPayload: LoginPayload = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };

      this.store.dispatch(new AuthActions.Login(loginPayload))
        .pipe(takeUntil(this.ngUnsubscribe))
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
            this.error = 'Login failed. Please check your credentials and try again.';
            this.loading = false;
            console.error('Login error:', error);
          }
        });
    } catch (error) {
      this.error = 'An unexpected error occurred.';
      this.loading = false;
      console.error('Login error:', error);
    }
  }

  /**
   * Mark all form controls as touched for validation display
   */
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Toggle menu
   */
  menuToggle(id: string): void {
    this.menuCtrl.toggle(id);
  }

  /**
   * Dismiss the modal
   */
  dismiss(): void {
    this.modalCtrl.dismiss({
      returnUrl: this.returnUrl
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
