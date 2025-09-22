# ion-cursor-medusa-shop

A comprehensive e-commerce application built with Ionic and Angular, powered by Medusa.js.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Key Components and Pages](#key-components-and-pages)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Styling](#styling)
- [Internationalization (i18n)](#internationalization-i18n)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication (Login, Register, Logout)
- Product listing and details
- Shopping cart functionality
- Checkout process (shipping, payment)
- Address management
- Order history
- Profile management
- Internationalization (i18n)
- Responsive design with Ionic

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (LTS version recommended)
- npm or Yarn
- Ionic CLI
- A running Medusa.js backend (refer to [Medusa.js documentation](https://docs.medusajs.com/) for setup)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-repo/ion-cursor-medusa-shop.git
    cd ion-cursor-medusa-shop
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Configure your Medusa.js backend URL in `src/environments/environment.ts`:
    ```typescript
    export const environment = {
      production: false,
      MEDUSA_API_URL: 'http://localhost:9000', // Replace with your Medusa backend URL
      STRIPE_PUBLISHABLE_KEY: 'YOUR_STRIPE_PUBLISHABLE_KEY' // Replace with your Stripe public key
    };
    ```

### Running the Application

To run the application in development mode:

```bash
ionic serve
```

This will open the application in your default web browser.

## Project Structure

The project follows a standard Angular and Ionic project structure:

- `src/app/`: Contains the core application logic.
  - `components/`: Reusable UI components (e.g., `auth-component`, `footer`, `forms`).
  - `pages/`: Application pages (e.g., `products`, `cart`, `customer-checkout`).
  - `shared/`: Shared services, pipes, interfaces, and utilities.
  - `store/`: NGXS state management modules.
- `src/assets/`: Static assets like images, fonts, and i18n files.
- `src/environments/`: Environment-specific configurations.

## Key Components and Pages

- **`AuthComponent`**: Handles user login, registration, and logout.
- **`ProductListComponent`**: Displays a list of products.
- **`ProductDetailsPage`**: Shows detailed information about a single product.
- **`CartPage`**: Manages the shopping cart.
- **`CustomerCheckoutPage`**: Guides the user through the checkout process.
- **`AddressFormComponent`**: Reusable form for address input.
- **`AppFooterComponent`**: Application footer.

## State Management

This application uses [NGXS](https://www.ngxs.io/) for state management. Key state modules include:

- `AuthState`: Manages user authentication status.
- `MedusaCartState`: Manages the shopping cart state.
- `RegionsState`: Manages region and country data.

## API Integration

The application interacts with the Medusa.js backend via `MedusaService` (`src/app/shared/api/medusa.service.ts`). It uses Angular's `HttpClient` with interceptors for handling authentication and errors.

## Styling

The application uses Ionic's default styling with custom SCSS files for component-specific styles. Bootstrap classes have been removed and replaced with Ionic equivalents or custom CSS.

## Internationalization (i18n)

Internationalization is implemented using `@ngx-translate/core`. Translation files are located in `src/assets/i18n/`.

## Contributing

Contributions are welcome! Please follow the standard GitHub flow:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## License

This project is licensed under the MIT License.
