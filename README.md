# SoilSathi 🌱

**A comprehensive soil health monitoring and agricultural management platform built with React Native and Expo**

[![React Native](https://img.shields.io/badge/React%20Native-0.79.6-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2052-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.0-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Screens & Components](#screens--components)
- [Technologies Used](#technologies-used)
- [Educational Features](#educational-features)
- [API Integration](#api-integration)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

SoilSathi is an innovative mobile application designed to revolutionize agricultural practices through advanced soil health monitoring, AI-powered plant disease detection, and comprehensive farm management tools. The application serves both farmers and gardeners with specialized dashboards, educational content, and community features.

### Key Objectives

- **Soil Health Monitoring**: Real-time soil analysis and health tracking
- **Disease Detection**: AI-powered plant disease identification and treatment recommendations
- **Educational Platform**: Interactive learning tools for all age groups
- **Community Building**: Social platform for agricultural knowledge sharing
- **Drone Integration**: Advanced aerial monitoring and services
- **E-commerce**: Integrated marketplace for agricultural products

## ✨ Features

### 🚜 For Farmers
- **Comprehensive Dashboard**: Overview of farm operations and analytics
- **Drone Services**: Aerial monitoring, spraying, and surveillance
- **Field Management**: Multi-field tracking and management
- **Weather Integration**: Real-time weather data and forecasts
- **Reports & Analytics**: Detailed insights and performance metrics
- **Soil Analysis**: Advanced soil testing and recommendations

### 🌿 For Gardeners
- **Personalized Dashboard**: Tailored gardening insights and tools
- **Plant Disease Detection**: Camera-based AI disease identification
- **Garden Planning**: Virtual garden layout and management
- **Plant Care Reminders**: Automated watering and care schedules
- **Community Features**: Social networking with local gardeners
- **Product Store**: Curated gardening supplies marketplace

### 👶 Educational Features
- **Interactive Learning Games**: Gamified soil and plant education
- **AR Soil Explorer**: Augmented reality soil organism discovery
- **Soil Health Tips Library**: Age-appropriate educational content
- **Superhero Story Mode**: Interactive storytelling with soil heroes

### 🛒 E-commerce Integration
- **Product Marketplace**: Seeds, tools, fertilizers, and equipment
- **Secure Payments**: Multiple payment method support
- **Order Tracking**: Real-time delivery updates
- **Product Recommendations**: AI-powered suggestions

## 🏗️ Architecture

### Frontend Architecture
```
SoilSathi/
├── App.tsx                 # Main application entry point
├── src/
│   ├── components/         # Reusable UI components
│   ├── screens/           # Application screens
│   ├── navigation/        # Navigation configuration
│   ├── contexts/          # React Context providers
│   ├── constants/         # App constants and themes
│   └── utils/             # Utility functions
```

### Technology Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation 6
- **State Management**: React Context API
- **UI Components**: Custom components with Ionicons
- **Camera Integration**: Expo Camera for AR and disease detection
- **Location Services**: Expo Location for mapping features

## 🚀 Installation

### Prerequisites
- Node.js (>= 16.0.0)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/shirshak001/SoilSathi.git
   cd SoilSathi
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install Expo CLI globally**
   ```bash
   npm install -g @expo/cli
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device/simulator**
   - **Android**: Press `a` or scan QR code with Expo Go app
   - **iOS**: Press `i` or scan QR code with Camera app
   - **Web**: Press `w` to open in browser

### Dependencies

#### Core Dependencies
```json
{
  "@expo/vector-icons": "^15.0.0",
  "@react-native-async-storage/async-storage": "^2.2.0",
  "@react-navigation/native": "^6.1.0",
  "@react-navigation/stack": "^6.4.0",
  "expo": "~52.0.0",
  "expo-camera": "^16.1.11",
  "expo-location": "^18.1.6",
  "react": "18.3.1",
  "react-native": "0.79.6",
  "react-native-svg": "^15.12.1"
}
```

## 📱 Usage

### Getting Started

1. **User Registration**: Choose between Farmer or Gardener user type
2. **Dashboard Navigation**: Access role-specific features and tools
3. **Profile Setup**: Configure personal preferences and settings
4. **Feature Exploration**: Discover available tools and educational content

### Key Workflows

#### Soil Analysis
1. Navigate to Soil Analysis screen
2. Capture soil sample image
3. Receive AI-powered analysis results
4. View recommendations and treatment options

#### Plant Disease Detection
1. Open Plant Disease Detection feature
2. Take photo of affected plant
3. Get instant disease identification
4. Access treatment recommendations and products

#### Educational Content Access
1. Visit Kids Education Hub
2. Choose from available learning modules
3. Engage with interactive content
4. Track progress and achievements

## 📁 Project Structure

```
SoilSathi/
├── App.tsx                           # Application root component
├── app.json                          # Expo configuration
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── metro.config.js                   # Metro bundler configuration
├── assets/                           # Static assets
│   ├── icon.png
│   ├── splash-icon.png
│   └── favicon.png
└── src/
    ├── components/                   # Reusable components
    │   ├── ChatBot.tsx
    │   ├── CustomButton.tsx
    │   ├── CustomInput.tsx
    │   ├── FloatingPlantScanner.tsx
    │   ├── LanguageSelector.tsx
    │   └── ThemeToggle.tsx
    ├── constants/                    # App constants
    │   └── theme.ts
    ├── contexts/                     # React contexts
    │   ├── LanguageContext.tsx
    │   └── ThemeContext.tsx
    ├── navigation/                   # Navigation setup
    │   └── AppNavigation.tsx
    └── screens/                      # Application screens
        ├── auth/                     # Authentication screens
        │   ├── LoginScreen.tsx
        │   ├── SignupScreen.tsx
        │   └── ForgotPasswordScreen.tsx
        ├── dashboards/               # User dashboards
        │   ├── FarmerDashboard.tsx
        │   └── GardenerDashboard.tsx
        ├── education/                # Educational features
        │   ├── InteractiveLearningGamesScreen.tsx
        │   ├── ARSoilExplorerScreen.tsx
        │   ├── SoilHealthTipsScreen.tsx
        │   └── SoilSuperheroStoryScreen.tsx
        ├── features/                 # Core features
        │   ├── PlantDiseaseDetection.tsx
        │   ├── SoilAnalysisScreen.tsx
        │   ├── DroneServiceScreen.tsx
        │   └── WeatherTipsScreen.tsx
        ├── profile/                  # User profile
        │   ├── ProfileScreen.tsx
        │   ├── SettingsScreen.tsx
        │   └── PrivacySecurityScreen.tsx
        └── commerce/                 # E-commerce
            ├── ProductStore.tsx
            ├── Checkout.tsx
            └── PaymentMethodsScreen.tsx
```

## 🖥️ Screens & Components

### Authentication Flow
- **LoginScreen**: User authentication with email/password
- **SignupScreen**: New user registration with role selection
- **ForgotPasswordScreen**: Password recovery functionality
- **UserTypeSelectionScreen**: Choose between Farmer/Gardener roles

### Dashboard Screens
- **FarmerDashboard**: Comprehensive farm management interface
- **GardenerDashboard**: Gardening tools and community features

### Core Feature Screens
- **SoilAnalysisScreen**: AI-powered soil health analysis
- **PlantDiseaseDetection**: Camera-based disease identification
- **DroneServiceScreen**: Drone service booking and management
- **WeatherTipsScreen**: Weather-based agricultural advice

### Educational Screens
- **InteractiveLearningGamesScreen**: Gamified learning platform
- **ARSoilExplorerScreen**: Augmented reality soil exploration
- **SoilHealthTipsScreen**: Comprehensive soil health education
- **SoilSuperheroStoryScreen**: Interactive storytelling for kids

### Community & Commerce
- **CommunityScreen**: Social networking for gardeners
- **ProductStore**: Agricultural products marketplace
- **Checkout**: Secure payment processing

## 🛠️ Technologies Used

### Frontend Framework
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and deployment
- **TypeScript**: Type-safe JavaScript development

### UI/UX Libraries
- **@expo/vector-icons**: Icon library (Ionicons)
- **react-native-svg**: SVG rendering support
- **expo-linear-gradient**: Gradient backgrounds

### Navigation & State Management
- **React Navigation**: App navigation and routing
- **React Context API**: Global state management

### Device Integration
- **expo-camera**: Camera access for AR and disease detection
- **expo-location**: GPS and location services
- **@react-native-async-storage/async-storage**: Local data persistence

### Development Tools
- **Metro**: JavaScript bundler
- **ESLint**: Code linting and formatting
- **TypeScript Compiler**: Type checking

## 🎓 Educational Features

### Interactive Learning Games
- **Soil Matching Game**: Match soil types with characteristics
- **Plant Care Challenge**: Virtual plant care simulation
- **Weather Prediction**: Educational weather pattern games
- **Composting Adventure**: Learn composting through gameplay

### AR Soil Explorer
- **Camera Integration**: Real-time AR overlay
- **Organism Discovery**: Find and learn about soil creatures
- **Educational Content**: Detailed information about soil biology
- **Progress Tracking**: Achievement system for discoveries

### Soil Health Tips Library
- **Dual Mode Interface**: Kids and elderly-friendly versions
- **Comprehensive Content**: Composting, watering, recycling guides
- **Interactive Elements**: Step-by-step tutorials
- **Accessibility Features**: Voice narration and large text options

### Superhero Story Mode ⭐ **NEW**
- **Character-Based Learning**: Captain Compost, Mitti Mitra, Green Guardian
- **Progressive Chapters**: Unlockable story content
- **Interactive Choices**: Decision-based learning scenarios
- **Badge System**: Achievement tracking and rewards

## 🔌 API Integration

### Planned Integrations
- **Weather APIs**: Real-time weather data
- **Soil Analysis APIs**: Laboratory result processing
- **Plant Disease APIs**: AI-powered disease identification
- **E-commerce APIs**: Payment processing and order management
- **Mapping APIs**: Location-based services

### Data Management
- **Local Storage**: AsyncStorage for offline functionality
- **Cache Management**: Efficient data caching strategies
- **Sync Mechanisms**: Online/offline data synchronization

## 🔄 Development Workflow

### Code Organization
- **Component-Based Architecture**: Modular, reusable components
- **TypeScript Integration**: Full type safety throughout the app
- **Consistent Styling**: Centralized theme management
- **Icon Standardization**: Professional Ionicons implementation

### Quality Assurance
- **Type Safety**: TypeScript for compile-time error detection
- **Code Consistency**: ESLint configuration for code standards
- **Performance Optimization**: Efficient rendering and memory management

### Build Process
```bash
# Development build
npx expo start

# Production build
npx expo build:android
npx expo build:ios

# Web deployment
npx expo build:web
```

## 🤝 Contributing

We welcome contributions to SoilSathi! Please follow these guidelines:

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with proper TypeScript typing
4. Ensure all components use Ionicons (no emojis)
5. Test thoroughly on both platforms
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Standards
- **TypeScript**: All code must be properly typed
- **Icons**: Use Ionicons exclusively, no emoji characters
- **Components**: Follow React Native best practices
- **Naming**: Use descriptive, consistent naming conventions
- **Documentation**: Document complex functions and components

### Testing Guidelines
- Test on both Android and iOS
- Verify accessibility features
- Ensure offline functionality where applicable
- Test with different screen sizes and orientations

## 📋 Roadmap

### Phase 1 (Current)
- ✅ Core dashboard functionality
- ✅ Authentication system
- ✅ Educational features implementation
- ✅ UI/UX standardization with Ionicons

### Phase 2 (Upcoming)
- 🔄 API integration for real-time data
- 🔄 Advanced AI disease detection
- 🔄 Payment gateway integration
- 🔄 Push notification system

### Phase 3 (Future)
- 📋 Drone integration and control
- 📋 IoT sensor integration
- 📋 Advanced analytics dashboard
- 📋 Multi-language support expansion

## 📞 Support

For support, feature requests, or bug reports:

- **GitHub Issues**: [Open an issue](https://github.com/shirshak001/SoilSathi/issues)
- **Documentation**: Check this README and inline code documentation
- **Community**: Join our discussions in the GitHub repository

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team**: For providing an excellent development platform
- **React Native Community**: For continuous innovation and support
- **Ionicons**: For comprehensive icon library
- **Agricultural Experts**: For domain knowledge and guidance
- **Open Source Contributors**: For making this project possible

---

**Built with ❤️ by the SoilSathi Team**

*Empowering agriculture through technology and education*