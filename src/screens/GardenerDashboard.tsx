import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import FloatingPlantScanner from '../components/FloatingPlantScanner';
import ChatBot from '../components/ChatBot';
import VoiceAssistant from '../components/VoiceAssistant';

interface GardenerDashboardProps {
  navigation: any;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - spacing.lg * 3) / 2;

const GardenerDashboard: React.FC<GardenerDashboardProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { translations } = useLanguage();

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
      flex: 1,
    },
    greeting: {
      fontSize: fontSize.md,
      color: colors.surface,
      opacity: 0.9,
    },
    userName: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.surface,
    },
    profileButton: {
      padding: spacing.xs,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    statsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    statCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      width: cardWidth,
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
    statIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    statValue: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.xs / 2,
    },
    statTitle: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    quickActionsGrid: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      elevation: 4,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    actionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    actionItem: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      marginHorizontal: spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    actionIcon: {
      marginRight: spacing.md,
    },
    actionContent: {
      flex: 1,
    },
    actionTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
    },
    actionSubtitle: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.xs / 2,
    },
    reminderCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
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
    reminderHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    reminderPriority: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: spacing.md,
    },
    reminderTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      flex: 1,
    },
    reminderTime: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    reminderDescription: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.xs,
    },
    actionCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    actionIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    seeAllText: {
      fontSize: fontSize.sm,
      color: colors.primary,
      fontWeight: fontWeight.medium,
    },
    reminderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    reminderInfo: {
      flex: 1,
    },
    plantName: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
    },
    reminderTask: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.xs / 2,
    },
    reminderRight: {
      alignItems: 'flex-end',
    },
    priorityIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginTop: spacing.xs,
    },
    remindersCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    weatherCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    weatherMain: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    weatherInfo: {
      marginLeft: spacing.md,
      flex: 1,
    },
    temperature: {
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    weatherDesc: {
      fontSize: fontSize.md,
      color: colors.text.secondary,
      marginTop: spacing.xs / 2,
    },
    weatherDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    weatherDetail: {
      alignItems: 'center',
    },
    weatherDetailText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.xs / 2,
    },
    weatherTip: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.md,
      fontStyle: 'italic',
    },
    actionsContainer: {
      gap: spacing.sm,
    },
    sectionContainer: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      elevation: 3,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    sectionTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    sectionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    sectionTitleText: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      flex: 1,
    },
    sectionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    sectionItem: {
      width: '48%',
      backgroundColor: colors.background,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      alignItems: 'center',
      minHeight: 100,
      justifyContent: 'center',
    },
    sectionItemIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    sectionItemTitle: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.xs,
    },
    sectionItemSubtitle: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 16,
    },
    quickAccessContainer: {
      backgroundColor: colors.primaryLight,
      borderRadius: borderRadius.lg,
      padding: 20,
      marginBottom: spacing.lg,
    },
    quickAccessTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.surface,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    quickAccessGrid: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    quickAccessItem: {
      alignItems: 'center',
      flex: 10,
    },
    quickAccessIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    quickAccessText: {
      fontSize: fontSize.xs,
      color: colors.surface,
      textAlign: 'center',
      fontWeight: fontWeight.medium,
    },
  });

  const styles = getStyles();

  const statsData = [
    {
      title: 'Garden Zones',
      value: '6',
      icon: 'flower',
      color: colors.primary,
    },
    {
      title: 'Water Saved',
      value: '45L',
      icon: 'water',
      color: colors.secondary,
    },
    {
      title: 'Next Watering',
      value: '30 min',
      icon: 'timer',
      color: colors.accent,
    },
    {
      title: 'Healthy Plants',
      value: '94%',
      icon: 'leaf',
      color: colors.primaryLight,
    },
  ];

  // Organized sections for better navigation
  const gardenPlanningTools = [
    {
      title: 'Virtual Garden Planner',
      subtitle: 'Design your dream garden',
      icon: 'map',
      onPress: () => navigation.navigate('VirtualGardenPlanner'),
    },
    {
      title: 'Garden Zones',
      subtitle: 'Manage different areas',
      icon: 'grid',
      onPress: () => navigation.navigate('GardenZones'),
    },
    {
      title: 'Seasonal Suggestions',
      subtitle: 'Season-based planting',
      icon: 'flower',
      onPress: () => navigation.navigate('SeasonalAestheticSuggestions'),
    },
    {
      title: 'AI Mood Plants',
      subtitle: 'Plants for your mood',
      icon: 'happy',
      onPress: () => navigation.navigate('AIMoodPlants'),
    },
  ];

  const plantHealthTools = [
    {
      title: 'Plant Health Scanner',
      subtitle: 'Detect diseases & pests',
      icon: 'camera',
      onPress: () => navigation.navigate('PlantDiseaseDetection'),
    },
    {
      title: 'Indoor Plant Care',
      subtitle: 'Light & care monitoring',
      icon: 'bulb',
      onPress: () => navigation.navigate('IndoorPlantCareMode'),
    },
    {
      title: 'Soil Analysis',
      subtitle: 'Check soil health',
      icon: 'analytics',
      onPress: () => navigation.navigate('SoilAnalysis'),
    },
    {
      title: 'Water Schedule',
      subtitle: 'Smart watering system',
      icon: 'time',
      onPress: () => navigation.navigate('WaterSchedule'),
    },
  ];

  const kidsEducationTools = [
    {
      title: 'AR Soil Explorer',
      subtitle: 'Discover soil creatures with AR',
      icon: 'camera',
      onPress: () => navigation.navigate('ARSoilExplorer'),
    },
    {
      title: 'Learning Games',
      subtitle: 'Interactive gardening games',
      icon: 'game-controller',
      onPress: () => navigation.navigate('InteractiveLearningGames'),
    },
    {
      title: 'Soil Health Tips',
      subtitle: 'Fun tips for kids & detailed guides',
      icon: 'library',
      onPress: () => navigation.navigate('SoilHealthTips'),
    },
    {
      title: 'Superhero Stories',
      subtitle: 'Captain Compost adventures',
      icon: 'person',
      onPress: () => navigation.navigate('SoilSuperheroStory'),
    },
  ];

  const socialAndShoppingTools = [
    {
      title: 'Gardener Social Map',
      subtitle: 'Connect with nearby gardeners',
      icon: 'location',
      onPress: () => navigation.navigate('GardenerSocialMap'),
    },
    {
      title: 'Community Forum',
      subtitle: 'Share tips & experiences',
      icon: 'people',
      onPress: () => navigation.navigate('Community'),
    },
    {
      title: 'Product Store',
      subtitle: 'Buy gardening supplies',
      icon: 'storefront',
      onPress: () => navigation.navigate('ProductStore'),
    },
    {
      title: 'Weather & Tips',
      subtitle: 'Weather insights & tips',
      icon: 'sunny',
      onPress: () => navigation.navigate('WeatherTips'),
    },
  ];

  const quickActions = [
    ...gardenPlanningTools,
    ...plantHealthTools,
    ...kidsEducationTools,
    ...socialAndShoppingTools,
  ];

  const plantCareReminders = [
    {
      plant: 'Tomatoes',
      task: 'Watering needed',
      time: 'Now',
      priority: 'high',
    },
    {
      plant: 'Roses',
      task: 'Fertilizing due',
      time: 'Tomorrow',
      priority: 'medium',
    },
    {
      plant: 'Herbs',
      task: 'Pruning needed',
      time: 'This week',
      priority: 'low',
    },
  ];

  const renderStatCard = (stat: typeof statsData[0], index: number) => (
    <View key={index} style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: stat.color }]}>
        <Ionicons name={stat.icon as keyof typeof Ionicons.glyphMap} size={24} color={colors.surface} />
      </View>
      <Text style={styles.statValue}>{stat.value}</Text>
      <Text style={styles.statTitle}>{stat.title}</Text>
    </View>
  );

  const renderSectionItem = (item: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.sectionItem}
      onPress={item.onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.sectionItemIcon, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={24} color={colors.surface} />
      </View>
      <Text style={styles.sectionItemTitle}>{item.title}</Text>
      <Text style={styles.sectionItemSubtitle}>{item.subtitle}</Text>
    </TouchableOpacity>
  );

  const renderSection = (title: string, icon: string, items: any[], iconColor: string) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionTitleContainer}>
        <View style={[styles.sectionIcon, { backgroundColor: iconColor }]}>
          <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={24} color={colors.surface} />
        </View>
        <Text style={styles.sectionTitleText}>{title}</Text>
      </View>
      <View style={styles.sectionGrid}>
        {items.map(renderSectionItem)}
      </View>
    </View>
  );

  const renderQuickAccess = () => {
    const quickAccessItems = [
      { title: 'Plant Scanner', icon: 'camera', onPress: () => navigation.navigate('PlantDiseaseDetection') },
      { title: 'Water Schedule', icon: 'time', onPress: () => navigation.navigate('WaterSchedule') },
      { title: 'Weather Tips', icon: 'sunny', onPress: () => navigation.navigate('WeatherTips') },
      { title: 'Community', icon: 'people', onPress: () => navigation.navigate('Community') },
    ];

    return (
      <View style={styles.quickAccessContainer}>
        <Text style={styles.quickAccessTitle}>Quick Access</Text>
        <View style={styles.quickAccessGrid}>
          {quickAccessItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickAccessItem}
              onPress={item.onPress}
              activeOpacity={0.8}
            >
              <View style={styles.quickAccessIcon}>
                <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={24} color={colors.primary} />
              </View>
              <Text style={styles.quickAccessText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderQuickAction = (action: typeof quickActions[0], index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.actionCard}
      onPress={action.onPress}
      activeOpacity={0.8}
    >
      <View style={styles.actionIconContainer}>
        <Ionicons name={action.icon as keyof typeof Ionicons.glyphMap} size={24} color={colors.primary} />
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{action.title}</Text>
        <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.text.hint} />
    </TouchableOpacity>
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.text.secondary;
    }
  };

  const renderPlantCareReminder = (reminder: typeof plantCareReminders[0], index: number) => (
    <View key={index} style={styles.reminderRow}>
      <View style={styles.reminderInfo}>
        <Text style={styles.plantName}>{reminder.plant}</Text>
        <Text style={styles.reminderTask}>{reminder.task}</Text>
      </View>
      <View style={styles.reminderRight}>
        <Text style={styles.reminderTime}>{reminder.time}</Text>
        <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(reminder.priority) }]} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <LinearGradient
        colors={[colors.primaryLight, colors.primary]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Good Morning, Gardener!</Text>
            <Text style={styles.userName}>Sarah's Beautiful Garden</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="person-circle" size={40} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Access Section */}
        {renderQuickAccess()}

        {/* Garden Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Garden Overview</Text>
          <View style={styles.statsContainer}>
            {statsData.map(renderStatCard)}
          </View>
        </View>

        {/* Kids Education Section */}
        {renderSection(
          'Kids Education Hub',
          'school',
          kidsEducationTools,
          colors.secondary
        )}

        {/* Garden Planning Section */}
        {renderSection(
          'Garden Planning & Design',
          'leaf',
          gardenPlanningTools,
          colors.primary
        )}

        {/* Plant Health Section */}
        {renderSection(
          'Plant Health & Care',
          'medical',
          plantHealthTools,
          colors.success
        )}

        {/* Social & Shopping Section */}
        {renderSection(
          'Community & Shopping',
          'people',
          socialAndShoppingTools,
          colors.warning
        )}

        {/* Plant Care Reminders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Plant Care Reminders</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PlantCareReminders')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.remindersCard}>
            {plantCareReminders.map(renderPlantCareReminder)}
          </View>
        </View>

        {/* Weather Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Weather</Text>
          </View>
          
          <View style={styles.weatherCard}>
            <View style={styles.weatherMain}>
              <Ionicons name="partly-sunny" size={48} color={colors.warning} />
              <View style={styles.weatherInfo}>
                <Text style={styles.temperature}>24°C</Text>
                <Text style={styles.weatherDesc}>Partly Cloudy</Text>
              </View>
            </View>
            <View style={styles.weatherDetails}>
              <View style={styles.weatherDetail}>
                <Ionicons name="water" size={16} color={colors.primary} />
                <Text style={styles.weatherDetailText}>Humidity: 65%</Text>
              </View>
              <View style={styles.weatherDetail}>
                <Ionicons name="leaf" size={16} color={colors.primary} />
                <Text style={styles.weatherDetailText}>UV Index: 6</Text>
              </View>
            </View>
            <Text style={styles.weatherTip}>
              Good day for outdoor gardening! Consider watering in the evening.
            </Text>
          </View>
        </View>
      </ScrollView>
      <FloatingPlantScanner navigation={navigation} />
      <VoiceAssistant navigation={navigation} />
      <ChatBot />
    </View>
  );
};

export default GardenerDashboard;
