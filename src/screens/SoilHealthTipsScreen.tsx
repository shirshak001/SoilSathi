import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface SoilHealthTipsScreenProps {
  navigation: any;
}

interface TipContent {
  id: string;
  title: string;
  category: 'composting' | 'watering' | 'recycling' | 'soil-care' | 'planting';
  kidsContent: {
    title: string;
    description: string;
    character: string;
    steps: string[];
    funFact: string;
    emoji: string;
  };
  elderlyContent: {
    title: string;
    description: string;
    detailedSteps: string[];
    tips: string[];
    warnings: string[];
    voiceScript: string;
  };
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const { width, height } = Dimensions.get('window');

const SoilHealthTipsScreen: React.FC<SoilHealthTipsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { translations } = useLanguage();

  const [selectedMode, setSelectedMode] = useState<'kids' | 'elderly' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTip, setSelectedTip] = useState<TipContent | null>(null);
  const [showTipModal, setShowTipModal] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [animatedValues] = useState({
    kids: new Animated.Value(0),
    elderly: new Animated.Value(0),
  });

  const soilHealthTips: TipContent[] = [
    {
      id: 'composting-basics',
      title: 'Basic Composting',
      category: 'composting',
      kidsContent: {
        title: 'Meet Compo the Composter!',
        description: 'Compo loves turning food scraps into plant food! Let\'s help him make magical soil!',
        character: 'Wizard',
        steps: [
          'Collect kitchen scraps (no meat!)',
          'Add brown stuff like leaves',
          'Sprinkle water to keep it damp',
          'Mix it up every week',
          'Wait 2-3 months for magic soil!'
        ],
        funFact: 'Did you know? Compost helps plants grow 3 times faster!',
        emoji: 'refresh'
      },
      elderlyContent: {
        title: 'Comprehensive Composting Guide',
        description: 'A step-by-step approach to creating nutrient-rich compost for your garden.',
        detailedSteps: [
          'Choose a suitable location: Select a shaded area with good drainage',
          'Gather materials: Collect both "green" (nitrogen-rich) and "brown" (carbon-rich) materials',
          'Layer materials: Alternate green and brown materials in 3-inch layers',
          'Maintain moisture: Keep compost as moist as a wrung-out sponge',
          'Turn regularly: Use a pitchfork to turn compost every 2-3 weeks',
          'Monitor temperature: Compost should heat up to 130-160°F when active',
          'Harvest compost: Ready in 2-6 months when dark and crumbly'
        ],
        tips: [
          'Maintain a 3:1 ratio of brown to green materials',
          'Chop materials into smaller pieces to speed decomposition',
          'Add compost accelerator if decomposition is slow'
        ],
        warnings: [
          'Avoid meat, dairy, and oily foods to prevent pests',
          'Do not compost diseased plants or weeds with seeds'
        ],
        voiceScript: 'Composting is nature\'s way of recycling. Start by choosing a shaded area with good drainage...'
      },
      icon: 'leaf',
      difficulty: 'easy'
    },
    {
      id: 'smart-watering',
      title: 'Smart Watering',
      category: 'watering',
      kidsContent: {
        title: 'Splash the Water Wizard!',
        description: 'Splash knows exactly when plants are thirsty! Let\'s learn his water magic!',
        character: 'Water Wizard',
        steps: [
          'Stick your finger in the soil',
          'If it\'s dry, plants need water',
          'Water early morning or evening',
          'Water the roots, not the leaves',
          'Give deep water, not just sprinkles'
        ],
        funFact: 'Plants drink water through their roots like using a straw!',
        emoji: 'water'
      },
      elderlyContent: {
        title: 'Efficient Watering Techniques',
        description: 'Master the art of proper plant hydration with these proven methods.',
        detailedSteps: [
          'Test soil moisture: Insert finger 1-2 inches into soil near plant base',
          'Check soil type: Clay soils retain water longer than sandy soils',
          'Time your watering: Water between 6-8 AM or after 6 PM to minimize evaporation',
          'Use proper technique: Water slowly at soil level, avoiding leaves',
          'Apply adequate amount: Water until you see runoff from drainage holes',
          'Mulch around plants: Apply 2-3 inch layer to retain moisture',
          'Adjust for weather: Reduce watering during rainy periods'
        ],
        tips: [
          'Group plants with similar water needs together',
          'Use drip irrigation for consistent moisture',
          'Install rain gauges to track natural precipitation'
        ],
        warnings: [
          'Overwatering can cause root rot and fungal diseases',
          'Avoid watering during peak sun hours (10 AM - 4 PM)'
        ],
        voiceScript: 'Proper watering is crucial for plant health. Begin by testing the soil moisture level...'
      },
      icon: 'water',
      difficulty: 'easy'
    },
    {
      id: 'recycling-garden',
      title: 'Garden Recycling',
      category: 'recycling',
      kidsContent: {
        title: 'Eco the Recycling Hero!',
        description: 'Eco turns trash into treasure for the garden! Join the recycling adventure!',
        character: 'Hero',
        steps: [
          'Clean tin cans for plant pots',
          'Cut plastic bottles for mini greenhouses',
          'Use newspaper as mulch',
          'Plant seeds in egg cartons',
          'Save toilet rolls for seedling pots'
        ],
        funFact: 'One plastic bottle can become a greenhouse for 6 plants!',
        emoji: 'refresh'
      },
      elderlyContent: {
        title: 'Sustainable Garden Recycling',
        description: 'Transform household waste into valuable gardening resources.',
        detailedSteps: [
          'Assess materials: Identify safe, non-toxic containers and materials',
          'Prepare containers: Clean thoroughly and create drainage holes',
          'Size appropriately: Match container size to plant requirements',
          'Consider longevity: Use UV-resistant materials for outdoor use',
          'Label containers: Mark recycled containers with plant names and dates',
          'Monitor plant health: Check for any adverse effects from recycled materials',
          'Dispose responsibly: Replace when materials begin to degrade'
        ],
        tips: [
          'Use food-grade containers only for edible plants',
          'Paint dark containers white to prevent root overheating',
          'Stack similar containers for space-efficient storage'
        ],
        warnings: [
          'Avoid containers that held chemicals or toxic substances',
          'Ensure adequate drainage to prevent waterlogging'
        ],
        voiceScript: 'Garden recycling helps reduce waste while saving money on gardening supplies...'
      },
      icon: 'refresh',
      difficulty: 'medium'
    }
  ];

  const categories = [
    { key: 'all', label: 'All Tips', icon: 'apps', color: colors.primary },
    { key: 'composting', label: 'Composting', icon: 'leaf', color: colors.success },
    { key: 'watering', label: 'Watering', icon: 'water', color: colors.primaryLight },
    { key: 'recycling', label: 'Recycling', icon: 'refresh', color: colors.warning },
    { key: 'soil-care', label: 'Soil Care', icon: 'fitness', color: colors.secondary },
    { key: 'planting', label: 'Planting', icon: 'flower', color: colors.error },
  ];

  useEffect(() => {
    if (selectedMode === 'kids') {
      Animated.spring(animatedValues.kids, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else if (selectedMode === 'elderly') {
      Animated.spring(animatedValues.elderly, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedMode]);

  const filteredTips = selectedCategory === 'all' 
    ? soilHealthTips 
    : soilHealthTips.filter(tip => tip.category === selectedCategory);

  const styles = StyleSheet.create({
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
    headerTitle: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.surface,
      flex: 1,
      textAlign: 'center',
    },
    backButton: {
      padding: spacing.sm,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },
    modeSelector: {
      marginVertical: spacing.lg,
    },
    modeSelectorTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    modeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    modeCard: {
      flex: 1,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      alignItems: 'center',
      elevation: 3,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    kidsMode: {
      backgroundColor: '#FFE4E1',
    },
    elderlyMode: {
      backgroundColor: '#E6F3FF',
    },
    modeTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      marginBottom: spacing.sm,
    },
    kidsModeTitle: {
      color: '#FF6B9D',
    },
    elderlyModeTitle: {
      color: '#4A90E2',
    },
    modeDescription: {
      fontSize: fontSize.sm,
      textAlign: 'center',
      color: colors.text.secondary,
    },
    categoriesContainer: {
      marginVertical: spacing.lg,
    },
    categoriesTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    categoriesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    categoryItem: {
      width: '30%',
      alignItems: 'center',
      padding: spacing.sm,
      borderRadius: borderRadius.md,
      backgroundColor: colors.surface,
      marginBottom: spacing.sm,
    },
    selectedCategory: {
      backgroundColor: colors.primaryLight,
    },
    categoryIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    categoryLabel: {
      fontSize: fontSize.xs,
      textAlign: 'center',
      color: colors.text.primary,
    },
    selectedCategoryLabel: {
      color: colors.surface,
      fontWeight: fontWeight.bold,
    },
    tipsContainer: {
      flex: 1,
    },
    tipCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    kidsTipCard: {
      borderWidth: 3,
      borderColor: '#FFB6C1',
      backgroundColor: '#FFF8F0',
    },
    elderlyTipCard: {
      borderWidth: 2,
      borderColor: '#B0E0E6',
      backgroundColor: '#F8FCFF',
    },
    tipHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    tipIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    tipTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      flex: 1,
    },
    kidsTipTitle: {
      fontSize: fontSize.xl,
      color: '#FF6B9D',
    },
    elderlyTipTitle: {
      fontSize: fontSize.xl,
      color: '#4A90E2',
    },
    difficultyBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      alignSelf: 'flex-start',
    },
    difficultyText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.bold,
      color: colors.surface,
    },
    tipDescription: {
      fontSize: fontSize.md,
      color: colors.text.secondary,
      lineHeight: 20,
    },
    kidsTipDescription: {
      fontSize: fontSize.lg,
      color: '#8B4513',
      lineHeight: 24,
    },
    elderlyTipDescription: {
      fontSize: fontSize.lg,
      color: '#2F4F4F',
      lineHeight: 26,
    },
    // Modal styles
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      margin: spacing.lg,
      maxHeight: '85%',
      width: '90%',
    },
    kidsModalContent: {
      backgroundColor: '#FFF8F0',
      borderWidth: 4,
      borderColor: '#FFB6C1',
    },
    elderlyModalContent: {
      backgroundColor: '#F8FCFF',
      borderWidth: 2,
      borderColor: '#B0E0E6',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    modalIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    modalTitle: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      flex: 1,
    },
    kidsModalTitle: {
      fontSize: fontSize.xxl,
      color: '#FF6B9D',
    },
    elderlyModalTitle: {
      fontSize: fontSize.xxl,
      color: '#4A90E2',
    },
    closeButton: {
      padding: spacing.sm,
    },
    characterSection: {
      alignItems: 'center',
      marginBottom: spacing.lg,
      padding: spacing.lg,
      backgroundColor: '#FFE4E1',
      borderRadius: borderRadius.lg,
    },
    characterIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    characterText: {
      fontSize: fontSize.lg,
      color: '#8B4513',
      textAlign: 'center',
      fontWeight: fontWeight.medium,
    },
    stepsContainer: {
      marginVertical: spacing.lg,
    },
    stepsTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      marginBottom: spacing.md,
    },
    kidsStepsTitle: {
      color: '#FF6B9D',
      fontSize: fontSize.xl,
    },
    elderlyStepsTitle: {
      color: '#4A90E2',
      fontSize: fontSize.lg,
    },
    stepItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.md,
      padding: spacing.md,
      borderRadius: borderRadius.md,
    },
    kidsStepItem: {
      backgroundColor: '#FFF0F5',
    },
    elderlyStepItem: {
      backgroundColor: '#F0F8FF',
    },
    stepNumber: {
      width: 30,
      height: 30,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    kidsStepNumber: {
      backgroundColor: '#FFB6C1',
    },
    elderlyStepNumber: {
      backgroundColor: '#87CEEB',
    },
    stepNumberText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      color: colors.surface,
    },
    stepText: {
      flex: 1,
      fontSize: fontSize.md,
      color: colors.text.primary,
      lineHeight: 20,
    },
    kidsStepText: {
      fontSize: fontSize.lg,
      lineHeight: 24,
      color: '#8B4513',
    },
    elderlyStepText: {
      fontSize: fontSize.lg,
      lineHeight: 26,
      color: '#2F4F4F',
    },
    funFactCard: {
      backgroundColor: '#FFFACD',
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginTop: spacing.lg,
      borderWidth: 2,
      borderColor: '#FFD700',
    },
    funFactTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: '#FF8C00',
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    funFactText: {
      fontSize: fontSize.md,
      color: '#8B4513',
      textAlign: 'center',
      lineHeight: 22,
    },
    voiceButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primaryLight,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginTop: spacing.lg,
    },
    voiceButtonText: {
      color: colors.surface,
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      marginLeft: spacing.sm,
    },
    tipsSection: {
      marginTop: spacing.lg,
    },
    tipsSectionTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: '#4A90E2',
      marginBottom: spacing.md,
    },
    tipItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    tipBullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.success,
      marginTop: 8,
      marginRight: spacing.sm,
    },
    tipItemText: {
      flex: 1,
      fontSize: fontSize.md,
      color: colors.text.secondary,
      lineHeight: 22,
    },
    warningsSection: {
      marginTop: spacing.lg,
      backgroundColor: '#FFF5F5',
      borderRadius: borderRadius.md,
      padding: spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: colors.error,
    },
    warningTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.error,
      marginBottom: spacing.sm,
    },
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return colors.success;
      case 'medium': return colors.warning;
      case 'hard': return colors.error;
      default: return colors.primary;
    }
  };

  const renderModeSelector = () => (
    <View style={styles.modeSelector}>
      <Text style={styles.modeSelectorTitle}>Choose Your Learning Mode</Text>
      <View style={styles.modeContainer}>
        <TouchableOpacity
          style={[styles.modeCard, styles.kidsMode]}
          onPress={() => setSelectedMode('kids')}
          activeOpacity={0.8}
        >
          <Ionicons name="color-palette" size={48} color={colors.primary} />
          <Text style={[styles.modeTitle, styles.kidsModeTitle]}>Kids Mode</Text>
          <Text style={styles.modeDescription}>
            Fun characters and simple steps for young gardeners!
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeCard, styles.elderlyMode]}
          onPress={() => setSelectedMode('elderly')}
          activeOpacity={0.8}
        >
          <Ionicons name="book" size={48} color={colors.primary} />
          <Text style={[styles.modeTitle, styles.elderlyModeTitle]}>Detailed Mode</Text>
          <Text style={styles.modeDescription}>
            Comprehensive guides with voice narration and large text.
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <Text style={styles.categoriesTitle}>Select Category</Text>
      <View style={styles.categoriesGrid}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryItem,
              selectedCategory === category.key && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category.key)}
          >
            <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
              <Ionicons
                name={category.icon as any}
                size={20}
                color={colors.surface}
              />
            </View>
            <Text
              style={[
                styles.categoryLabel,
                selectedCategory === category.key && styles.selectedCategoryLabel,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const getCharacterIcon = (character: string) => {
    switch (character) {
      case 'Wizard': return 'flash';
      case 'Water Wizard': return 'water';
      case 'Hero': return 'person';
      default: return 'happy';
    }
  };

  const renderKidsContent = (tip: TipContent) => (
    <ScrollView>
      <View style={styles.characterSection}>
        <View style={styles.characterIcon}>
          <Ionicons 
            name={getCharacterIcon(tip.kidsContent.character) as any} 
            size={32} 
            color={colors.surface} 
          />
        </View>
        <Text style={styles.characterText}>{tip.kidsContent.description}</Text>
      </View>

      <View style={styles.stepsContainer}>
        <Text style={[styles.stepsTitle, styles.kidsStepsTitle]}>
          Let's Learn Together!
        </Text>
        {tip.kidsContent.steps.map((step, index) => (
          <View key={index} style={[styles.stepItem, styles.kidsStepItem]}>
            <View style={[styles.stepNumber, styles.kidsStepNumber]}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={[styles.stepText, styles.kidsStepText]}>{step}</Text>
          </View>
        ))}
      </View>

      <View style={styles.funFactCard}>
        <Text style={styles.funFactTitle}>Amazing Fact!</Text>
        <Text style={styles.funFactText}>{tip.kidsContent.funFact}</Text>
      </View>
    </ScrollView>
  );

  const renderElderlyContent = (tip: TipContent) => (
    <ScrollView>
      <View style={styles.stepsContainer}>
        <Text style={[styles.stepsTitle, styles.elderlyStepsTitle]}>Step-by-Step Guide</Text>
        {tip.elderlyContent.detailedSteps.map((step, index) => (
          <View key={index} style={[styles.stepItem, styles.elderlyStepItem]}>
            <View style={[styles.stepNumber, styles.elderlyStepNumber]}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={[styles.stepText, styles.elderlyStepText]}>{step}</Text>
          </View>
        ))}
      </View>

      {tip.elderlyContent.tips.length > 0 && (
        <View style={styles.tipsSection}>
          <Text style={styles.tipsSectionTitle}>Helpful Tips</Text>
          {tip.elderlyContent.tips.map((tipItem, index) => (
            <View key={index} style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipItemText}>{tipItem}</Text>
            </View>
          ))}
        </View>
      )}

      {tip.elderlyContent.warnings.length > 0 && (
        <View style={styles.warningsSection}>
          <Text style={styles.warningTitle}>Important Warnings</Text>
          {tip.elderlyContent.warnings.map((warning, index) => (
            <View key={index} style={styles.tipItem}>
              <View style={[styles.tipBullet, { backgroundColor: colors.error }]} />
              <Text style={styles.tipItemText}>{warning}</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.voiceButton}
        onPress={() => {
          setIsVoiceEnabled(!isVoiceEnabled);
          Alert.alert('Voice Narration', isVoiceEnabled ? 'Voice narration stopped' : 'Voice narration started');
        }}
      >
        <Ionicons name={isVoiceEnabled ? 'volume-high' : 'volume-mute'} size={24} color={colors.surface} />
        <Text style={styles.voiceButtonText}>
          {isVoiceEnabled ? 'Stop Voice' : 'Start Voice Narration'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderTipCard = (tip: TipContent, index: number) => (
    <TouchableOpacity
      key={tip.id}
      style={[
        styles.tipCard,
        selectedMode === 'kids' && styles.kidsTipCard,
        selectedMode === 'elderly' && styles.elderlyTipCard,
      ]}
      onPress={() => {
        setSelectedTip(tip);
        setShowTipModal(true);
      }}
      activeOpacity={0.8}
    >
      <View style={styles.tipHeader}>
        <View style={[styles.tipIcon, { backgroundColor: getDifficultyColor(tip.difficulty) }]}>
          <Ionicons name={tip.icon as any} size={24} color={colors.surface} />
        </View>
        <Text
          style={[
            styles.tipTitle,
            selectedMode === 'kids' && styles.kidsTipTitle,
            selectedMode === 'elderly' && styles.elderlyTipTitle,
          ]}
        >
          {selectedMode === 'kids' ? tip.kidsContent.title : tip.elderlyContent.title}
        </Text>
      </View>
      <Text
        style={[
          styles.tipDescription,
          selectedMode === 'kids' && styles.kidsTipDescription,
          selectedMode === 'elderly' && styles.elderlyTipDescription,
        ]}
      >
        {selectedMode === 'kids' ? tip.kidsContent.description : tip.elderlyContent.description}
      </Text>
      <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(tip.difficulty) }]}>
        <Text style={styles.difficultyText}>{tip.difficulty.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );

  if (!selectedMode) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        
        <LinearGradient
          colors={[colors.primaryLight, colors.primary]}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={colors.surface} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Soil Health Tips Library</Text>
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="help-circle" size={24} color={colors.surface} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {renderModeSelector()}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      
      <LinearGradient
        colors={[colors.primaryLight, colors.primary]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedMode(null)}>
            <Ionicons name="arrow-back" size={24} color={colors.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {selectedMode === 'kids' ? 'Kids Tips' : 'Detailed Guide'}
          </Text>
          <TouchableOpacity onPress={() => setSelectedMode(null)}>
            <Ionicons name="home" size={24} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCategories()}
        
        <View style={styles.tipsContainer}>
          {filteredTips.map(renderTipCard)}
        </View>
      </ScrollView>

      <Modal visible={showTipModal} transparent animationType="slide">
        <View style={styles.modal}>
          <View
            style={[
              styles.modalContent,
              selectedMode === 'kids' && styles.kidsModalContent,
              selectedMode === 'elderly' && styles.elderlyModalContent,
            ]}
          >
            <View style={styles.modalHeader}>
              <View style={[styles.modalIcon, { backgroundColor: colors.primary }]}>
                <Ionicons name={selectedTip?.icon as any} size={30} color={colors.surface} />
              </View>
              <Text
                style={[
                  styles.modalTitle,
                  selectedMode === 'kids' && styles.kidsModalTitle,
                  selectedMode === 'elderly' && styles.elderlyModalTitle,
                ]}
              >
                {selectedMode === 'kids' ? selectedTip?.kidsContent.title : selectedTip?.elderlyContent.title}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowTipModal(false)}
              >
                <Ionicons name="close" size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            
            {selectedTip && (
              selectedMode === 'kids' 
                ? renderKidsContent(selectedTip)
                : renderElderlyContent(selectedTip)
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SoilHealthTipsScreen;
