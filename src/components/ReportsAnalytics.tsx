import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface ReportsAnalyticsProps {
  navigation?: any;
}

interface MetricData {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  color: string;
}

interface ReportCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lastUpdated: string;
}

const { width } = Dimensions.get('window');

const ReportsAnalytics: React.FC<ReportsAnalyticsProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { translations } = useLanguage();

  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const periods = [
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'yearly', label: 'Yearly' },
  ];

  const keyMetrics: MetricData[] = [
    {
      id: '1',
      title: 'Total Yield',
      value: '2,450 kg',
      change: '+12.5%',
      changeType: 'increase',
      icon: 'bar-chart',
      color: colors.primary,
    },
    {
      id: '2',
      title: 'Revenue',
      value: '$18,250',
      change: '+8.3%',
      changeType: 'increase',
      icon: 'cash',
      color: '#10B981',
    },
    {
      id: '3',
      title: 'Crop Health',
      value: '94%',
      change: '+2.1%',
      changeType: 'increase',
      icon: 'leaf',
      color: '#F59E0B',
    },
    {
      id: '4',
      title: 'Water Usage',
      value: '1,850L',
      change: '-5.7%',
      changeType: 'decrease',
      icon: 'water',
      color: '#3B82F6',
    },
  ];

  const reportCategories: ReportCategory[] = [
    {
      id: '1',
      title: 'Crop Performance',
      description: 'Detailed analysis of crop yield and growth patterns',
      icon: 'trending-up',
      color: colors.primary,
      lastUpdated: '2 hours ago',
    },
    {
      id: '2',
      title: 'Financial Report',
      description: 'Revenue, expenses, and profit analysis',
      icon: 'card',
      color: '#10B981',
      lastUpdated: '1 day ago',
    },
    {
      id: '3',
      title: 'Resource Usage',
      description: 'Water, fertilizer, and equipment utilization',
      icon: 'speedometer',
      color: '#F59E0B',
      lastUpdated: '3 hours ago',
    },
    {
      id: '4',
      title: 'Weather Impact',
      description: 'How weather conditions affected your farming',
      icon: 'partly-sunny',
      color: '#8B5CF6',
      lastUpdated: '6 hours ago',
    },
    {
      id: '5',
      title: 'Pest & Disease',
      description: 'Disease detection and pest control effectiveness',
      icon: 'bug',
      color: '#EF4444',
      lastUpdated: '12 hours ago',
    },
    {
      id: '6',
      title: 'Soil Health',
      description: 'Soil quality, pH levels, and nutrient analysis',
      icon: 'layers',
      color: '#8B4513',
      lastUpdated: '1 day ago',
    },
  ];

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return '#10B981';
      case 'decrease':
        return '#EF4444';
      default:
        return colors.text.secondary;
    }
  };

  const getStyles = () => StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      margin: spacing.md,
      elevation: 3,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.primary + '15',
      borderRadius: borderRadius.md,
    },
    viewAllText: {
      fontSize: fontSize.sm,
      color: colors.primary,
      fontWeight: fontWeight.medium,
      marginRight: spacing.xs,
    },
    content: {
      padding: spacing.lg,
    },
    periodSelector: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      borderRadius: borderRadius.md,
      padding: spacing.xs,
      marginBottom: spacing.lg,
    },
    periodButton: {
      flex: 1,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.sm,
      alignItems: 'center',
    },
    activePeriodButton: {
      backgroundColor: colors.primary,
    },
    periodButtonText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      fontWeight: fontWeight.medium,
    },
    activePeriodButtonText: {
      color: colors.surface,
    },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
    },
    metricCard: {
      width: (width - spacing.lg * 4) / 2,
      backgroundColor: colors.background,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      elevation: 1,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    metricHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    metricIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    metricValue: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.xs / 2,
    },
    metricTitle: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    metricChange: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    metricChangeText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      marginLeft: spacing.xs / 2,
    },
    sectionTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    reportCard: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      elevation: 1,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    reportHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    reportIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    reportContent: {
      flex: 1,
    },
    reportTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
      marginBottom: spacing.xs / 2,
    },
    reportDescription: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    reportMeta: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
    },
    reportArrow: {
      marginLeft: spacing.sm,
    },
  });

  const styles = getStyles();

  const handleReportPress = (reportId: string) => {
    // Navigate to detailed report screen
    console.log('Opening report:', reportId);
  };

  const handleViewAllPress = () => {
    // Navigate to full reports screen
    if (navigation) {
      navigation.navigate('FullReports');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reports & Analytics</Text>
        <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAllPress}>
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.activePeriodButton,
              ]}
              onPress={() => setSelectedPeriod(period.key)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period.key && styles.activePeriodButtonText,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Metrics */}
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.metricsGrid}>
          {keyMetrics.map((metric) => (
            <View key={metric.id} style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <View
                  style={[
                    styles.metricIconContainer,
                    { backgroundColor: metric.color + '15' },
                  ]}
                >
                  <Ionicons name={metric.icon as any} size={16} color={metric.color} />
                </View>
              </View>
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.metricTitle}>{metric.title}</Text>
              <View style={styles.metricChange}>
                <Ionicons
                  name={
                    metric.changeType === 'increase'
                      ? 'trending-up'
                      : metric.changeType === 'decrease'
                      ? 'trending-down'
                      : 'remove'
                  }
                  size={12}
                  color={getChangeColor(metric.changeType)}
                />
                <Text
                  style={[
                    styles.metricChangeText,
                    { color: getChangeColor(metric.changeType) },
                  ]}
                >
                  {metric.change}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Report Categories */}
        <Text style={styles.sectionTitle}>Available Reports</Text>
        {reportCategories.map((report) => (
          <TouchableOpacity
            key={report.id}
            style={styles.reportCard}
            onPress={() => handleReportPress(report.id)}
          >
            <View style={styles.reportHeader}>
              <View
                style={[
                  styles.reportIconContainer,
                  { backgroundColor: report.color + '15' },
                ]}
              >
                <Ionicons name={report.icon as any} size={20} color={report.color} />
              </View>
              <View style={styles.reportContent}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportDescription}>{report.description}</Text>
                <Text style={styles.reportMeta}>Updated {report.lastUpdated}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.text.secondary}
                style={styles.reportArrow}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default ReportsAnalytics;
