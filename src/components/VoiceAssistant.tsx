import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  Text,
  Modal,
  Dimensions,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import VoiceAssistantTutorial from './VoiceAssistantTutorial';

const { width, height } = Dimensions.get('window');

interface VoiceAssistantProps {
  navigation: any;
}

interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [position, setPosition] = useState({ x: width - 80, y: height / 2 + 80 });
  const [showTutorial, setShowTutorial] = useState(false);

  // Animation values
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const listeningAnimation = useRef(new Animated.Value(0)).current;
  const modalAnimation = useRef(new Animated.Value(0)).current;

  // Voice commands mapping with keywords
  const voiceCommands: VoiceCommand[] = [
    {
      command: 'weather',
      action: () => navigation.navigate('WeatherTips'),
      description: 'Check weather tips'
    },
    {
      command: 'soil analysis',
      action: () => navigation.navigate('SoilAnalysis'),
      description: 'Go to soil analysis'
    },
    {
      command: 'plant disease',
      action: () => navigation.navigate('PlantDiseaseDetection'),
      description: 'Detect plant diseases'
    },
    {
      command: 'water schedule',
      action: () => navigation.navigate('WaterSchedule'),
      description: 'Check watering schedule'
    },
    {
      command: 'drone service',
      action: () => navigation.navigate('DroneService'),
      description: 'Book drone services'
    },
    {
      command: 'community',
      action: () => navigation.navigate('Community'),
      description: 'Visit community'
    },
    {
      command: 'profile',
      action: () => navigation.navigate('Profile'),
      description: 'Go to profile'
    },
    {
      command: 'settings',
      action: () => navigation.navigate('Settings'),
      description: 'Open settings'
    },
    {
      command: 'plant store',
      action: () => navigation.navigate('ProductStore'),
      description: 'Visit plant store'
    },
    {
      command: 'field management',
      action: () => navigation.navigate('FieldManagement'),
      description: 'Manage your fields'
    },
    {
      command: 'garden zones',
      action: () => navigation.navigate('GardenZones'),
      description: 'Check garden zones'
    },
    {
      command: 'farming tip',
      action: () => provideFarmingTip(),
      description: 'Get farming tip'
    },
    {
      command: 'help',
      action: () => showHelp(),
      description: 'Show help'
    },
  ];

  // Pan responder for dragging
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newX = Math.max(0, Math.min(width - 60, position.x + gestureState.dx));
      const newY = Math.max(50, Math.min(height - 120, position.y + gestureState.dy));
      setPosition({ x: newX, y: newY });
    },
    onPanResponderRelease: () => {
      // Snap to edges for better UX
      const snapToEdge = position.x > width / 2;
      setPosition(prev => ({
        ...prev,
        x: snapToEdge ? width - 70 : 10,
      }));
    },
  });

  useEffect(() => {
    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    // Check if tutorial should be shown
    checkTutorialStatus();

    return () => pulse.stop();
  }, []);

  const checkTutorialStatus = async () => {
    try {
      const tutorialCompleted = await AsyncStorage.getItem('voiceAssistantTutorialCompleted');
      if (!tutorialCompleted) {
        setTimeout(() => setShowTutorial(true), 2000); // Show after 2 seconds
      }
    } catch (error) {
      console.error('Error checking tutorial status:', error);
    }
  };

  const provideFarmingTip = () => {
    const hour = new Date().getHours();
    let tip = '';
    
    if (language === 'hi') {
      if (hour >= 6 && hour < 10) {
        tip = 'सुबह का समय पौधों को पानी देने के लिए सबसे अच्छा है।';
      } else if (hour >= 10 && hour < 16) {
        tip = 'दिन के समय छाया में काम करें और पौधों की जाँच करें।';
      } else if (hour >= 16 && hour < 19) {
        tip = 'शाम का समय उर्वरक डालने के लिए उपयुक्त है।';
      } else {
        tip = 'रात के समय कल के काम की योजना बनाएं।';
      }
    } else {
      if (hour >= 6 && hour < 10) {
        tip = 'Morning is the best time to water your plants.';
      } else if (hour >= 10 && hour < 16) {
        tip = 'Work in shade during daytime and check your plants.';
      } else if (hour >= 16 && hour < 19) {
        tip = 'Evening is suitable for applying fertilizers.';
      } else {
        tip = 'Night time is perfect for planning tomorrow\'s farming tasks.';
      }
    }
    
    setIsModalVisible(true);
    setCurrentResponse(tip);
    
    Animated.spring(modalAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();

    speak(tip);
  };

  useEffect(() => {
    if (isListening) {
      const listening = Animated.loop(
        Animated.sequence([
          Animated.timing(listeningAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(listeningAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      listening.start();
    } else {
      listeningAnimation.setValue(0);
    }
  }, [isListening]);

  const requestPermissions = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Microphone permission is required for voice assistant to work.'
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

  const startListening = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setIsRecording(true);
      setIsListening(true);
      setIsModalVisible(true);
      
      const listeningText = language === 'hi' ? 'सुन रहा हूँ...' : 'Listening...';
      setCurrentResponse(listeningText);

      // Animate modal
      Animated.spring(modalAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);

      // Simulate listening timeout (5 seconds)
      setTimeout(() => {
        stopListening();
      }, 5000);

      // Welcome message on first activation
      if (!currentResponse) {
        const hour = new Date().getHours();
        let greeting = '';
        
        if (language === 'hi') {
          if (hour < 12) greeting = 'सुप्रभात! मैं आपका खेती सहायक हूँ।';
          else if (hour < 17) greeting = 'नमस्ते! मैं आपका खेती सहायक हूँ।';
          else greeting = 'शुभ संध्या! मैं आपका खेती सहायक हूँ।';
        } else {
          if (hour < 12) greeting = 'Good morning! I am your farming assistant.';
          else if (hour < 17) greeting = 'Good afternoon! I am your farming assistant.';
          else greeting = 'Good evening! I am your farming assistant.';
        }
        
        const fullMessage = greeting + (language === 'hi' ? ' आप क्या जानना चाहते हैं?' : ' What would you like to know?');
        
        setTimeout(() => {
          speak(fullMessage);
        }, 500);
      }

    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsListening(false);
      setIsRecording(false);
      Alert.alert('Error', 'Failed to start voice recognition. Please try again.');
    }
  };

  const stopListening = async () => {
    try {
      setIsListening(false);
      setIsRecording(false);
      
      const processingText = language === 'hi' ? 'प्रोसेसिंग...' : 'Processing...';
      setCurrentResponse(processingText);

      if (recording) {
        await recording.stopAndUnloadAsync();
        setRecording(null);
      }

      // Simulate processing and response
      setTimeout(() => {
        processVoiceCommand();
      }, 1000);

    } catch (error) {
      console.error('Failed to stop recording:', error);
      closeModal();
    }
  };

  const processVoiceCommand = () => {
    // Simulate voice command processing
    // In a real app, you would use a speech-to-text service here
    const simulatedCommands = [
      'weather',
      'soil analysis',
      'plant disease',
      'water schedule',
      'drone service',
      'community',
      'profile',
      'settings'
    ];
    
    const randomCommand = simulatedCommands[Math.floor(Math.random() * simulatedCommands.length)];
    const command = voiceCommands.find(cmd => cmd.command === randomCommand);
    
    if (command) {
      const responseText = language === 'hi' 
        ? `${command.description} खोला जा रहा है...`
        : `Opening ${command.description}...`;
      
      setCurrentResponse(responseText);
      speak(responseText);
      
      setTimeout(() => {
        command.action();
        closeModal();
      }, 1500);
    } else {
      const errorText = language === 'hi'
        ? "माफ़ करें, मैं समझ नहीं पाया। कृपया फिर से कोशिश करें।"
        : "Sorry, I didn't understand that. Please try again.";
      
      setCurrentResponse(errorText);
      speak(errorText);
      
      setTimeout(() => {
        closeModal();
      }, 2000);
    }
  };

  const speak = (text: string) => {
    const languageMap: { [key: string]: string } = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'bn': 'bn-IN',
      'te': 'te-IN',
      'pa': 'pa-IN',
      'kn': 'kn-IN',
    };
    
    Speech.speak(text, {
      language: languageMap[language] || 'en-US',
      pitch: 1.0,
      rate: 0.9,
    });
  };

  const closeModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsModalVisible(false);
      setCurrentResponse('');
    });
  };

  const showHelp = () => {
    setIsModalVisible(true);
    
    const helpText = language === 'hi'
      ? 'उपलब्ध वॉयस कमांड: ' + voiceCommands.map(cmd => cmd.command).join(', ')
      : 'Voice commands available: ' + voiceCommands.map(cmd => cmd.command).join(', ');
    
    const speechText = language === 'hi'
      ? 'यहाँ उपलब्ध वॉयस कमांड हैं: ' + voiceCommands.map(cmd => cmd.command).join(', ')
      : 'Here are the available voice commands: ' + voiceCommands.map(cmd => cmd.command).join(', ');
    
    setCurrentResponse(helpText);
    
    Animated.spring(modalAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();

    speak(speechText);
  };

  const listeningScale = listeningAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  const listeningOpacity = listeningAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  const modalScale = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const modalOpacity = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <>
      {/* Voice Assistant Tutorial */}
      <VoiceAssistantTutorial
        visible={showTutorial}
        onClose={() => setShowTutorial(false)}
      />

      {/* Floating Voice Assistant Button */}
      <Animated.View
        style={[
          styles.floatingButton,
          {
            left: position.x,
            top: position.y,
            transform: [{ scale: pulseAnimation }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          onPress={startListening}
          onLongPress={showHelp}
          activeOpacity={0.8}
          style={styles.buttonContainer}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryLight]}
            style={styles.gradient}
          >
            <Animated.View
              style={[
                styles.iconContainer,
                isListening && {
                  transform: [{ scale: listeningScale }],
                  opacity: listeningOpacity,
                },
              ]}
            >
              <Ionicons
                name={isListening ? "mic" : "mic-outline"}
                size={24}
                color={theme.colors.surface}
              />
            </Animated.View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Voice Assistant Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [{ scale: modalScale }],
                opacity: modalOpacity,
              },
            ]}
          >
            <LinearGradient
              colors={[theme.colors.surface, theme.colors.background]}
              style={styles.modalGradient}
            >
              {/* Header */}
              <View style={styles.modalHeader}>
                <Ionicons
                  name="mic"
                  size={32}
                  color={theme.colors.primary}
                />
                <Text style={[styles.modalTitle, { color: theme.colors.text.primary }]}>
                  {language === 'hi' ? 'वॉयस असिस्टेंट' : 'Voice Assistant'}
                </Text>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={theme.colors.text.secondary}
                  />
                </TouchableOpacity>
              </View>

              {/* Listening Animation */}
              {isListening && (
                <View style={styles.listeningContainer}>
                  <Animated.View
                    style={[
                      styles.listeningWave,
                      {
                        transform: [{ scale: listeningScale }],
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.listeningWave,
                      styles.listeningWaveDelay,
                      {
                        transform: [{ scale: listeningScale }],
                        backgroundColor: theme.colors.primaryLight,
                      },
                    ]}
                  />
                </View>
              )}

              {/* Response Text */}
              <View style={styles.responseContainer}>
                <Text style={[styles.responseText, { color: theme.colors.text.primary }]}>
                  {currentResponse}
                </Text>
              </View>

              {/* Quick Actions */}
              {!isListening && !currentResponse.includes(language === 'hi' ? 'प्रोसेसिंग' : 'Processing') && (
                <View style={styles.quickActions}>
                  <TouchableOpacity
                    style={[styles.quickActionButton, { borderColor: theme.colors.primary }]}
                    onPress={() => {
                      const exampleText = language === 'hi'
                        ? 'कोशिश करें: मौसम देखें, या मिट्टी विश्लेषण, या पौधे की बीमारी पहचान'
                        : 'Try saying: Check weather, or Soil analysis, or Plant disease detection';
                      speak(exampleText);
                    }}
                  >
                    <Ionicons name="help-circle-outline" size={20} color={theme.colors.primary} />
                    <Text style={[styles.quickActionText, { color: theme.colors.primary }]}>
                      {language === 'hi' ? 'उदाहरण' : 'Examples'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.quickActionButton, { borderColor: theme.colors.primary }]}
                    onPress={startListening}
                  >
                    <Ionicons name="mic-outline" size={20} color={theme.colors.primary} />
                    <Text style={[styles.quickActionText, { color: theme.colors.primary }]}>
                      {language === 'hi' ? 'फिर कोशिश' : 'Try Again'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    zIndex: 1000,
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonContainer: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  modalGradient: {
    padding: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginLeft: spacing.sm,
  },
  closeButton: {
    padding: spacing.xs,
  },
  listeningContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    marginVertical: spacing.md,
  },
  listeningWave: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    opacity: 0.3,
  },
  listeningWaveDelay: {
    width: 80,
    height: 80,
    opacity: 0.2,
  },
  responseContainer: {
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  responseText: {
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: 24,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.lg,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderRadius: borderRadius.md,
  },
  quickActionText: {
    fontSize: fontSize.sm,
    marginLeft: spacing.xs,
  },
});

export default VoiceAssistant;
