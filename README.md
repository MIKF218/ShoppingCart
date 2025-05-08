# Shopping Cart App

A modern e-commerce mobile application built with React Native, Expo, and TypeScript.

## Features

- Product listing with grid and list views
- Product search and filtering
- Shopping cart functionality
- User authentication
- Profile management
- Order history
- Responsive design

## Tech Stack

- React Native
- Expo
- TypeScript
- React Navigation
- Context API for state management
- Expo Vector Icons
- Expo Linear Gradient

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shopping-cart
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Run on your device:
- Scan the QR code with the Expo Go app on your mobile device
- Press 'i' to run on iOS simulator
- Press 'a' to run on Android emulator

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── navigation/     # Navigation configuration
├── context/        # Context providers
├── services/       # API services
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Features Implementation

### Product Management
- Products are displayed in a grid layout
- Each product shows image, name, price, and brand
- Products can be filtered by country
- Search functionality for products

### Shopping Cart
- Add/remove products to/from cart
- Update product quantities
- Calculate total price
- Proceed to checkout

### User Authentication
- Login/Register functionality
- Profile management
- Order history
- Secure authentication flow

### Payment Integration
- Mock payment processing
- Order confirmation
- Order history tracking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Expo team for the amazing framework
- React Native community for the support
- All contributors who helped in building this project 