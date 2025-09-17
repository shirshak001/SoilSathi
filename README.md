# SoilSathi - Smart Agricultural Technology Platform

![SoilSathi Banner](https://img.shields.io/badge/SoilSathi-Agricultural%20Technology-green?style=for-the-badge&logo=leaf&logoColor=white)

[![React Native](https://img.shields.io/badge/React%20Native-0.79.6-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~53.0.22-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-~5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-0BSD-green.svg)](LICENSE)

> **"Empowering farmers with intelligent technology for sustainable agriculture"**

SoilSathi is a comprehensive agricultural technology platform designed to help farmers and gardeners make informed decisions about their crops, manage their fields efficiently, and leverage modern technology for sustainable farming practices. The application serves both farmers managing large fields and gardeners with smaller plots, providing tailored tools for each user type.

---

## Table of Contents

- [Features Overview](#features-overview)
- [Main Features](#main-features)
- [User Types](#user-types)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Multilingual Support](#multilingual-support)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## Features Overview

SoilSathi is packed with numerous features designed to revolutionize agricultural practices through technology. Here's a comprehensive list of features available in the application:

### Voice Assistant
- Smart voice commands for hands-free navigation
- Multilingual support for 7 languages
- Contextual responses with time-aware greetings
- Voice tutorial system for new users

### Field Management System
- Centralized dashboard for field monitoring
- Real-time status tracking with visual health indicators
- Activity scheduling for farming tasks
- Crop information tracking with soil type data
- Smart notifications for farming activities

### Weather Forecast System
- Real-time weather data display
- 5-day weather forecast
- Weather alerts for adverse conditions
- Weather-based farming recommendations
- Location-based weather services

### Reports & Analytics
- Key metrics dashboard with yield and revenue tracking
- Period selection for weekly/monthly/yearly reports
- Interactive data visualization
- Detailed report categories for crop performance, finances, and resources

### Plant Health Management
- AI-powered plant disease detection
- Soil analysis and health assessment
- Plant care reminders and scheduling
- Expert recommendations for crop management

### User Experience
- Dual user interface for farmers and gardeners
- Theme toggling between light and dark modes
- Multi-language support
- Accessibility features

### Community Features
- Farmer/gardener networking
- Knowledge sharing platform
- Expert access for professional advice
- Social mapping for gardeners

### Additional Services
- Drone service booking and history tracking
- Agricultural marketplace with secure checkout
- Government schemes information
- Privacy and security settings

### Educational Content
- Soil superhero story mode for children
- Interactive learning games
- Soil health tips and advisory content
- Seasonal gardening suggestions

---

## Main Features

### 1. Voice Assistant
The intelligent voice-controlled feature allows users to navigate through the app using voice commands in multiple languages. The system provides audio feedback and supports hands-free operation, making it perfect for farmers working in the field.
- **Supported Commands**: Weather, soil analysis, plant disease, water schedule, drone service, etc.
- **Languages**: English, Hindi, Tamil, Bengali, Telugu, Punjabi, and Kannada
- **Component**: `src/components/VoiceAssistant.tsx`

### 2. Field Management System
A comprehensive system to monitor and manage agricultural fields with real-time status tracking, activity scheduling, and smart notifications.
- **Dashboard**: Complete field overview with health indicators
- **Activity Management**: Schedule watering, fertilizing, harvesting, etc.
- **Smart Notifications**: Alerts for upcoming and overdue tasks
- **Component**: `src/screens/FieldManagementScreen.tsx`

### 3. Weather Forecast Integration
Provides detailed weather information with agricultural recommendations based on current and forecasted conditions.
- **Current Weather**: Temperature, humidity, wind speed, UV index
- **Forecasting**: 5-day weather predictions with hourly breakdown
- **Farming Advice**: Weather-based agricultural recommendations
- **Component**: `src/components/WeatherForecast.tsx`

### 4. Reports & Analytics
Comprehensive reporting system that provides insights into farming operations, crop performance, and resource utilization.
- **Key Metrics**: Yield, revenue, crop health, water usage
- **Period Selection**: Weekly, monthly, yearly reporting
- **Visualization**: Interactive charts and graphs
- **Component**: `src/components/ReportsAnalytics.tsx`

### 5. Plant Disease Detection
AI-powered system that identifies plant diseases through camera images and provides treatment recommendations.
- **Disease Identification**: Camera-based AI analysis
- **Treatment Advice**: Expert recommendations for disease management
- **Product Suggestions**: Recommended treatments and products
- **Component**: `src/screens/PlantDiseaseDetection.tsx`

### 6. Soil Analysis
Tools for comprehensive soil health assessment including nutrient levels, pH balance, and improvement recommendations.
- **Soil Health Testing**: Analysis of soil composition
- **Advisory Content**: Recommendations for soil improvement
- **Historical Tracking**: Soil health trends over time
- **Component**: `src/screens/SoilAnalysisScreen.tsx`

---

## User Types

SoilSathi caters to two primary user types, each with tailored features:

### Farmers
- Large field management
- Crop yield optimization
- Drone services for field monitoring
- Government schemes information
- Commercial agriculture analytics

### Gardeners
- Small plot management
- Garden zones planning
- Seasonal aesthetic suggestions
- Indoor plant care
- Social community mapping

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio or Xcode (for mobile development)

### Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/shirshak001/SoilSathi.git

# Navigate to the project directory
cd SoilSathi

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm start
# or
yarn start
```

## Tech Stack

SoilSathi is built using modern technologies to ensure performance, reliability, and scalability:

### Frontend
- **React Native (v0.79.6)**: Core framework for cross-platform mobile development
- **Expo (v53.0.22)**: Development platform for building and deploying React Native applications
- **TypeScript (v5.8.3)**: Typed JavaScript for improved development experience

### UI/UX
- **React Navigation**: Navigation library for screen transitions
- **Expo Vector Icons**: Icon set for UI elements
- **React Native Gesture Handler**: Touch and gesture handling
- **Expo Linear Gradient**: Gradient effects for weather and theme elements

### API & Data
- **Axios**: HTTP client for API requests
- **AsyncStorage**: Local data storage solution
- **Google Generative AI**: AI capabilities for plant disease detection

### Media & Location
- **Expo Camera**: Camera access for plant scanning
- **Expo Location**: GPS and location services
- **Expo Speech**: Text-to-speech functionality
- **Expo AV**: Audio/video playback for tutorials

## Project Structure

The SoilSathi project is organized into a clear directory structure:

```
SoilSathi/
├── assets/                  # Static assets like icons and images
├── src/                     # Source code
│   ├── components/          # Reusable UI components
│   ├── constants/           # App constants and theme definitions
│   ├── contexts/            # React context providers
│   ├── navigation/          # Navigation configuration
│   ├── screens/             # App screens
│   └── utils/               # Utility functions and helpers
├── App.tsx                  # Main application component
├── app.json                 # Expo configuration
├── babel.config.js          # Babel configuration
├── metro.config.js          # Metro bundler configuration
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

### Key Directories

#### components/
Contains reusable UI components used throughout the application:
- `ChatBot.tsx` - AI-powered chat assistance
- `CustomButton.tsx` - Standardized button component
- `FieldSummary.tsx` - Field overview component
- `FloatingPlantScanner.tsx` - Camera access for plant scanning
- `VoiceAssistant.tsx` - Voice control interface
- `WeatherForecast.tsx` - Weather display component

#### screens/
Contains all application screens:
- User authentication screens (`LoginScreenFarmer.tsx`, `SignUpScreenFarmer.tsx`)
- Dashboard screens (`FarmerDashboard.tsx`, `GardenerDashboard.tsx`)
- Feature screens (`SoilAnalysisScreen.tsx`, `PlantDiseaseDetection.tsx`)
- Settings and configuration screens (`SettingsScreen.tsx`, `ProfileScreen.tsx`)

#### contexts/
Provides application-wide state management:
- `LanguageContext.tsx` - Multilingual support
- `ThemeContext.tsx` - Light/dark theme toggle

## Design System

SoilSathi implements a consistent design system that enhances user experience:

### Themes
- **Light Mode**: Bright, field-inspired color scheme
- **Dark Mode**: Low-light optimized UI for evening use
- **Theme Configuration**: Located in `src/constants/theme.ts`

### UI Components
- **Custom Buttons**: Standardized interactive elements
- **Input Fields**: Consistent form elements
- **Cards**: Information display components
- **Modal Dialogs**: Popup notifications and alerts

## Development

### Running the App

To start the development server:

```bash
# Start Expo development server
npm start
# or
yarn start
```

Then choose the platform to run on:
- Press `a` to run on Android Emulator
- Press `i` to run on iOS Simulator
- Scan QR code with Expo Go app on physical device

### Available Scripts

The following npm/yarn scripts are available:

- `npm start` - Start the development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser

### Development Environment

For the best development experience:

1. Install VS Code with React Native extensions
2. Set up Android Studio and/or Xcode
3. Configure Expo development tools
4. Install the Expo Go app on physical devices for testing

## Feature Documentation

Detailed documentation for key features is available in markdown files:

- `VOICE_ASSISTANT.md` - Voice commands and multilingual support
- `FIELD_MANAGEMENT_WEATHER.md` - Field management and weather system
- `REPORTS_WEATHER_LOCATION.md` - Analytics and location services
- `UPDATES_SUMMARY.md` - Summary of recent app updates

## User Flows

### Farmer User Flow
1. **Login/Signup**: Authentication through farmer-specific login
2. **Dashboard**: View field status, weather, and activity overview
3. **Field Management**: Monitor and manage multiple fields
4. **Soil Analysis**: Analyze soil health and receive recommendations
5. **Drone Services**: Book and track drone services
6. **Reports**: View farming analytics and performance metrics

### Gardener User Flow
1. **Login/Signup**: Authentication through gardener-specific login
2. **Dashboard**: View garden zones, plant health, and weather
3. **Garden Planner**: Plan and manage garden layouts
4. **Plant Care**: Monitor plant health and care schedules
5. **Community**: Connect with other gardeners and view social map
6. **Seasonal Suggestions**: Receive season-specific gardening advice

## Contributing

We welcome contributions to SoilSathi! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## License

SoilSathi is licensed under the 0BSD License - see the LICENSE file for details.

---

## Contact

For questions, feedback, or support, please reach out to the development team or open an issue on the repository.

---

Built with ❤️ for sustainable agriculture


### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Git**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/shirshak001/SoilSathi.git
   cd SoilSathi
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - Install **Expo Go** app on your mobile device
   - Scan the QR code displayed in the terminal
   - Or press `a` for Android emulator, `i` for iOS simulator

---

## 📱 Installation

### Development Setup

```bash
# Install Expo CLI globally
npm install -g @expo/cli

# Clone the repository
git clone https://github.com/shirshak001/SoilSathi.git
cd SoilSathi

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start
```

### Building for Production

```bash
# Build for Android
expo build:android

# Build for iOS
expo build:ios

# Build web version
npm run web
```

---

## 🛠️ Tech Stack

### **Frontend**
- **React Native 0.79.6**: Cross-platform mobile development
- **Expo ~53.0.22**: Development platform and tools
- **TypeScript**: Type-safe JavaScript development
- **React Navigation**: Navigation library for React Native

### **UI/UX**
- **Expo Linear Gradient**: Beautiful gradient backgrounds
- **Expo Vector Icons**: Comprehensive icon library
- **React Native Gesture Handler**: Advanced gesture recognition
- **React Native Safe Area Context**: Handle device safe areas

### **Voice & Audio**
- **Expo Speech**: Text-to-speech functionality
- **Expo AV**: Audio recording and playback
- **Voice Recognition**: Speech-to-text capabilities

### **Storage & Data**
- **AsyncStorage**: Local data persistence
- **React Context**: Global state management
- **TypeScript Interfaces**: Type-safe data structures

### **Camera & Media**
- **Expo Camera**: Camera functionality for plant scanning
- **Expo Image Picker**: Image selection from gallery

---

## 🏗️ Project Structure

```
SoilSathi/
├── 📁 assets/                    # App assets (icons, splash screen)
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
├── 📁 src/                       # Source code
│   ├── 📁 components/            # Reusable UI components
│   │   ├── ChatBot.tsx
│   │   ├── CustomButton.tsx
│   │   ├── CustomInput.tsx
│   │   ├── FieldSummary.tsx
│   │   ├── FloatingPlantScanner.tsx
│   │   ├── LanguageSelector.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── VoiceAssistant.tsx
│   │   ├── VoiceAssistantTutorial.tsx
│   │   └── WeatherForecast.tsx
│   ├── 📁 constants/             # App constants and themes
│   │   └── theme.ts
│   ├── 📁 contexts/              # React contexts for global state
│   │   ├── LanguageContext.tsx
│   │   └── ThemeContext.tsx
│   ├── 📁 navigation/            # Navigation configuration
│   │   └── AppNavigation.tsx
│   ├── 📁 screens/               # App screens
│   │   ├── Checkout.tsx
│   │   ├── CommunityScreen.tsx
│   │   ├── DroneServiceHistory.tsx
│   │   ├── DroneServiceScreen.tsx
│   │   ├── FarmerDashboard.tsx
│   │   ├── FieldManagementScreen.tsx
│   │   ├── ForgotPasswordScreen.tsx
│   │   ├── GardenerDashboard.tsx
│   │   ├── GardenZonesScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── PaymentMethodsScreen.tsx
│   │   ├── PlantCareRemindersScreen.tsx
│   │   ├── PlantDiseaseDetection.tsx
│   │   ├── PrivacySecurityScreen.tsx
│   │   ├── ProductStore.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── SignupScreen.tsx
│   │   ├── SoilAnalysisScreen.tsx
│   │   ├── UserTypeSelectionScreen.tsx
│   │   ├── WaterScheduleScreen.tsx
│   │   └── WeatherTipsScreen.tsx
│   └── index.ts                  # Main entry point
├── 📄 App.tsx                    # Root component
├── 📄 app.json                   # Expo configuration
├── 📄 index.ts                   # App entry point
├── 📄 metro.config.js            # Metro bundler configuration
├── 📄 package.json               # Dependencies and scripts
├── 📄 tsconfig.json              # TypeScript configuration
├── 📄 FIELD_MANAGEMENT_WEATHER.md # Field management documentation
├── 📄 VOICE_ASSISTANT.md         # Voice assistant documentation
└── 📄 README.md                  # This file
```

---

## 🎨 Design System

### **Color Palette**
- **Primary Green**: `#2E7D32` - Main brand color
- **Light Green**: `#4CAF50` - Secondary actions
- **Background**: `#F1F8E9` - Light green background
- **Surface**: `#FFFFFF` - Card and surface color
- **Success**: `#4CAF50` - Success indicators
- **Warning**: `#FF9800` - Warning alerts
- **Error**: `#F44336` - Error states

### **Typography**
- **Heading**: 32px, Bold
- **Title**: 28px, Bold
- **Large**: 20px, Medium
- **Body**: 16px, Regular
- **Small**: 14px, Regular
- **Caption**: 12px, Regular

### **Spacing System**
- **XS**: 4px
- **SM**: 8px
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px
- **XXL**: 48px

### **Border Radius**
- **Small**: 4px
- **Medium**: 8px
- **Large**: 12px
- **Extra Large**: 16px
- **Full**: 999px (circular)

---

## 🌍 Multilingual Support

SoilSathi supports multiple languages to cater to diverse farming communities:

| Language | Code | Native Name | Status |
|----------|------|-------------|--------|
| English | `en` | English | ✅ Complete |
| Hindi | `hi` | हिंदी | ✅ Complete |
| Tamil | `ta` | தமிழ் | ✅ Complete |
| Bengali | `bn` | বাংলা | ✅ Complete |
| Telugu | `te` | తెలుగు | ✅ Complete |
| Punjabi | `pa` | ਪੰਜਾਬੀ | ✅ Complete |
| Kannada | `kn` | ಕನ್ನಡ | ✅ Complete |

### **Language Features**
- **Dynamic Translation**: Real-time language switching
- **Voice Support**: Text-to-speech in native languages
- **Cultural Adaptation**: Context-aware content for different regions
- **RTL Support**: Ready for Arabic/Urdu expansion

---

## 📸 Screenshots

### **Farmer Dashboard**
![Farmer Dashboard](https://via.placeholder.com/300x600/4CAF50/FFFFFF?text=Farmer+Dashboard)

### **Field Management**
![Field Management](https://via.placeholder.com/300x600/2E7D32/FFFFFF?text=Field+Management)

### **Weather Forecast**
![Weather Forecast](https://via.placeholder.com/300x600/81C784/FFFFFF?text=Weather+Forecast)

### **Voice Assistant**
![Voice Assistant](https://via.placeholder.com/300x600/66BB6A/FFFFFF?text=Voice+Assistant)

---

## 🔧 Development

### **Development Commands**

```bash
# Start development server
npm start

# Start with cache cleared
npm start --clear

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web

# Type checking
npx tsc --noEmit

# Lint code
npx eslint src/
```

### **Environment Setup**

1. **Android Development**
   - Install Android Studio
   - Set up Android SDK
   - Configure environment variables

2. **iOS Development** (macOS only)
   - Install Xcode
   - Set up iOS Simulator
   - Configure development certificates

### **Voice Assistant Development**

The voice assistant requires additional setup:

```bash
# Install voice dependencies
npm install expo-speech expo-av --legacy-peer-deps
```

**Permissions Required:**
- Microphone access for voice input
- Audio recording permissions

---

## 🚀 Deployment

### **Expo Application Services (EAS)**

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Submit to app stores
eas submit
```

### **Web Deployment**

```bash
# Build web version
expo export:web

# Deploy to Netlify/Vercel
# Upload dist folder to your hosting provider
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### **Ways to Contribute**
- 🐛 **Bug Reports**: Report issues you encounter
- 💡 **Feature Requests**: Suggest new features
- 🔧 **Code Contributions**: Submit pull requests
- 📖 **Documentation**: Improve documentation
- 🌍 **Translations**: Add support for new languages

### **Development Guidelines**

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/AmazingFeature`
3. **Make your changes**: Follow the coding standards
4. **Test thoroughly**: Ensure all features work
5. **Commit your changes**: `git commit -m 'Add some AmazingFeature'`
6. **Push to the branch**: `git push origin feature/AmazingFeature`
7. **Open a Pull Request**: Describe your changes

### **Coding Standards**
- Use TypeScript for type safety
- Follow React Native best practices
- Maintain consistent code formatting
- Write meaningful commit messages
- Add comments for complex logic

---

## 📄 License

This project is licensed under the **0BSD License** - see the [LICENSE](LICENSE) file for details.

The 0BSD license is a "do whatever you want with it" license that allows for:
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use

---

## 🙏 Acknowledgments

Special thanks to:
- **React Native Community** for the amazing framework
- **Expo Team** for the excellent development platform
- **Agricultural Experts** who provided domain knowledge
- **Farming Communities** for their valuable feedback
- **Open Source Contributors** who make projects like this possible

---

## 📞 Contact & Support

- **Developer**: Shirshak
- **GitHub**: [@shirshak001](https://github.com/shirshak001)
- **Repository**: [SoilSathi](https://github.com/shirshak001/SoilSathi)

### **Support**
If you encounter any issues or have questions:
1. Check the [documentation](./docs)
2. Search [existing issues](https://github.com/shirshak001/SoilSathi/issues)
3. Create a [new issue](https://github.com/shirshak001/SoilSathi/issues/new)

---

## 🚀 What's Next?

### **Upcoming Features**
- 🤖 **AI-Powered Crop Recommendations**
- 📡 **IoT Sensor Integration**
- 🛰️ **Satellite Imagery Analysis**
- 📊 **Advanced Analytics Dashboard**
- 🔔 **Smart Push Notifications**
- 🌐 **Web Application**

### **Technical Roadmap**
- Migration to Expo SDK 54+
- Real-time weather API integration
- Offline-first architecture
- Performance optimizations
- Enhanced accessibility features

---

<div align="center">

**Made with ❤️ for farmers around the world**

*"Technology that grows with you"*

[![Star this repo](https://img.shields.io/github/stars/shirshak001/SoilSathi?style=social)](https://github.com/shirshak001/SoilSathi)
[![Fork this repo](https://img.shields.io/github/forks/shirshak001/SoilSathi?style=social)](https://github.com/shirshak001/SoilSathi/fork)

</div>
- **Seasonal Guidance** - Month-specific care recommendations

#### 🗓️ Plant Care Management
- **Smart Reminders** - Never miss watering or feeding schedules
- **Priority System** - Focus on urgent plant care tasks
- **Progress Tracking** - Monitor plant health over time
- **Custom Scheduling** - Personalized care routines

#### 🏡 Garden Zones
- **Zone Management** - Create and organize garden sections
- **Plant Tracking** - Monitor individual plants per zone
- **Health Monitoring** - Zone-specific plant health analytics
- **Care Coordination** - Streamlined maintenance workflows

## 🛠️ Technology Stack

- **Frontend**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State Management**: React Hooks & Context
- **UI Components**: React Native Elements & Custom Components
- **Icons**: Expo Vector Icons (Ionicons)
- **Camera**: Expo Camera & Image Picker
- **Styling**: StyleSheet with custom theming

## 📱 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Expo Go app (for testing)

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

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device**
   - Scan QR code with Expo Go app (Android/iOS)
   - Or press `a` for Android emulator
   - Or press `i` for iOS simulator

## 📁 Project Structure

```
SoilSathi/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ChatBot.tsx      # AI assistant component
│   │   ├── FloatingPlantScanner.tsx
│   │   └── ProductCard.tsx
│   ├── navigation/          # Navigation configuration
│   │   └── AppNavigation.tsx
│   ├── screens/            # Application screens
│   │   ├── auth/           # Authentication screens
│   │   ├── FarmerDashboard.tsx
│   │   ├── GardenerDashboard.tsx
│   │   ├── PlantDiseaseDetection.tsx
│   │   ├── CommunityScreen.tsx
│   │   ├── WeatherTipsScreen.tsx
│   │   ├── GardenZonesScreen.tsx
│   │   └── PlantCareRemindersScreen.tsx
│   ├── services/           # API and external services
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript type definitions
├── assets/                 # Images, icons, and media
├── App.tsx                 # Main application component
└── package.json
```

## 🎨 Key Screens

### 1. Authentication Flow
- User type selection (Farmer/Gardener)
- Login and registration
- Profile setup

### 2. Dashboard
- Quick action buttons
- Weather overview
- Recent activities
- Navigation to main features

### 3. Plant Disease Detection
- Camera capture interface
- AI analysis results
- Treatment recommendations
- Product marketplace integration

### 4. Community Platform
- Post creation and sharing
- Category-based filtering
- Social interactions
- User profiles

### 5. Plant Care Management
- Reminder scheduling
- Task prioritization
- Progress tracking
- Care history

## 🔧 Configuration

### Environment Setup
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_API_URL=your_api_endpoint
EXPO_PUBLIC_WEATHER_API_KEY=your_weather_api_key
```

### App Configuration
Update `app.json` for your specific needs:
```json
{
  "expo": {
    "name": "SoilSathi",
    "slug": "soilsathi",
    "platforms": ["ios", "android", "web"]
  }
}
```

## 🚀 Deployment

### Build for Production
```bash
# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios

# Create development build
npx expo run:android
npx expo run:ios
```

### Publishing Updates
```bash
npx expo publish
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use consistent code formatting
- Add comments for complex logic
- Test on both Android and iOS
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Shirshak
- **Repository**: [github.com/shirshak001/SoilSathi](https://github.com/shirshak001/SoilSathi)

## 🙏 Acknowledgments

- Expo team for the amazing development platform
- React Native community for excellent documentation
- Open source contributors who made this project possible
- Agricultural experts who provided domain knowledge

## 📞 Support

For support, email support@soilsathi.com or join our community forum.

## 🔮 Future Roadmap

- [ ] Machine Learning model integration for disease detection
- [ ] IoT sensor data integration
- [ ] Multi-language support
- [ ] Offline functionality
- [ ] Advanced analytics dashboard
- [ ] Integration with agricultural equipment
- [ ] Marketplace for agricultural products
- [ ] Expert consultation booking

---

**Made with ❤️ for farmers and gardeners worldwide** 🌱