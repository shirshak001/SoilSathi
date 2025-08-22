# 🌱 SoilSathi - Smart Agriculture & Gardening Companion

[![React Native](https://img.shields.io/badge/React%20Native-0.79.6-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-51.0.0-000020.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**SoilSathi** is a comprehensive mobile application designed to revolutionize agriculture and gardening through smart technology. Built with React Native and Expo, it serves both farmers and gardeners with advanced features including AI-powered plant disease detection, community engagement, weather insights, and intelligent plant care management.

## 🚀 Features

### 🌾 For Farmers
- **Drone Services Integration** - Aerial monitoring and precision agriculture
- **Smart Irrigation Systems** - Automated water management
- **Real-time Weather Analytics** - Weather-based farming decisions
- **Crop Health Monitoring** - AI-powered disease detection
- **Market Analytics** - Price trends and market insights

### 🌸 For Gardeners
- **Plant Health Scanner** - Instant disease identification using camera
- **Smart Garden Zones** - Organize and track different garden areas
- **Plant Care Reminders** - Scheduled watering, fertilizing, and maintenance
- **Community Platform** - Share experiences and get advice
- **AI Gardening Assistant** - 24/7 botanical expert chatbot

### 🎯 Core Features

#### 📱 Plant Disease Detection
- **Camera Integration** - Capture or select plant images
- **AI Analysis** - Instant disease identification and diagnosis
- **Dual Solutions** - Chemical and organic treatment options
- **Product Recommendations** - Direct links to required treatments
- **Shopping Integration** - In-app purchase with payment gateway

#### 🤖 AI Chatbot Assistant
- **Botanical Knowledge Base** - Expert gardening advice
- **Real-time Assistance** - Instant answers to plant care questions
- **Contextual Responses** - Tailored advice based on user queries
- **Floating Interface** - Accessible from anywhere in the app

#### 🌍 Community Platform
- **Social Sharing** - Post garden photos and experiences
- **Category Filtering** - Organize posts by plant types and topics
- **Interactive Engagement** - Like, comment, and share posts
- **Tag System** - Easy discovery of relevant content

#### 🌤️ Weather & Tips
- **Real-time Weather Data** - Current conditions and forecasts
- **5-Day Forecast** - Plan ahead for optimal gardening
- **Weather-based Tips** - Contextual gardening advice
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