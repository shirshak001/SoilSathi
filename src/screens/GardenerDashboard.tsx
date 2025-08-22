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
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import FloatingPlantScanner from '../components/FloatingPlantScanner';

interface GardenerDashboardProps {
  navigation: any;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - spacing.lg * 3) / 2;

const GardenerDashboard: React.FC<GardenerDashboardProps> = ({ navigation }) => {
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

  const quickActions = [
    {
      title: 'Garden Zones',
      subtitle: 'Manage your zones',
      icon: 'grid',
      onPress: () => {},
    },
    {
      title: 'Plant Health Scanner',
      subtitle: 'Detect diseases & pests',
      icon: 'camera',
      onPress: () => navigation.navigate('PlantDiseaseDetection'),
    },
    {
      title: 'Soil Analysis',
      subtitle: 'Check soil health',
      icon: 'analytics',
      onPress: () => navigation.navigate('SoilAnalysis'),
    },
    {
      title: 'Product Store',
      subtitle: 'Buy gardening supplies',
      icon: 'storefront',
      onPress: () => navigation.navigate('ProductStore'),
    },
    {
      title: 'Weather & Tips',
      subtitle: 'Weather & gardening tips',
      icon: 'sunny',
      onPress: () => {},
    },
    {
      title: 'Water Schedule',
      subtitle: 'View schedule',
      icon: 'time',
      onPress: () => {},
    },
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
            <Text style={styles.greeting}>Hello Gardener!</Text>
            <Text style={styles.userName}>Sarah's Garden</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle" size={40} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Garden Overview</Text>
          <View style={styles.statsContainer}>
            {statsData.map(renderStatCard)}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Plant Care Reminders</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.remindersCard}>
            {plantCareReminders.map(renderPlantCareReminder)}
          </View>
        </View>

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
              💡 Good day for outdoor gardening! Consider watering in the evening.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>
      </ScrollView>
      <FloatingPlantScanner navigation={navigation} />
    </View>
  );
};

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
  },
  section: {
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  seeAllText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statCard: {
    width: cardWidth,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
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
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  statTitle: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    textAlign: 'center',
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
  reminderTime: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs / 2,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  weatherCard: {
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
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  weatherInfo: {
    marginLeft: spacing.md,
  },
  temperature: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  weatherDesc: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherDetailText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  weatherTip: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    fontStyle: 'italic',
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  actionsContainer: {
    gap: spacing.sm,
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
});

export default GardenerDashboard;
