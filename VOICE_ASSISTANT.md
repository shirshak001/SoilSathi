# Voice Assistant - SoilSathi

## Overview
The Voice Assistant is an intelligent voice-controlled feature that allows users to navigate through the SoilSathi app using voice commands. It supports multiple languages and provides audio feedback for a seamless user experience.

## Features

### 🎤 Voice Commands
- **Weather**: Check weather tips and conditions
- **Soil Analysis**: Navigate to soil analysis tools
- **Plant Disease**: Access plant disease detection
- **Water Schedule**: View watering schedules
- **Drone Service**: Book drone services
- **Community**: Visit community forums
- **Profile**: Access user profile
- **Settings**: Open app settings
- **Plant Store**: Browse plant store
- **Garden Zones**: Check garden zones

### 🌍 Multilingual Support
- English (en-US)
- Hindi (hi-IN)
- Tamil (ta-IN)
- Bengali (bn-IN)
- Telugu (te-IN)
- Punjabi (pa-IN)
- Kannada (kn-IN)

### 🎨 Design Features
- Floating draggable button
- Smooth animations and transitions
- Visual listening feedback
- Gradient design matching app theme
- Edge snapping for better UX

## How to Use

### Basic Usage
1. **Tap** the floating microphone button to start listening
2. **Speak** your command clearly
3. **Wait** for the assistant to process and respond
4. **Navigate** automatically to the requested screen

### Advanced Features
- **Long Press** the button to hear available commands
- **Drag** the button to reposition it on screen
- **Tap outside** the modal to close it
- **Use examples** button for command suggestions

### Voice Command Examples
- "Check weather"
- "Soil analysis"
- "Plant disease detection"
- "Water my plants"
- "Drone services"
- "Community forum"

## Technical Details

### Dependencies
- `expo-speech`: Text-to-speech functionality
- `expo-av`: Audio recording and playback
- `@expo/vector-icons`: UI icons
- `expo-linear-gradient`: Gradient backgrounds

### Permissions Required
- Microphone access for voice input
- Audio recording permissions

### Architecture
- React functional component with hooks
- Animated API for smooth transitions
- PanResponder for drag functionality
- Context integration for theme and language

## Customization

### Adding New Commands
```tsx
{
  command: 'new command',
  action: () => navigation.navigate('ScreenName'),
  description: 'Command description'
}
```

### Language Support
The assistant automatically detects the user's language preference from the LanguageContext and provides appropriate text-to-speech output.

### Theme Integration
The component fully integrates with the app's theme system, adapting colors and styling based on the current theme.

## Accessibility
- Voice feedback for all interactions
- Visual indicators for listening state
- High contrast design elements
- Support for screen readers

## Future Enhancements
- Real speech-to-text integration
- Custom wake word detection
- Advanced NLP for natural language understanding
- Contextual responses based on current screen
- Voice shortcuts for complex actions

## Troubleshooting

### Common Issues
1. **Microphone not working**: Check app permissions
2. **Voice not recognized**: Ensure clear speech and minimal background noise
3. **Commands not working**: Verify command names match exactly
4. **Assistant not responding**: Check device audio settings

### Performance Tips
- Close other apps using microphone
- Use in quiet environment
- Speak clearly and at normal pace
- Wait for processing to complete

---

*Voice Assistant is part of the SoilSathi agricultural technology platform, designed to make farming knowledge more accessible through voice interaction.*
