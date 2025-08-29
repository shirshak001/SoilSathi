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

interface SeasonalAestheticSuggestionsScreenProps {
  navigation: any;
}

interface SeasonalPlant {
  id: string;
  name: string;
  icon: string;
  bloomingSeason: 'spring' | 'summer' | 'autumn' | 'winter' | 'year-round';
  colors: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  careInstructions: string[];
  aestheticPurpose: string;
  companionPlants: string[];
  culturalSignificance?: string;
}

interface FestivalDecoration {
  id: string;
  festival: string;
  date: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  theme: string;
  primaryColors: string[];
  recommendedPlants: string[];
  decorativeElements: string[];
  diyProjects: string[];
  culturalBackground: string;
  modernTwist: string[];
}

interface SeasonalLook {
  id: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  name: string;
  theme: string;
  colorPalette: string[];
  plantCombinations: string[];
  decorativeAccents: string[];
  ambiance: string;
  maintenanceLevel: 'low' | 'medium' | 'high';
  bestFor: string[];
}

const { width, height } = Dimensions.get('window');

const SeasonalAestheticSuggestionsScreen: React.FC<SeasonalAestheticSuggestionsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { translations } = useLanguage();

  const [selectedTab, setSelectedTab] = useState<'seasons' | 'festivals' | 'themes' | 'calendar'>('seasons');
  const [selectedSeason, setSelectedSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter'>('spring');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const tabs = [
    { key: 'seasons', label: 'Seasons', icon: 'leaf' },
    { key: 'festivals', label: 'Festivals', icon: 'star' },
    { key: 'themes', label: 'Themes', icon: 'color-palette' },
    { key: 'calendar', label: 'Calendar', icon: 'calendar' },
  ];

  const seasons = [
    { key: 'spring', label: 'Spring', icon: 'flower', color: '#E8F5E8' },
    { key: 'summer', label: 'Summer', icon: 'sunny', color: '#FFF8DC' },
    { key: 'autumn', label: 'Autumn', icon: 'leaf', color: '#FFF0E6' },
    { key: 'winter', label: 'Winter', icon: 'snow', color: '#F0F8FF' },
  ];

  const seasonalPlants: SeasonalPlant[] = [
    {
      id: '1',
      name: 'Cherry Blossom',
      icon: 'flower',
      bloomingSeason: 'spring',
      colors: ['Pink', 'White'],
      difficulty: 'medium',
      description: 'Delicate spring blooms that symbolize renewal and beauty',
      careInstructions: ['Water regularly during blooming', 'Prune after flowering', 'Protect from strong winds'],
      aestheticPurpose: 'Creates romantic spring ambiance',
      companionPlants: ['Daffodils', 'Tulips', 'Primrose'],
      culturalSignificance: 'Symbol of spring and fleeting beauty in Japanese culture',
    },
    {
      id: '2',
      name: 'Sunflower',
      icon: 'sunny',
      bloomingSeason: 'summer',
      colors: ['Yellow', 'Orange'],
      difficulty: 'easy',
      description: 'Bright, cheerful flowers that follow the sun',
      careInstructions: ['Plant in full sun', 'Water deeply but infrequently', 'Support tall varieties'],
      aestheticPurpose: 'Creates vibrant summer displays',
      companionPlants: ['Marigolds', 'Zinnias', 'Cosmos'],
      culturalSignificance: 'Symbol of happiness and loyalty',
    },
    {
      id: '3',
      name: 'Chrysanthemum',
      icon: 'flower',
      bloomingSeason: 'autumn',
      colors: ['Orange', 'Red', 'Yellow', 'Purple'],
      difficulty: 'medium',
      description: 'Rich autumn blooms in warm, earthy tones',
      careInstructions: ['Pinch buds for bushier growth', 'Water at soil level', 'Divide every 2-3 years'],
      aestheticPurpose: 'Perfect for autumn color schemes',
      companionPlants: ['Asters', 'Ornamental cabbage', 'Pansies'],
      culturalSignificance: 'Symbol of longevity and joy in Asian cultures',
    },
    {
      id: '4',
      name: 'Poinsettia',
      icon: 'flower',
      bloomingSeason: 'winter',
      colors: ['Red', 'White', 'Pink'],
      difficulty: 'medium',
      description: 'Classic winter holiday plant with colorful bracts',
      careInstructions: ['Keep away from drafts', 'Water when soil is dry', 'Maintain warm temperature'],
      aestheticPurpose: 'Traditional Christmas decoration',
      companionPlants: ['Holly', 'Mistletoe', 'Christmas cactus'],
      culturalSignificance: 'Traditional Christmas flower',
    },
    {
      id: '5',
      name: 'Marigold',
      icon: '🧡',
      bloomingSeason: 'summer',
      colors: ['Orange', 'Yellow', 'Red'],
      difficulty: 'easy',
      description: 'Vibrant, long-lasting blooms perfect for summer',
      careInstructions: ['Deadhead regularly', 'Water at base', 'Full sun exposure'],
      aestheticPurpose: 'Adds warm colors to garden beds',
      companionPlants: ['Tomatoes', 'Basil', 'Nasturtiums'],
      culturalSignificance: 'Sacred flower in Hindu traditions',
    },
    {
      id: '6',
      name: 'Tulip',
      icon: 'flower',
      bloomingSeason: 'spring',
      colors: ['Red', 'Pink', 'Yellow', 'Purple', 'White'],
      difficulty: 'easy',
      description: 'Classic spring bulbs in numerous colors',
      careInstructions: ['Plant bulbs in fall', 'Well-draining soil', 'Full to partial sun'],
      aestheticPurpose: 'Creates stunning spring displays',
      companionPlants: ['Daffodils', 'Hyacinths', 'Grape hyacinths'],
      culturalSignificance: 'Symbol of perfect love and elegance',
    },
  ];

  const festivalDecorations: FestivalDecoration[] = [
    {
      id: '1',
      festival: 'Diwali',
      date: 'October/November',
      season: 'autumn',
      theme: 'Festival of Lights',
      primaryColors: ['Gold', 'Orange', 'Red', 'Yellow'],
      recommendedPlants: ['Marigolds', 'Roses', 'Jasmine', 'Chrysanthemums'],
      decorativeElements: ['Diyas', 'Rangoli', 'String lights', 'Flower garlands'],
      diyProjects: ['Marigold garlands', 'Floating flower bowls', 'Potted plant arrangements'],
      culturalBackground: 'Hindu festival celebrating victory of light over darkness',
      modernTwist: ['LED-lit planters', 'Succulent rangoli', 'Eco-friendly decorations'],
    },
    {
      id: '2',
      festival: 'Christmas',
      date: 'December 25',
      season: 'winter',
      theme: 'Winter Wonderland',
      primaryColors: ['Red', 'Green', 'White', 'Gold'],
      recommendedPlants: ['Poinsettia', 'Christmas tree', 'Holly', 'Mistletoe', 'Christmas cactus'],
      decorativeElements: ['Christmas lights', 'Ornaments', 'Wreaths', 'Garlands'],
      diyProjects: ['Pine cone planters', 'Holiday terrariums', 'Festive herb gardens'],
      culturalBackground: 'Christian celebration of birth of Jesus Christ',
      modernTwist: ['Minimalist plant arrangements', 'Sustainable decorations', 'Indoor herb gardens'],
    },
    {
      id: '3',
      festival: 'Holi',
      date: 'March',
      season: 'spring',
      theme: 'Festival of Colors',
      primaryColors: ['Pink', 'Yellow', 'Green', 'Blue', 'Purple'],
      recommendedPlants: ['Gulmohar', 'Palash', 'Jasmine', 'Rose', 'Bougainvillea'],
      decorativeElements: ['Colorful powders', 'Water balloons', 'Flower petals', 'Rangoli'],
      diyProjects: ['Color-themed planters', 'Rainbow flower arrangements', 'Natural color gardens'],
      culturalBackground: 'Hindu festival celebrating arrival of spring and victory of good over evil',
      modernTwist: ['Organic color powders', 'Sustainable celebrations', 'Community gardens'],
    },
    {
      id: '4',
      festival: 'Easter',
      date: 'March/April',
      season: 'spring',
      theme: 'Spring Renewal',
      primaryColors: ['Pastel Pink', 'Yellow', 'Light Blue', 'White', 'Green'],
      recommendedPlants: ['Easter lilies', 'Daffodils', 'Tulips', 'Hyacinths', 'Primrose'],
      decorativeElements: ['Easter eggs', 'Bunny decorations', 'Pastel ribbons', 'Spring flowers'],
      diyProjects: ['Easter egg planters', 'Spring bulb gardens', 'Pastel flower arrangements'],
      culturalBackground: 'Christian celebration of resurrection of Jesus Christ',
      modernTwist: ['Eco-friendly egg decorations', 'Edible flower gardens', 'Sustainable spring decor'],
    },
    {
      id: '5',
      festival: 'Dussehra',
      date: 'September/October',
      season: 'autumn',
      theme: 'Victory Celebration',
      primaryColors: ['Red', 'Yellow', 'Orange', 'Gold'],
      recommendedPlants: ['Marigolds', 'Ixora', 'Hibiscus', 'Ashoka tree'],
      decorativeElements: ['Pandals', 'Goddess statues', 'Flower decorations', 'Traditional lamps'],
      diyProjects: ['Temple flower arrangements', 'Goddess plant displays', 'Traditional garlands'],
      culturalBackground: 'Hindu festival celebrating victory of good over evil',
      modernTwist: ['Eco-friendly pandals', 'Organic flower arrangements', 'Sustainable celebrations'],
    },
  ];

  const seasonalLooks: SeasonalLook[] = [
    {
      id: '1',
      season: 'spring',
      name: 'Fresh Awakening',
      theme: 'New beginnings and growth',
      colorPalette: ['Soft Pink', 'Light Green', 'Cream', 'Lavender'],
      plantCombinations: ['Tulips + Daffodils', 'Cherry blossoms + Primrose', 'Hyacinths + Pansies'],
      decorativeAccents: ['Pastel planters', 'Natural wood elements', 'Soft lighting'],
      ambiance: 'Fresh, optimistic, and rejuvenating',
      maintenanceLevel: 'medium',
      bestFor: ['Balconies', 'Garden borders', 'Window boxes'],
    },
    {
      id: '2',
      season: 'summer',
      name: 'Tropical Paradise',
      theme: 'Vibrant and energetic',
      colorPalette: ['Bright Yellow', 'Orange', 'Hot Pink', 'Lime Green'],
      plantCombinations: ['Sunflowers + Marigolds', 'Hibiscus + Bougainvillea', 'Zinnias + Cosmos'],
      decorativeAccents: ['Colorful ceramic pots', 'Bamboo elements', 'String lights'],
      ambiance: 'Energetic, cheerful, and vibrant',
      maintenanceLevel: 'low',
      bestFor: ['Patios', 'Pool areas', 'Sunny gardens'],
    },
    {
      id: '3',
      season: 'autumn',
      name: 'Harvest Warmth',
      theme: 'Cozy and rich',
      colorPalette: ['Burnt Orange', 'Deep Red', 'Golden Yellow', 'Brown'],
      plantCombinations: ['Chrysanthemums + Asters', 'Ornamental cabbage + Pansies', 'Maples + Ferns'],
      decorativeAccents: ['Rustic containers', 'Pumpkins', 'Lanterns'],
      ambiance: 'Warm, cozy, and contemplative',
      maintenanceLevel: 'medium',
      bestFor: ['Entrance areas', 'Fall displays', 'Harvest decorations'],
    },
    {
      id: '4',
      season: 'winter',
      name: 'Serene Elegance',
      theme: 'Peaceful and sophisticated',
      colorPalette: ['White', 'Silver', 'Deep Green', 'Burgundy'],
      plantCombinations: ['Poinsettias + Holly', 'Evergreens + White flowers', 'Amaryllis + Ivy'],
      decorativeAccents: ['Metallic planters', 'Twinkling lights', 'Natural textures'],
      ambiance: 'Peaceful, elegant, and festive',
      maintenanceLevel: 'low',
      bestFor: ['Indoor spaces', 'Holiday decorations', 'Winter gardens'],
    },
  ];

  const getCurrentSeason = () => {
    const month = currentMonth;
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  };

  const getUpcomingFestivals = () => {
    const currentSeason = getCurrentSeason();
    return festivalDecorations.filter(festival => 
      festival.season === currentSeason || 
      (currentSeason === 'autumn' && festival.season === 'winter')
    );
  };

  const getSeasonalRecommendations = (season: string) => {
    return seasonalPlants.filter(plant => 
      plant.bloomingSeason === season || plant.bloomingSeason === 'year-round'
    );
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
    seasonSelector: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.sm,
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
    seasonOption: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.sm,
    },
    activeSeason: {
      backgroundColor: colors.primary,
    },
    seasonEmoji: {
      fontSize: 24,
      marginBottom: spacing.xs / 2,
    },
    seasonLabel: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.text.secondary,
    },
    activeSeasonLabel: {
      color: colors.surface,
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
    plantSeason: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      textTransform: 'capitalize',
    },
    difficultyBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
      borderRadius: borderRadius.sm,
    },
    difficultyText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.surface,
      textTransform: 'uppercase',
    },
    plantDescription: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      lineHeight: 18,
      marginBottom: spacing.sm,
    },
    colorPalette: {
      flexDirection: 'row',
      marginBottom: spacing.sm,
    },
    colorSwatch: {
      width: 20,
      height: 20,
      borderRadius: 10,
      marginRight: spacing.xs,
      borderWidth: 1,
      borderColor: colors.border,
    },
    aestheticPurpose: {
      fontSize: fontSize.sm,
      fontStyle: 'italic',
      color: colors.primary,
      marginBottom: spacing.sm,
    },
    viewDetailsButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.sm,
      paddingVertical: spacing.sm,
      alignItems: 'center',
    },
    viewDetailsText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.surface,
    },
    festivalCard: {
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
    festivalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    festivalLeft: {
      flex: 1,
    },
    festivalName: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    festivalDate: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    festivalTheme: {
      fontSize: fontSize.sm,
      color: colors.primary,
      fontStyle: 'italic',
      marginTop: spacing.xs / 2,
    },
    seasonBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
      borderRadius: borderRadius.sm,
      backgroundColor: colors.primary,
    },
    seasonBadgeText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.surface,
      textTransform: 'uppercase',
    },
    festivalColors: {
      flexDirection: 'row',
      marginBottom: spacing.sm,
    },
    festivalDescription: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.sm,
      lineHeight: 18,
    },
    recommendedPlants: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: spacing.sm,
    },
    plantTag: {
      backgroundColor: colors.background,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
      borderRadius: borderRadius.sm,
      marginRight: spacing.xs,
      marginBottom: spacing.xs,
    },
    plantTagText: {
      fontSize: fontSize.xs,
      color: colors.text.primary,
    },
    themeCard: {
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
    themeHeader: {
      marginBottom: spacing.sm,
    },
    themeName: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    themeSubtitle: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      fontStyle: 'italic',
    },
    themeDescription: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.sm,
      lineHeight: 18,
    },
    combinationsList: {
      marginBottom: spacing.sm,
    },
    combinationItem: {
      fontSize: fontSize.sm,
      color: colors.text.primary,
      marginBottom: spacing.xs / 2,
    },
    maintenanceLevel: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    maintenanceText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginLeft: spacing.sm,
    },
    calendarContainer: {
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
    calendarTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    currentSeasonInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
      padding: spacing.md,
      backgroundColor: colors.background,
      borderRadius: borderRadius.sm,
    },
    currentSeasonText: {
      fontSize: fontSize.sm,
      color: colors.text.primary,
      marginLeft: spacing.sm,
    },
    upcomingSection: {
      marginTop: spacing.md,
    },
    sectionTitle: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.sm,
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
    modalSection: {
      marginBottom: spacing.md,
    },
    modalSectionTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    modalText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      lineHeight: 18,
      marginBottom: spacing.xs,
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
  });

  const styles = getStyles();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#27AE60';
      case 'medium': return '#F39C12';
      case 'hard': return '#E74C3C';
      default: return colors.primary;
    }
  };

  const getMaintenanceIcon = (level: string) => {
    switch (level) {
      case 'low': return 'leaf';
      case 'medium': return 'water';
      case 'high': return 'settings';
      default: return 'leaf';
    }
  };

  const getColorCode = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      'Pink': '#FFB6C1',
      'White': '#FFFFFF',
      'Yellow': '#FFFF00',
      'Orange': '#FFA500',
      'Red': '#FF0000',
      'Purple': '#800080',
      'Green': '#008000',
      'Blue': '#0000FF',
      'Gold': '#FFD700',
      'Light Blue': '#ADD8E6',
      'Pastel Pink': '#FFB6C1',
      'Cream': '#F5F5DC',
      'Lavender': '#E6E6FA',
      'Light Green': '#90EE90',
      'Bright Yellow': '#FFFF00',
      'Hot Pink': '#FF69B4',
      'Lime Green': '#32CD32',
      'Burnt Orange': '#CC5500',
      'Deep Red': '#8B0000',
      'Golden Yellow': '#FFD700',
      'Brown': '#A52A2A',
      'Silver': '#C0C0C0',
      'Deep Green': '#006400',
      'Burgundy': '#800020',
    };
    return colorMap[colorName] || colors.primary;
  };

  const renderSeasonsTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.seasonSelector}>
        {seasons.map((season) => (
          <TouchableOpacity
            key={season.key}
            style={[
              styles.seasonOption,
              selectedSeason === season.key && styles.activeSeason,
            ]}
            onPress={() => setSelectedSeason(season.key as any)}
          >
            <Ionicons name={season.icon as any} size={24} color={colors.primary} />
            <Text
              style={[
                styles.seasonLabel,
                selectedSeason === season.key && styles.activeSeasonLabel,
              ]}
            >
              {season.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {getSeasonalRecommendations(selectedSeason).map((plant) => (
        <View key={plant.id} style={styles.plantCard}>
          <View style={styles.plantHeader}>
            <Ionicons name={plant.icon as any} size={20} color={colors.success} />
            <View style={styles.plantInfo}>
              <Text style={styles.plantName}>{plant.name}</Text>
              <Text style={styles.plantSeason}>{plant.bloomingSeason} blooming</Text>
            </View>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(plant.difficulty) }]}>
              <Text style={styles.difficultyText}>{plant.difficulty}</Text>
            </View>
          </View>

          <Text style={styles.plantDescription}>{plant.description}</Text>

          <View style={styles.colorPalette}>
            {plant.colors.map((color, index) => (
              <View
                key={index}
                style={[styles.colorSwatch, { backgroundColor: getColorCode(color) }]}
              />
            ))}
          </View>

          <Text style={styles.aestheticPurpose}>{plant.aestheticPurpose}</Text>

          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => {
              setSelectedItem(plant);
              setShowDetailModal(true);
            }}
          >
            <Text style={styles.viewDetailsText}>View Care Instructions</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  const renderFestivalsTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {festivalDecorations.map((festival) => (
        <View key={festival.id} style={styles.festivalCard}>
          <View style={styles.festivalHeader}>
            <View style={styles.festivalLeft}>
              <Text style={styles.festivalName}>{festival.festival}</Text>
              <Text style={styles.festivalDate}>{festival.date}</Text>
              <Text style={styles.festivalTheme}>{festival.theme}</Text>
            </View>
            <View style={[styles.seasonBadge, { backgroundColor: getColorCode(festival.primaryColors[0]) }]}>
              <Text style={styles.seasonBadgeText}>{festival.season}</Text>
            </View>
          </View>

          <View style={styles.festivalColors}>
            {festival.primaryColors.map((color, index) => (
              <View
                key={index}
                style={[styles.colorSwatch, { backgroundColor: getColorCode(color) }]}
              />
            ))}
          </View>

          <Text style={styles.festivalDescription}>{festival.culturalBackground}</Text>

          <Text style={styles.sectionTitle}>Recommended Plants:</Text>
          <View style={styles.recommendedPlants}>
            {festival.recommendedPlants.map((plant, index) => (
              <View key={index} style={styles.plantTag}>
                <Text style={styles.plantTagText}>{plant}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => {
              setSelectedItem(festival);
              setShowDetailModal(true);
            }}
          >
            <Text style={styles.viewDetailsText}>View Decoration Ideas</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  const renderThemesTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {seasonalLooks.map((theme) => (
        <View key={theme.id} style={styles.themeCard}>
          <View style={styles.themeHeader}>
            <Text style={styles.themeName}>{theme.name}</Text>
            <Text style={styles.themeSubtitle}>{theme.theme}</Text>
          </View>

          <View style={styles.colorPalette}>
            {theme.colorPalette.map((color, index) => (
              <View
                key={index}
                style={[styles.colorSwatch, { backgroundColor: getColorCode(color) }]}
              />
            ))}
          </View>

          <Text style={styles.themeDescription}>{theme.ambiance}</Text>

          <Text style={styles.sectionTitle}>Plant Combinations:</Text>
          <View style={styles.combinationsList}>
            {theme.plantCombinations.map((combination, index) => (
              <Text key={index} style={styles.combinationItem}>• {combination}</Text>
            ))}
          </View>

          <View style={styles.maintenanceLevel}>
            <Ionicons
              name={getMaintenanceIcon(theme.maintenanceLevel) as any}
              size={16}
              color={colors.primary}
            />
            <Text style={styles.maintenanceText}>
              {theme.maintenanceLevel} maintenance
            </Text>
          </View>

          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => {
              setSelectedItem(theme);
              setShowDetailModal(true);
            }}
          >
            <Text style={styles.viewDetailsText}>View Full Theme Guide</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  const renderCalendarTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.calendarContainer}>
        <Text style={styles.calendarTitle}>Current Season</Text>
        <View style={styles.currentSeasonInfo}>
          <Text style={styles.seasonEmoji}>
            <Ionicons name={seasons.find(s => s.key === getCurrentSeason())?.icon as any} size={20} color={colors.primary} style={{ marginRight: spacing.sm }} />
            <Text style={styles.currentSeasonText}>Current Season</Text>
          </Text>
          <Text style={styles.currentSeasonText}>
            It's {getCurrentSeason()} season! Perfect time for{' '}
            {getCurrentSeason() === 'spring' ? 'fresh plantings and new growth' :
             getCurrentSeason() === 'summer' ? 'vibrant colors and full blooms' :
             getCurrentSeason() === 'autumn' ? 'warm tones and harvest themes' :
             'elegant winter displays and holiday decorations'}
          </Text>
        </View>
      </View>

      <View style={styles.calendarContainer}>
        <Text style={styles.calendarTitle}>Upcoming Festivals</Text>
        {getUpcomingFestivals().map((festival) => (
          <View key={festival.id} style={styles.festivalCard}>
            <Text style={styles.festivalName}>{festival.festival}</Text>
            <Text style={styles.festivalDate}>{festival.date}</Text>
            <Text style={styles.festivalTheme}>{festival.theme}</Text>
            <View style={styles.recommendedPlants}>
              {festival.recommendedPlants.slice(0, 3).map((plant, index) => (
                <View key={index} style={styles.plantTag}>
                  <Text style={styles.plantTagText}>{plant}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.calendarContainer}>
        <Text style={styles.calendarTitle}>Seasonal Planting Calendar</Text>
        <View style={styles.upcomingSection}>
          <Text style={styles.sectionTitle}>This Month's Recommendations:</Text>
          {getSeasonalRecommendations(getCurrentSeason()).slice(0, 3).map((plant) => (
            <Text key={plant.id} style={styles.combinationItem}>
              • {plant.name} - {plant.description}
            </Text>
          ))}
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
            <Text style={styles.headerTitle}>Seasonal Aesthetics</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="color-palette" size={24} color={colors.surface} />
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
        {selectedTab === 'seasons' && renderSeasonsTab()}
        {selectedTab === 'festivals' && renderFestivalsTab()}
        {selectedTab === 'themes' && renderThemesTab()}
        {selectedTab === 'calendar' && renderCalendarTab()}
      </View>

      {/* Detail Modal */}
      <Modal
        visible={showDetailModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Text style={styles.modalTitle}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name={selectedItem.icon as any} size={18} color={colors.primary} style={{ marginRight: spacing.sm }} />
                    <Text style={styles.modalTitle}>{selectedItem.name || selectedItem.festival}</Text>
                  </View>
                </Text>
                
                <ScrollView style={{ maxHeight: height * 0.6 }}>
                  {selectedItem.careInstructions && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Care Instructions:</Text>
                      {selectedItem.careInstructions.map((instruction: string, index: number) => (
                        <Text key={index} style={styles.modalText}>• {instruction}</Text>
                      ))}
                    </View>
                  )}
                  
                  {selectedItem.diyProjects && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>DIY Projects:</Text>
                      {selectedItem.diyProjects.map((project: string, index: number) => (
                        <Text key={index} style={styles.modalText}>• {project}</Text>
                      ))}
                    </View>
                  )}
                  
                  {selectedItem.decorativeAccents && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Decorative Elements:</Text>
                      {selectedItem.decorativeAccents.map((accent: string, index: number) => (
                        <Text key={index} style={styles.modalText}>• {accent}</Text>
                      ))}
                    </View>
                  )}
                  
                  {selectedItem.bestFor && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Best For:</Text>
                      {selectedItem.bestFor.map((use: string, index: number) => (
                        <Text key={index} style={styles.modalText}>• {use}</Text>
                      ))}
                    </View>
                  )}
                  
                  {selectedItem.culturalSignificance && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Cultural Significance:</Text>
                      <Text style={styles.modalText}>{selectedItem.culturalSignificance}</Text>
                    </View>
                  )}
                  
                  {selectedItem.modernTwist && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Modern Ideas:</Text>
                      {selectedItem.modernTwist.map((idea: string, index: number) => (
                        <Text key={index} style={styles.modalText}>• {idea}</Text>
                      ))}
                    </View>
                  )}
                </ScrollView>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowDetailModal(false)}
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

export default SeasonalAestheticSuggestionsScreen;
