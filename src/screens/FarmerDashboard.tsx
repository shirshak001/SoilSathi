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

interface FarmerDashboardProps {
  navigation: any;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - spacing.lg * 3) / 2;

const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ navigation }) => {
  const statsData = [
    {
      title: 'Active Fields',
      value: '12',
      icon: 'grid',
      color: colors.primary,
    },
    {
      title: 'Water Usage',
      value: '2,450L',
      icon: 'water',
      color: colors.secondary,
    },
    {
      title: 'Next Irrigation',
      value: '2 hrs',
      icon: 'timer',
      color: colors.accent,
    },
    {
      title: 'Soil Moisture',
      value: '68%',
      icon: 'analytics',
      color: colors.primaryLight,
    },
  ];

  const quickActions = [
    {
      title: 'Field Management',
      subtitle: 'Monitor all fields',
      icon: 'map',
      onPress: () => {},
    },
    {
      title: 'Plant Health Scanner',
      subtitle: 'Detect crop diseases',
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
      title: 'Drone Services',
      subtitle: 'Book drone spraying',
      icon: 'airplane',
      onPress: () => navigation.navigate('DroneService'),
    },
    {
      title: 'Product Store',
      subtitle: 'Buy farming supplies',
      icon: 'storefront',
      onPress: () => navigation.navigate('ProductStore'),
    },
    {
      title: 'Irrigation Schedule',
      subtitle: 'View & edit schedule',
      icon: 'calendar',
      onPress: () => {},
    },
    {
      title: 'Weather Forecast',
      subtitle: 'Check weather data',
      icon: 'cloudy',
      onPress: () => {},
    },
    {
      title: 'Reports & Analytics',
      subtitle: 'View detailed reports',
      icon: 'bar-chart',
      onPress: () => {},
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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <LinearGradient
        colors={[colors.primaryLight, colors.primary]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Good Morning!</Text>
            <Text style={styles.userName}>Farmer John</Text>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.statsContainer}>
            {statsData.map(renderStatCard)}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Field Status</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.fieldStatusCard}>
            <View style={styles.fieldRow}>
              <View style={styles.fieldInfo}>
                <Text style={styles.fieldName}>Field A - Wheat</Text>
                <Text style={styles.fieldStatus}>Next irrigation in 2 hours</Text>
              </View>
              <View style={[styles.statusIndicator, { backgroundColor: colors.success }]} />
            </View>
            
            <View style={styles.fieldRow}>
              <View style={styles.fieldInfo}>
                <Text style={styles.fieldName}>Field B - Corn</Text>
                <Text style={styles.fieldStatus}>Irrigation in progress</Text>
              </View>
              <View style={[styles.statusIndicator, { backgroundColor: colors.warning }]} />
            </View>
            
            <View style={styles.fieldRow}>
              <View style={styles.fieldInfo}>
                <Text style={styles.fieldName}>Field C - Tomatoes</Text>
                <Text style={styles.fieldStatus}>Well irrigated</Text>
              </View>
              <View style={[styles.statusIndicator, { backgroundColor: colors.success }]} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Drone Services</Text>
            <TouchableOpacity onPress={() => navigation.navigate('DroneServiceHistory')}>
              <Text style={styles.seeAllText}>View History</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.droneServiceCard}>
            <LinearGradient
              colors={[colors.secondary, colors.primary]}
              style={styles.droneGradient}
            >
              <View style={styles.droneContent}>
                <View style={styles.droneLeft}>
                  <Ionicons name="airplane" size={32} color={colors.surface} />
                  <View style={styles.droneInfo}>
                    <Text style={styles.droneTitle}>Professional Drone Spraying</Text>
                    <Text style={styles.droneSubtitle}>
                      Fertilizers • Pesticides • Nutrients
                    </Text>
                    <Text style={styles.dronePrice}>Starting from ₹0.12/sqm</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.droneButton}
                  onPress={() => navigation.navigate('DroneService')}
                >
                  <Text style={styles.droneButtonText}>Book</Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </LinearGradient>
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
  fieldStatusCard: {
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
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  fieldInfo: {
    flex: 1,
  },
  fieldName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  fieldStatus: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs / 2,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
  droneServiceCard: {
    borderRadius: borderRadius.md,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  droneGradient: {
    borderRadius: borderRadius.md,
    padding: spacing.lg,
  },
  droneContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  droneLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  droneInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  droneTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.surface,
    marginBottom: spacing.xs / 2,
  },
  droneSubtitle: {
    fontSize: fontSize.sm,
    color: colors.surface,
    opacity: 0.9,
    marginBottom: spacing.xs,
  },
  dronePrice: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
  },
  droneButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  droneButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
    marginRight: spacing.xs,
  },
});

export default FarmerDashboard;
