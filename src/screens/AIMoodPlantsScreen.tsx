import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface AIMoodPlantsScreenProps {
  navigation: any;
}

interface MoodState {
  mood: 'stressed' | 'anxious' | 'tired' | 'depressed' | 'energetic' | 'calm' | 'focused' | 'happy';
  intensity: 1 | 2 | 3 | 4 | 5;
  timestamp: string;
}

interface PlantRecommendation {
  id: string;
  name: string;
  scientificName: string;
  icon: string;
  benefits: string[];
  moodTargets: string[];
  airPurifying: boolean;
  careLevel: 'easy' | 'medium' | 'hard';
  lightRequirement: 'low' | 'medium' | 'bright';
  aromatherapy: boolean;
  stressReduction: number; // 1-10 scale
  anxietyRelief: number; // 1-10 scale
  sleepImprovement: number; // 1-10 scale
  focusEnhancement: number; // 1-10 scale
  description: string;
  placement: string[];
  additionalTips: string[];
}

interface MoodAnalysis {
  primaryMood: string;
  stressLevel: number;
  recommendedPlants: PlantRecommendation[];
  environmentalTips: string[];
  wellnessTips: string[];
}

const { width, height } = Dimensions.get('window');

const AIMoodPlantsScreen: React.FC<AIMoodPlantsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { translations } = useLanguage();

  const [selectedTab, setSelectedTab] = useState<'assessment' | 'recommendations' | 'tracking' | 'wellness'>('assessment');
  const [currentMood, setCurrentMood] = useState<MoodState | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodState[]>([]);
  const [moodAnalysis, setMoodAnalysis] = useState<MoodAnalysis | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<PlantRecommendation | null>(null);
  const [showPlantModal, setShowPlantModal] = useState(false);

  const tabs = [
    { key: 'assessment', label: 'Mood Check', icon: 'heart' },
    { key: 'recommendations', label: 'Plant Rx', icon: 'leaf' },
    { key: 'tracking', label: 'Tracking', icon: 'analytics' },
    { key: 'wellness', label: 'Wellness', icon: 'fitness' },
  ];

  const moodOptions = [
    { mood: 'stressed', label: 'Stressed', icon: '😰', color: '#E74C3C' },
    { mood: 'anxious', label: 'Anxious', icon: '😟', color: '#F39C12' },
    { mood: 'tired', label: 'Tired', icon: '😴', color: '#95A5A6' },
    { mood: 'depressed', label: 'Down', icon: '😢', color: '#34495E' },
    { mood: 'energetic', label: 'Energetic', icon: 'flash', color: '#E67E22' },
    { mood: 'calm', label: 'Calm', icon: '😌', color: '#27AE60' },
    { mood: 'focused', label: 'Focused', icon: 'locate', color: '#3498DB' },
    { mood: 'happy', label: 'Happy', icon: '😊', color: '#2ECC71' },
  ];

  const plantDatabase: PlantRecommendation[] = [
    {
      id: '1',
      name: 'Lavender',
      scientificName: 'Lavandula angustifolia',
      icon: 'flower',
      benefits: ['Reduces anxiety', 'Improves sleep', 'Calming aroma', 'Stress relief'],
      moodTargets: ['stressed', 'anxious', 'tired'],
      airPurifying: false,
      careLevel: 'easy',
      lightRequirement: 'bright',
      aromatherapy: true,
      stressReduction: 9,
      anxietyRelief: 8,
      sleepImprovement: 9,
      focusEnhancement: 5,
      description: 'Lavender is renowned for its calming properties and is perfect for reducing stress and promoting better sleep.',
      placement: ['Bedroom', 'Living room', 'Study area'],
      additionalTips: [
        'Place near your bed for better sleep',
        'Dry the flowers for aromatherapy sachets',
        'Requires good drainage and sunlight',
      ],
    },
    {
      id: '2',
      name: 'Snake Plant',
      scientificName: 'Sansevieria trifasciata',
      icon: 'leaf',
      benefits: ['Purifies air', 'Releases oxygen at night', 'Low maintenance', 'Improves air quality'],
      moodTargets: ['tired', 'depressed', 'stressed'],
      airPurifying: true,
      careLevel: 'easy',
      lightRequirement: 'low',
      aromatherapy: false,
      stressReduction: 6,
      anxietyRelief: 5,
      sleepImprovement: 7,
      focusEnhancement: 6,
      description: 'Snake plants are excellent air purifiers that work while you sleep, improving air quality and mood.',
      placement: ['Bedroom', 'Office', 'Any room'],
      additionalTips: [
        'Perfect for beginners',
        'Water sparingly',
        'Tolerates low light conditions',
      ],
    },
    {
      id: '3',
      name: 'Peace Lily',
      scientificName: 'Spathiphyllum wallisii',
      icon: 'leaf',
      benefits: ['Air purification', 'Humidity control', 'Elegant appearance', 'Calming presence'],
      moodTargets: ['stressed', 'anxious', 'depressed'],
      airPurifying: true,
      careLevel: 'medium',
      lightRequirement: 'medium',
      aromatherapy: false,
      stressReduction: 7,
      anxietyRelief: 8,
      sleepImprovement: 6,
      focusEnhancement: 7,
      description: 'Peace lilies create a serene environment while purifying air and adding natural beauty to any space.',
      placement: ['Living room', 'Bedroom', 'Office'],
      additionalTips: [
        'Keep soil consistently moist',
        'Mist leaves regularly',
        'Remove dead flowers to encourage blooming',
      ],
    },
    {
      id: '4',
      name: 'Aloe Vera',
      scientificName: 'Aloe barbadensis',
      icon: '🌵',
      benefits: ['Air purification', 'Medicinal properties', 'Easy care', 'Stress relief'],
      moodTargets: ['stressed', 'tired'],
      airPurifying: true,
      careLevel: 'easy',
      lightRequirement: 'bright',
      aromatherapy: false,
      stressReduction: 6,
      anxietyRelief: 5,
      sleepImprovement: 5,
      focusEnhancement: 6,
      description: 'Aloe vera is a low-maintenance plant that purifies air and provides natural healing properties.',
      placement: ['Kitchen', 'Bathroom', 'Sunny windowsill'],
      additionalTips: [
        'Water deeply but infrequently',
        'Use gel for minor burns and cuts',
        'Prefers bright, indirect sunlight',
      ],
    },
    {
      id: '5',
      name: 'Jasmine',
      scientificName: 'Jasminum sambac',
      icon: 'flower',
      benefits: ['Aromatic flowers', 'Reduces anxiety', 'Improves sleep quality', 'Mood enhancement'],
      moodTargets: ['anxious', 'depressed', 'stressed'],
      airPurifying: false,
      careLevel: 'medium',
      lightRequirement: 'bright',
      aromatherapy: true,
      stressReduction: 8,
      anxietyRelief: 9,
      sleepImprovement: 8,
      focusEnhancement: 4,
      description: 'Jasmine flowers release a sweet fragrance that naturally reduces anxiety and promotes relaxation.',
      placement: ['Bedroom', 'Patio', 'Near windows'],
      additionalTips: [
        'Flowers bloom in evening',
        'Keep soil moist but not waterlogged',
        'Pinch flowers for tea or aromatherapy',
      ],
    },
    {
      id: '6',
      name: 'Rosemary',
      scientificName: 'Rosmarinus officinalis',
      icon: 'leaf',
      benefits: ['Enhances memory', 'Improves focus', 'Aromatic herb', 'Stress reduction'],
      moodTargets: ['tired', 'focused', 'stressed'],
      airPurifying: false,
      careLevel: 'easy',
      lightRequirement: 'bright',
      aromatherapy: true,
      stressReduction: 7,
      anxietyRelief: 6,
      sleepImprovement: 4,
      focusEnhancement: 9,
      description: 'Rosemary is known to enhance memory and concentration while providing a refreshing herbal aroma.',
      placement: ['Kitchen', 'Study area', 'Sunny window'],
      additionalTips: [
        'Use fresh sprigs for cooking',
        'Trim regularly to encourage growth',
        'Drought-tolerant once established',
      ],
    },
    {
      id: '7',
      name: 'Spider Plant',
      scientificName: 'Chlorophytum comosum',
      icon: 'flower',
      benefits: ['Air purification', 'Easy propagation', 'Non-toxic to pets', 'Mood boosting'],
      moodTargets: ['depressed', 'tired', 'stressed'],
      airPurifying: true,
      careLevel: 'easy',
      lightRequirement: 'medium',
      aromatherapy: false,
      stressReduction: 6,
      anxietyRelief: 6,
      sleepImprovement: 5,
      focusEnhancement: 7,
      description: 'Spider plants are cheerful, easy-to-grow air purifiers that boost mood with their vibrant green foliage.',
      placement: ['Hanging baskets', 'Shelves', 'Any room'],
      additionalTips: [
        'Propagate baby plants for gifts',
        'Water when topsoil is dry',
        'Safe around children and pets',
      ],
    },
    {
      id: '8',
      name: 'English Ivy',
      scientificName: 'Hedera helix',
      icon: 'leaf',
      benefits: ['Air purification', 'Removes toxins', 'Cascading beauty', 'Stress relief'],
      moodTargets: ['stressed', 'anxious', 'tired'],
      airPurifying: true,
      careLevel: 'medium',
      lightRequirement: 'medium',
      aromatherapy: false,
      stressReduction: 7,
      anxietyRelief: 7,
      sleepImprovement: 6,
      focusEnhancement: 6,
      description: 'English ivy is an excellent air purifier that creates a calming, natural atmosphere in any space.',
      placement: ['Hanging baskets', 'Bathrooms', 'Office'],
      additionalTips: [
        'Keep soil evenly moist',
        'Trim to control growth',
        'Benefits from occasional misting',
      ],
    },
  ];

  const analyzeMood = (mood: MoodState) => {
    const moodBasedPlants = plantDatabase.filter(plant => 
      plant.moodTargets.includes(mood.mood)
    );

    // Sort by effectiveness for the current mood
    const sortedPlants = moodBasedPlants.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      
      switch (mood.mood) {
        case 'stressed':
          scoreA = a.stressReduction;
          scoreB = b.stressReduction;
          break;
        case 'anxious':
          scoreA = a.anxietyRelief;
          scoreB = b.anxietyRelief;
          break;
        case 'tired':
          scoreA = a.sleepImprovement;
          scoreB = b.sleepImprovement;
          break;
        case 'focused':
          scoreA = a.focusEnhancement;
          scoreB = b.focusEnhancement;
          break;
        default:
          scoreA = (a.stressReduction + a.anxietyRelief) / 2;
          scoreB = (b.stressReduction + b.anxietyRelief) / 2;
      }
      
      return scoreB - scoreA;
    });

    const environmentalTips = [
      'Create a dedicated plant corner for daily meditation',
      'Ensure adequate natural light for both plants and mood',
      'Maintain good air circulation around your plants',
      'Keep plants at eye level for maximum visual impact',
    ];

    const wellnessTips = [
      'Spend 5-10 minutes daily caring for your plants',
      'Practice deep breathing near aromatic plants',
      'Take photos of your plants\' growth progress',
      'Create a plant care routine as a form of mindfulness',
    ];

    return {
      primaryMood: mood.mood,
      stressLevel: mood.intensity,
      recommendedPlants: sortedPlants.slice(0, 6),
      environmentalTips,
      wellnessTips,
    };
  };

  const handleMoodSelection = (selectedMood: string, intensity: number) => {
    const newMoodState: MoodState = {
      mood: selectedMood as any,
      intensity: intensity as any,
      timestamp: new Date().toISOString(),
    };

    setCurrentMood(newMoodState);
    setMoodHistory(prev => [newMoodState, ...prev.slice(0, 9)]);
    setMoodAnalysis(analyzeMood(newMoodState));
    setSelectedTab('recommendations');
  };

  const getMoodColor = (mood: string) => {
    const moodOption = moodOptions.find(option => option.mood === mood);
    return moodOption?.color || colors.primary;
  };

  const getWellnessScore = () => {
    if (moodHistory.length === 0) return 0;
    
    const recentMoods = moodHistory.slice(0, 7); // Last 7 entries
    const positiveModds = ['calm', 'happy', 'energetic', 'focused'];
    const positiveCount = recentMoods.filter(mood => 
      positiveModds.includes(mood.mood)
    ).length;
    
    return Math.round((positiveCount / recentMoods.length) * 100);
  };

  const getStyles = () => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerGradient: {
      paddingTop: StatusBar.currentHeight || spacing.xl,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.lg,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    backButton: {
      padding: spacing.sm,
      marginRight: spacing.md,
    },
    headerTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.surface,
    },
    settingsButton: {
      padding: spacing.sm,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      marginHorizontal: spacing.lg,
      marginTop: spacing.lg,
      borderRadius: borderRadius.lg,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    tab: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      borderRadius: borderRadius.lg,
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    tabText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.text.secondary,
      marginTop: spacing.xs / 2,
    },
    activeTabText: {
      color: colors.surface,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
    },
    assessmentContainer: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    assessmentTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    assessmentSubtitle: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      textAlign: 'center',
      marginBottom: spacing.lg,
      lineHeight: 20,
    },
    moodGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    moodOption: {
      width: '48%',
      backgroundColor: colors.background,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedMoodOption: {
      borderColor: colors.primary,
    },
    moodEmoji: {
      fontSize: 32,
      marginBottom: spacing.sm,
    },
    moodLabel: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
      textAlign: 'center',
    },
    intensityContainer: {
      marginTop: spacing.lg,
    },
    intensityTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    intensityScale: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
    },
    intensityButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.border,
    },
    selectedIntensityButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    intensityText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
    },
    selectedIntensityText: {
      color: colors.surface,
    },
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      alignItems: 'center',
    },
    submitButtonText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.surface,
    },
    analysisContainer: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.lg,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    analysisTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    currentMoodDisplay: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    currentMoodText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginLeft: spacing.sm,
    },
    plantCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    plantHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    plantEmoji: {
      fontSize: 24,
      marginRight: spacing.md,
    },
    plantInfo: {
      flex: 1,
    },
    plantName: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    scientificName: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      fontStyle: 'italic',
    },
    plantBadges: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: spacing.sm,
    },
    plantBadge: {
      backgroundColor: colors.background,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
      borderRadius: borderRadius.sm,
      marginRight: spacing.xs,
      marginBottom: spacing.xs,
    },
    badgeText: {
      fontSize: fontSize.xs,
      color: colors.text.primary,
    },
    plantDescription: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      lineHeight: 18,
      marginTop: spacing.sm,
    },
    effectiveness: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.sm,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    effectivenessItem: {
      alignItems: 'center',
    },
    effectivenessLabel: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
    },
    effectivenessScore: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      color: colors.primary,
    },
    plantActions: {
      flexDirection: 'row',
      marginTop: spacing.md,
    },
    actionButton: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.sm,
      alignItems: 'center',
      marginHorizontal: spacing.xs,
    },
    primaryButton: {
      backgroundColor: colors.primary,
    },
    secondaryButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    primaryButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.surface,
    },
    secondaryButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
    },
    trackingContainer: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.lg,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    trackingTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    wellnessScore: {
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    scoreCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    scoreText: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.surface,
    },
    scoreLabel: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    historyItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    historyLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    historyMood: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
      marginLeft: spacing.sm,
    },
    historyTime: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
    },
    intensityIndicator: {
      flexDirection: 'row',
    },
    intensityDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.border,
      marginHorizontal: 1,
    },
    activeDot: {
      backgroundColor: colors.primary,
    },
    wellnessContainer: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    wellnessTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    tipsList: {
      marginTop: spacing.sm,
    },
    tipItem: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
      lineHeight: 18,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xl,
    },
    emptyStateText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      textAlign: 'center',
      marginTop: spacing.md,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      width: width * 0.9,
      maxHeight: height * 0.8,
    },
    modalTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    closeButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      alignItems: 'center',
      marginTop: spacing.lg,
    },
    closeButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.surface,
    },
  });

  const styles = getStyles();

  const renderAssessmentTab = () => {
    const [selectedMood, setSelectedMood] = useState<string>('');
    const [selectedIntensity, setSelectedIntensity] = useState<number>(0);

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.assessmentContainer}>
          <Text style={styles.assessmentTitle}>How are you feeling today?</Text>
          <Text style={styles.assessmentSubtitle}>
            Select your current mood to get personalized plant recommendations for better mental wellness.
          </Text>

          <View style={styles.moodGrid}>
            {moodOptions.map((option) => (
              <TouchableOpacity
                key={option.mood}
                style={[
                  styles.moodOption,
                  selectedMood === option.mood && styles.selectedMoodOption,
                ]}
                onPress={() => setSelectedMood(option.mood)}
              >
                <Ionicons name={option.icon as any} size={24} color={colors.surface} />
                <Text style={styles.moodLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedMood && (
            <View style={styles.intensityContainer}>
              <Text style={styles.intensityTitle}>How intense is this feeling?</Text>
              <View style={styles.intensityScale}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.intensityButton,
                      selectedIntensity === level && styles.selectedIntensityButton,
                    ]}
                    onPress={() => setSelectedIntensity(level)}
                  >
                    <Text
                      style={[
                        styles.intensityText,
                        selectedIntensity === level && styles.selectedIntensityText,
                      ]}
                    >
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {selectedIntensity > 0 && (
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => handleMoodSelection(selectedMood, selectedIntensity)}
                >
                  <Text style={styles.submitButtonText}>Get Plant Recommendations</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  const renderRecommendationsTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {moodAnalysis ? (
        <>
          <View style={styles.analysisContainer}>
            <Text style={styles.analysisTitle}>Your Mood Analysis</Text>
            <View style={styles.currentMoodDisplay}>
              <Text style={styles.moodEmoji}>
                <Ionicons 
                  name={moodOptions.find(option => option.mood === moodAnalysis.primaryMood)?.icon as any} 
                  size={20} 
                  color={colors.primary} 
                  style={{ marginRight: spacing.sm }} 
                />
                <Text style={styles.analysisTitle}>Primary Mood</Text>
              </Text>
              <Text style={styles.currentMoodText}>
                Feeling {moodAnalysis.primaryMood} (Level {currentMood?.intensity}/5)
              </Text>
            </View>
            <Text style={styles.plantDescription}>
              Based on your current mood, here are the best plants to help improve your mental wellness:
            </Text>
          </View>

          {moodAnalysis.recommendedPlants.map((plant) => (
            <View key={plant.id} style={styles.plantCard}>
              <View style={styles.plantHeader}>
                <Ionicons name={plant.icon as any} size={24} color={colors.primary} />
                <View style={styles.plantInfo}>
                  <Text style={styles.plantName}>{plant.name}</Text>
                  <Text style={styles.scientificName}>{plant.scientificName}</Text>
                </View>
              </View>

              <View style={styles.plantBadges}>
                <View style={[styles.plantBadge, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.badgeText, { color: colors.primary }]}>
                    {plant.careLevel} care
                  </Text>
                </View>
                <View style={[styles.plantBadge, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.badgeText, { color: colors.primary }]}>
                    {plant.lightRequirement} light
                  </Text>
                </View>
                {plant.airPurifying && (
                  <View style={[styles.plantBadge, { backgroundColor: '#27AE60' + '20' }]}>
                    <Text style={[styles.badgeText, { color: '#27AE60' }]}>
                      Air purifying
                    </Text>
                  </View>
                )}
                {plant.aromatherapy && (
                  <View style={[styles.plantBadge, { backgroundColor: '#9B59B6' + '20' }]}>
                    <Text style={[styles.badgeText, { color: '#9B59B6' }]}>
                      Aromatherapy
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.plantDescription}>{plant.description}</Text>

              <View style={styles.effectiveness}>
                <View style={styles.effectivenessItem}>
                  <Text style={styles.effectivenessLabel}>Stress Relief</Text>
                  <Text style={styles.effectivenessScore}>{plant.stressReduction}/10</Text>
                </View>
                <View style={styles.effectivenessItem}>
                  <Text style={styles.effectivenessLabel}>Anxiety Relief</Text>
                  <Text style={styles.effectivenessScore}>{plant.anxietyRelief}/10</Text>
                </View>
                <View style={styles.effectivenessItem}>
                  <Text style={styles.effectivenessLabel}>Sleep Quality</Text>
                  <Text style={styles.effectivenessScore}>{plant.sleepImprovement}/10</Text>
                </View>
                <View style={styles.effectivenessItem}>
                  <Text style={styles.effectivenessLabel}>Focus</Text>
                  <Text style={styles.effectivenessScore}>{plant.focusEnhancement}/10</Text>
                </View>
              </View>

              <View style={styles.plantActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.secondaryButton]}
                  onPress={() => {
                    setSelectedPlant(plant);
                    setShowPlantModal(true);
                  }}
                >
                  <Text style={styles.secondaryButtonText}>Care Guide</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.primaryButton]}
                  onPress={() => Alert.alert('Added to Wishlist', `${plant.name} added to your plant wishlist!`)}
                >
                  <Text style={styles.primaryButtonText}>Add to Wishlist</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="leaf" size={64} color={colors.text.secondary} />
          <Text style={styles.emptyStateText}>
            Complete your mood assessment to get personalized plant recommendations.
          </Text>
        </View>
      )}
    </ScrollView>
  );

  const renderTrackingTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.trackingContainer}>
        <Text style={styles.trackingTitle}>Wellness Score</Text>
        <View style={styles.wellnessScore}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>{getWellnessScore()}</Text>
          </View>
          <Text style={styles.scoreLabel}>Overall Wellness</Text>
        </View>
      </View>

      <View style={styles.trackingContainer}>
        <Text style={styles.trackingTitle}>Recent Mood History</Text>
        {moodHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="analytics" size={48} color={colors.text.secondary} />
            <Text style={styles.emptyStateText}>
              No mood data yet. Start tracking your mood to see patterns and progress.
            </Text>
          </View>
        ) : (
          moodHistory.map((mood, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <Text style={styles.moodEmoji}>
                  <Ionicons 
                    name={moodOptions.find(option => option.mood === mood.mood)?.icon as any} 
                    size={16} 
                    color={colors.primary} 
                    style={{ marginRight: spacing.xs }} 
                  />
                  <Text style={styles.wellnessTitle}>{mood.mood}</Text>
                </Text>
                <View>
                  <Text style={styles.historyMood}>{mood.mood}</Text>
                  <Text style={styles.historyTime}>
                    {new Date(mood.timestamp).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View style={styles.intensityIndicator}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <View
                    key={level}
                    style={[
                      styles.intensityDot,
                      level <= mood.intensity && styles.activeDot,
                    ]}
                  />
                ))}
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );

  const renderWellnessTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.wellnessContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
          <Ionicons name="leaf" size={20} color={colors.success} style={{ marginRight: spacing.sm }} />
          <Text style={styles.wellnessTitle}>Plant Care for Mental Wellness</Text>
        </View>
        <View style={styles.tipsList}>
          <Text style={styles.tipItem}>
            • Spend 10-15 minutes daily caring for your plants as a mindfulness practice
          </Text>
          <Text style={styles.tipItem}>
            • Create a morning routine that includes checking on your plants
          </Text>
          <Text style={styles.tipItem}>
            • Use plant care as a break from screen time and digital stress
          </Text>
          <Text style={styles.tipItem}>
            • Practice deep breathing exercises near aromatic plants like lavender
          </Text>
        </View>
      </View>

      <View style={styles.wellnessContainer}>
        <Text style={styles.wellnessTitle}>🏠 Creating a Healing Environment</Text>
        <View style={styles.tipsList}>
          <Text style={styles.tipItem}>
            • Place plants in areas where you spend the most time
          </Text>
          <Text style={styles.tipItem}>
            • Ensure adequate natural light for both plants and your circadian rhythm
          </Text>
          <Text style={styles.tipItem}>
            • Group plants together to create a mini indoor garden sanctuary
          </Text>
          <Text style={styles.tipItem}>
            • Keep a plant journal to track both plant growth and your mood
          </Text>
        </View>
      </View>

      <View style={styles.wellnessContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
          <Ionicons name="flower" size={20} color={colors.primary} style={{ marginRight: spacing.sm }} />
          <Text style={styles.wellnessTitle}>Mindfulness with Plants</Text>
        </View>
        <View style={styles.tipsList}>
          <Text style={styles.tipItem}>
            • Practice gratitude while watering your plants
          </Text>
          <Text style={styles.tipItem}>
            • Observe the details: new leaves, growth patterns, color changes
          </Text>
          <Text style={styles.tipItem}>
            • Use plant propagation as a metaphor for personal growth
          </Text>
          <Text style={styles.tipItem}>
            • Share plants with friends to build social connections
          </Text>
        </View>
      </View>

      <View style={styles.wellnessContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
          <Ionicons name="flower" size={20} color={colors.secondary} style={{ marginRight: spacing.sm }} />
          <Text style={styles.wellnessTitle}>Natural Aromatherapy</Text>
        </View>
        <View style={styles.tipsList}>
          <Text style={styles.tipItem}>
            • Gently rub herb leaves (mint, rosemary) to release natural oils
          </Text>
          <Text style={styles.tipItem}>
            • Place flowering plants like jasmine near your bedroom
          </Text>
          <Text style={styles.tipItem}>
            • Dry lavender flowers to make natural sleep sachets
          </Text>
          <Text style={styles.tipItem}>
            • Use fresh herbs from your plants in teas and cooking
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primary + 'DD']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.surface} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>AI Mood Plants</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="heart" size={24} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
            onPress={() => setSelectedTab(tab.key as any)}
          >
            <Ionicons
              name={tab.icon as any}
              size={18}
              color={selectedTab === tab.key ? colors.surface : colors.text.secondary}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {selectedTab === 'assessment' && renderAssessmentTab()}
        {selectedTab === 'recommendations' && renderRecommendationsTab()}
        {selectedTab === 'tracking' && renderTrackingTab()}
        {selectedTab === 'wellness' && renderWellnessTab()}
      </View>

      {/* Plant Details Modal */}
      <Modal
        visible={showPlantModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPlantModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedPlant && (
              <>
                <Text style={styles.modalTitle}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name={selectedPlant.icon as any} size={20} color={colors.primary} style={{ marginRight: spacing.sm }} />
                    <Text style={styles.modalTitle}>{selectedPlant.name}</Text>
                  </View>
                </Text>
                
                <ScrollView style={{ maxHeight: height * 0.6 }}>
                  <Text style={styles.plantDescription}>{selectedPlant.description}</Text>
                  
                  <Text style={styles.wellnessTitle}>Best Placement:</Text>
                  <View style={styles.tipsList}>
                    {selectedPlant.placement.map((place, index) => (
                      <Text key={index} style={styles.tipItem}>• {place}</Text>
                    ))}
                  </View>
                  
                  <Text style={styles.wellnessTitle}>Care Tips:</Text>
                  <View style={styles.tipsList}>
                    {selectedPlant.additionalTips.map((tip, index) => (
                      <Text key={index} style={styles.tipItem}>• {tip}</Text>
                    ))}
                  </View>
                  
                  <Text style={styles.wellnessTitle}>Benefits:</Text>
                  <View style={styles.tipsList}>
                    {selectedPlant.benefits.map((benefit, index) => (
                      <Text key={index} style={styles.tipItem}>• {benefit}</Text>
                    ))}
                  </View>
                </ScrollView>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowPlantModal(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AIMoodPlantsScreen;
