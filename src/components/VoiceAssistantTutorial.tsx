import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

const { width, height } = Dimensions.get('window');

interface VoiceAssistantTutorialProps {
  visible: boolean;
  onClose: () => void;
}

const VoiceAssistantTutorial: React.FC<VoiceAssistantTutorialProps> = ({
  visible,
  onClose,
}) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: language === 'hi' ? 'वॉयस असिस्टेंट में आपका स्वागत है!' : 'Welcome to Voice Assistant!',
      description: language === 'hi' 
        ? 'अब आप आवाज़ से SoilSathi को नियंत्रित कर सकते हैं।'
        : 'You can now control SoilSathi with your voice.',
      icon: 'mic-outline',
    },
    {
      title: language === 'hi' ? 'माइक बटन दबाएं' : 'Tap the Mic Button',
      description: language === 'hi'
        ? 'फ्लोटिंग माइक बटन दबाकर बोलना शुरू करें।'
        : 'Tap the floating mic button to start speaking.',
      icon: 'radio-button-on-outline',
    },
    {
      title: language === 'hi' ? 'आवाज़ कमांड बोलें' : 'Speak Voice Commands',
      description: language === 'hi'
        ? '"मौसम देखें", "मिट्टी विश्लेषण", या "पौधे की बीमारी" कहें।'
        : 'Say "Check weather", "Soil analysis", or "Plant disease".',
      icon: 'chatbubble-outline',
    },
    {
      title: language === 'hi' ? 'बटन खींचें' : 'Drag the Button',
      description: language === 'hi'
        ? 'माइक बटन को अपनी सुविधा के लिए कहीं भी खींच सकते हैं।'
        : 'Drag the mic button anywhere for your convenience.',
      icon: 'move-outline',
    },
    {
      title: language === 'hi' ? 'लंबे समय तक दबाएं' : 'Long Press for Help',
      description: language === 'hi'
        ? 'सभी उपलब्ध कमांड सुनने के लिए बटन को लंबे समय तक दबाएं।'
        : 'Long press the button to hear all available commands.',
      icon: 'help-circle-outline',
    },
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem('voiceAssistantTutorialCompleted', 'true');
      onClose();
    } catch (error) {
      console.error('Error saving tutorial completion:', error);
      onClose();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const currentStepData = tutorialSteps[currentStep];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryLight]}
            style={styles.header}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={currentStepData.icon as any}
                size={48}
                color={theme.colors.surface}
              />
            </View>
            <Text style={[styles.title, { color: theme.colors.surface }]}>
              {currentStepData.title}
            </Text>
          </LinearGradient>

          <View style={styles.content}>
            <Text style={[styles.description, { color: theme.colors.text.primary }]}>
              {currentStepData.description}
            </Text>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              {tutorialSteps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    {
                      backgroundColor: index === currentStep
                        ? theme.colors.primary
                        : theme.colors.border,
                    },
                  ]}
                />
              ))}
            </View>

            {/* Step Counter */}
            <Text style={[styles.stepCounter, { color: theme.colors.text.secondary }]}>
              {currentStep + 1} {language === 'hi' ? 'का' : 'of'} {tutorialSteps.length}
            </Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.skipButton, { borderColor: theme.colors.border }]}
                onPress={handleSkip}
              >
                <Text style={[styles.buttonText, { color: theme.colors.text.secondary }]}>
                  {language === 'hi' ? 'छोड़ें' : 'Skip'}
                </Text>
              </TouchableOpacity>

              {currentStep > 0 && (
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton, { borderColor: theme.colors.primary }]}
                  onPress={handlePrevious}
                >
                  <Text style={[styles.buttonText, { color: theme.colors.primary }]}>
                    {language === 'hi' ? 'पिछला' : 'Previous'}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleNext}
              >
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.primaryLight]}
                  style={styles.buttonGradient}
                >
                  <Text style={[styles.buttonText, { color: theme.colors.surface }]}>
                    {currentStep === tutorialSteps.length - 1
                      ? (language === 'hi' ? 'समाप्त' : 'Finish')
                      : (language === 'hi' ? 'अगला' : 'Next')
                    }
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  container: {
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
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  iconContainer: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
  },
  content: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  description: {
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  stepCounter: {
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  footer: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minWidth: 70,
  },
  skipButton: {
    borderWidth: 1,
  },
  secondaryButton: {
    borderWidth: 1,
  },
  primaryButton: {
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  buttonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
});

export default VoiceAssistantTutorial;
