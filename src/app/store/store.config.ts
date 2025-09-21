import { NgxsDevtoolsOptions } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginOptions } from '@ngxs/logger-plugin';
import { NgxsConfig } from '@ngxs/store';
import { ProductsState } from './products/products.state';
import { RegionsState } from './regions/regions.state';
import { MedusaCartState } from './medusa-cart/medusa-cart.state';
import { CheckoutState } from './checkout/checkout.state';
import { AuthState } from './auth/auth.state';
import { KeyboardState } from './keyboard/keyboard.state';
import { LanguageState } from './language/language.state';
import { FormState } from './forms/form.state';
import { ThemeState } from './theme/theme.state';
import { ReturnsState } from './returns/returns.state';

export const STATES_MODULES = [
  ProductsState,
  RegionsState,
  MedusaCartState,
  CheckoutState,
  LanguageState,
  KeyboardState,
  AuthState,
  FormState,
  ThemeState,
  ReturnsState
];

export const STORAGE_MODULES = [
  'products',
  'regions',
  'medusaCart',
  "checkout",
  'language',
  'keyboard',
  'auth',
  'form',
  'theme',
  'returns'
];

export const OPTIONS_CONFIG: Partial<NgxsConfig> = {
  developmentMode: true
};

export const DEVTOOLS_REDUX_CONFIG: NgxsDevtoolsOptions = {
  disabled: false
};

export const LOGGER_CONFIG: NgxsLoggerPluginOptions = {
  disabled: true
};
