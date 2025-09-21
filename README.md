# IonCursorMedusaShop

## Project Description
IonCursorMedusaShop is a cross-platform e-commerce application built with Ionic Angular that integrates with a Medusa.js backend for comprehensive e-commerce functionalities. It provides features such as user authentication, product browsing, shopping cart management, checkout processes, and user profile management. The application demonstrates a robust and scalable approach to building modern e-commerce experiences with a headless commerce platform.

## Features
- **User Authentication** (Login, Registration, Google OAuth)
- **Product Management** (Listing, Details, Categories, Search)
- **Shopping Cart** (Add, Remove, Update quantities)
- **Checkout Process** (Shipping, Payment, Order completion)
- **User Profile Management** (Addresses, Personal details)
- **Region and Currency Selection**
- **Responsive Design** (Mobile-first approach)
- **State Management** (NGXS for complex state handling)
- **Animations** (Custom navigation animations)

## Tech Stack
- **Frontend Framework:** Ionic Angular 8
- **UI Framework:** Ionic Components
- **State Management:** NGXS (Next Generation State Management)
- **HTTP Client:** Angular HttpClient with interceptors
- **Styling:** SCSS with custom animations
- **Build Tool:** Angular CLI
- **Backend:** Medusa.js (Headless Commerce Platform)
- **Payment:** Stripe integration
- **Internationalization:** ngx-translate


## Installation and Setup

### Prerequisites
- Node.js 18+ and npm
- Angular CLI 17+
- Ionic CLI 7+
- A running Medusa.js backend instance
- Stripe account (for payment processing)

### Steps

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd ion-cursor-medusa-shop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create or update `src/environments/environment.ts` with your configuration:
   ```typescript
   export const environment = {
     production: false,
     STRIPE_PUBLISHABLE_KEY: 'your_stripe_publishable_key',
     STRIPE_SECRET_KEY: 'your_stripe_secret_key',
     MEDUSA_BACKEND_URL: 'http://localhost:9000',
     MEDUSA_API_BASE_PATH: 'http://localhost:9000',
     MEDUSA_PUBLISHABLE_KEY: 'your_medusa_publishable_key',
     populate: '?populate=*',
     revenueCatAppleKey: '',
     revenueCatGoogleKey: ''
   };
   ```

4. **Start the development server:**
   ```bash
   ionic serve
   ```

5. **For mobile development:**
   ```bash
   # Add platforms
   ionic capacitor add ios
   ionic capacitor add android
   
   # Build and sync
   ionic build
   ionic capacitor sync
   
   # Open in native IDEs
   ionic capacitor open ios
   ionic capacitor open android
   ```

## Project Structure

```
src/
├── app/
│   ├── pages/                 # Application pages
│   │   ├── cart/             # Shopping cart functionality
│   │   ├── products/         # Product listing and details
│   │   ├── tabs/             # Tab navigation
│   │   └── ...
│   ├── services/             # Angular services
│   │   ├── cart.service.ts   # Cart management
│   │   └── medusa-api.service.ts # API communication
│   ├── shared/               # Shared components and utilities
│   │   ├── api/              # API services
│   │   ├── components/       # Reusable components
│   │   ├── interfaces/       # TypeScript interfaces
│   │   ├── navigation/       # Navigation service
│   │   └── ...
│   ├── store/                # NGXS state management
│   │   ├── auth/             # Authentication state
│   │   ├── products/         # Products state
│   │   ├── medusa-cart/      # Cart state
│   │   ├── checkout/         # Checkout state
│   │   └── ...
│   └── ...
├── assets/                   # Static assets
├── environments/             # Environment configuration
└── theme/                    # Global styling
```

## Key Components

### Services
- **MedusaApiService:** Handles all API communication with Medusa backend
- **CartService:** Manages shopping cart operations
- **NavigationService:** Handles navigation with custom animations

### State Management (NGXS)
- **AuthState:** User authentication and session management
- **ProductsState:** Product listing, categories, and selection
- **MedusaCartState:** Shopping cart operations and state
- **CheckoutState:** Checkout process and payment handling
- **RegionsState:** Region and currency management

### Interfaces
- **Customer interfaces:** User data and authentication
- **Product interfaces:** Product and variant data
- **Cart interfaces:** Shopping cart and line items
- **Payment interfaces:** Payment and shipping options

## API Integration

The application integrates with Medusa.js backend through RESTful APIs:

- **Authentication:** `/auth/customer/*` endpoints
- **Products:** `/store/products` endpoints
- **Cart:** `/store/carts` endpoints
- **Checkout:** `/store/checkout` endpoints
- **Orders:** `/store/orders` endpoints

## Features in Detail

### Authentication
- Email/password login and registration
- Google OAuth integration
- Session management with JWT tokens
- Password reset functionality

### Product Management
- Product listing with pagination
- Product details with variants
- Category filtering
- Search functionality
- Product images and descriptions

### Shopping Cart
- Add/remove items
- Quantity updates
- Cart persistence
- Real-time cart synchronization

### Checkout Process
- Shipping address management
- Shipping method selection
- Payment method integration (Stripe)
- Order confirmation

### User Profile
- Personal information management
- Address book (billing and shipping)
- Order history
- Account settings

## Development

### Running in Development Mode
```bash
ionic serve
```

### Building for Production
```bash
ionic build --prod
```

### Running Tests
```bash
ng test
```

### Code Quality
```bash
# Linting
ng lint

# Formatting
npm run format
```

## Mobile Development

### iOS
```bash
ionic capacitor add ios
ionic capacitor sync ios
ionic capacitor open ios
```

### Android
```bash
ionic capacitor add android
ionic capacitor sync android
ionic capacitor open android
```

## Environment Configuration

### Development
- Backend URL: `http://localhost:9000`
- Stripe test keys
- Debug mode enabled

### Production
- Backend URL: Your deployed Medusa instance
- Stripe live keys
- Production optimizations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

1. **CORS Errors:** Ensure your Medusa backend has proper CORS configuration
2. **Authentication Issues:** Check your Medusa publishable key configuration
3. **Payment Errors:** Verify Stripe keys and webhook configuration
4. **Build Errors:** Clear cache with `ionic capacitor clean`

### Debug Mode
Enable debug mode in `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  // ... other config
};
```

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Support

For support and questions:
- Create an issue in the repository
- Check the Medusa.js documentation
- Review Ionic Angular documentation

## Acknowledgments

- [Medusa.js](https://medusajs.com/) - Headless commerce platform
- [Ionic](https://ionicframework.com/) - Cross-platform mobile development
- [Angular](https://angular.io/) - Frontend framework
- [NGXS](https://ngxs.io/) - State management
- [Stripe](https://stripe.com/) - Payment processing 