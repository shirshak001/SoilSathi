import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface WeatherForecastScreenProps {
  navigation: any;
}

interface WeatherData {
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    uvIndex: number;
    pressure: number;
    visibility: number;
    icon: string;
  };
  hourly: HourlyWeather[];
  daily: DailyWeather[];
  alerts: WeatherAlert[];
}

interface HourlyWeather {
  time: string;
  temperature: number;
  condition: string;
  icon: string;
  precipitation: number;
}

interface DailyWeather {
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  precipitation: number;
  humidity: number;
}

interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  startTime: string;
  endTime: string;
}

interface FarmingAdvice {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  icon: string;
}

const { width } = Dimensions.get('window');

const WeatherForecastScreen: React.FC<WeatherForecastScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { translations } = useLanguage();

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'today' | 'week' | 'advice'>('today');
  const [location, setLocation] = useState('Agricultural Valley, CA');

  const tabs = [
    { key: 'today', label: 'Today', icon: 'today' },
    { key: 'week', label: '7-Day', icon: 'calendar' },
    { key: 'advice', label: 'Farm Advice', icon: 'bulb' },
  ];

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setWeatherData({
          current: {
            temperature: 24,
            condition: 'Partly Cloudy',
            humidity: 65,
            windSpeed: 12,
            uvIndex: 6,
            pressure: 1013,
            visibility: 10,
            icon: 'partly-sunny',
          },
          hourly: [
            { time: '12:00', temperature: 24, condition: 'Partly Cloudy', icon: 'partly-sunny', precipitation: 10 },
            { time: '13:00', temperature: 26, condition: 'Sunny', icon: 'sunny', precipitation: 0 },
            { time: '14:00', temperature: 28, condition: 'Sunny', icon: 'sunny', precipitation: 0 },
            { time: '15:00', temperature: 29, condition: 'Partly Cloudy', icon: 'partly-sunny', precipitation: 5 },
            { time: '16:00', temperature: 27, condition: 'Cloudy', icon: 'cloudy', precipitation: 15 },
            { time: '17:00', temperature: 25, condition: 'Light Rain', icon: 'rainy', precipitation: 60 },
          ],
          daily: [
            { date: 'Today', high: 29, low: 18, condition: 'Partly Cloudy', icon: 'partly-sunny', precipitation: 20, humidity: 65 },
            { date: 'Tomorrow', high: 31, low: 20, condition: 'Sunny', icon: 'sunny', precipitation: 5, humidity: 55 },
            { date: 'Wednesday', high: 28, low: 17, condition: 'Light Rain', icon: 'rainy', precipitation: 70, humidity: 80 },
            { date: 'Thursday', high: 26, low: 16, condition: 'Rainy', icon: 'rainy', precipitation: 85, humidity: 85 },
            { date: 'Friday', high: 24, low: 14, condition: 'Cloudy', icon: 'cloudy', precipitation: 30, humidity: 70 },
            { date: 'Saturday', high: 27, low: 16, condition: 'Partly Cloudy', icon: 'partly-sunny', precipitation: 15, humidity: 60 },
            { date: 'Sunday', high: 30, low: 19, condition: 'Sunny', icon: 'sunny', precipitation: 0, humidity: 50 },
          ],
          alerts: [
            {
              id: '1',
              title: 'Heavy Rain Warning',
              description: 'Heavy rainfall expected Thursday afternoon. Consider postponing outdoor activities.',
              severity: 'high',
              startTime: 'Thu 14:00',
              endTime: 'Thu 20:00',
            },
          ],
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to load weather data. Please try again.');
    }
  };

  const farmingAdvice: FarmingAdvice[] = [
    {
      id: '1',
      category: 'Irrigation',
      title: 'Reduce Watering',
      description: 'Rain expected tomorrow. Reduce irrigation to avoid overwatering.',
      priority: 'high',
      icon: 'water',
    },
    {
      id: '2',
      category: 'Planting',
      title: 'Good Planting Conditions',
      description: 'Moderate temperature and humidity perfect for seed germination.',
      priority: 'medium',
      icon: 'leaf',
    },
    {
      id: '3',
      category: 'Pest Control',
      title: 'Monitor for Pests',
      description: 'High humidity may increase pest activity. Check crops regularly.',
      priority: 'medium',
      icon: 'bug',
    },
    {
      id: '4',
      category: 'Harvesting',
      title: 'Harvest Before Rain',
      description: 'Complete harvesting before Thursday rain to prevent crop damage.',
      priority: 'high',
      icon: 'basket',
    },
  ];

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return colors.text.secondary;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return colors.text.secondary;
    }
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
    locationButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.surface + '20',
      borderRadius: borderRadius.md,
    },
    locationText: {
      fontSize: fontSize.sm,
      color: colors.surface,
      marginRight: spacing.xs,
    },
    content: {
      flex: 1,
    },
    currentWeatherCard: {
      backgroundColor: colors.surface,
      marginHorizontal: spacing.lg,
      marginTop: -spacing.xl,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      elevation: 4,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    currentWeatherTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    temperatureSection: {
      alignItems: 'center',
    },
    currentTemp: {
      fontSize: 48,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    currentCondition: {
      fontSize: fontSize.md,
      color: colors.text.secondary,
      marginTop: spacing.xs,
    },
    weatherIcon: {
      width: 80,
      height: 80,
      backgroundColor: colors.primary + '15',
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    weatherDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    weatherDetailItem: {
      alignItems: 'center',
      flex: 1,
    },
    detailIcon: {
      width: 32,
      height: 32,
      backgroundColor: colors.background,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    detailValue: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.xs / 2,
    },
    detailLabel: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      borderRadius: borderRadius.lg,
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    tabText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
    },
    activeTabText: {
      color: colors.surface,
    },
    tabContent: {
      flex: 1,
      padding: spacing.lg,
    },
    alertsContainer: {
      marginBottom: spacing.lg,
    },
    alertCard: {
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderLeftWidth: 4,
    },
    alertHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    alertTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      flex: 1,
    },
    alertTime: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
    },
    alertDescription: {
      fontSize: fontSize.sm,
      lineHeight: 20,
    },
    hourlyContainer: {
      marginBottom: spacing.lg,
    },
    hourlyScroll: {
      paddingHorizontal: spacing.lg,
    },
    hourlyItem: {
      alignItems: 'center',
      marginRight: spacing.lg,
      backgroundColor: colors.surface,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.md,
      minWidth: 70,
    },
    hourlyTime: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      marginBottom: spacing.sm,
    },
    hourlyIcon: {
      width: 32,
      height: 32,
      backgroundColor: colors.background,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    hourlyTemp: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    hourlyPrecip: {
      fontSize: fontSize.xs,
      color: '#3B82F6',
    },
    dailyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.sm,
      borderRadius: borderRadius.md,
    },
    dailyDate: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
      width: 80,
    },
    dailyIconContainer: {
      width: 40,
      height: 40,
      backgroundColor: colors.background,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: spacing.md,
    },
    dailyCondition: {
      flex: 1,
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    dailyTempContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    dailyHigh: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginRight: spacing.sm,
    },
    dailyLow: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    dailyPrecip: {
      fontSize: fontSize.xs,
      color: '#3B82F6',
      width: 40,
      textAlign: 'right',
    },
    adviceCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderLeftWidth: 4,
    },
    adviceHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    adviceIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    adviceCategory: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      textTransform: 'uppercase',
      marginBottom: spacing.xs / 2,
    },
    adviceTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      flex: 1,
    },
    adviceDescription: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      lineHeight: 20,
    },
    sectionTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
  });

  const styles = getStyles();

  const renderCurrentWeather = () => {
    if (!weatherData) return null;

    return (
      <View style={styles.currentWeatherCard}>
        <View style={styles.currentWeatherTop}>
          <View style={styles.temperatureSection}>
            <Text style={styles.currentTemp}>{weatherData.current.temperature}°</Text>
            <Text style={styles.currentCondition}>{weatherData.current.condition}</Text>
          </View>
          <View style={styles.weatherIcon}>
            <Ionicons
              name={weatherData.current.icon as any}
              size={40}
              color={colors.primary}
            />
          </View>
        </View>

        <View style={styles.weatherDetails}>
          <View style={styles.weatherDetailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="water" size={16} color={colors.text.secondary} />
            </View>
            <Text style={styles.detailValue}>{weatherData.current.humidity}%</Text>
            <Text style={styles.detailLabel}>Humidity</Text>
          </View>
          <View style={styles.weatherDetailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="leaf" size={16} color={colors.text.secondary} />
            </View>
            <Text style={styles.detailValue}>{weatherData.current.windSpeed}</Text>
            <Text style={styles.detailLabel}>Wind km/h</Text>
          </View>
          <View style={styles.weatherDetailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="sunny" size={16} color={colors.text.secondary} />
            </View>
            <Text style={styles.detailValue}>{weatherData.current.uvIndex}</Text>
            <Text style={styles.detailLabel}>UV Index</Text>
          </View>
          <View style={styles.weatherDetailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="speedometer" size={16} color={colors.text.secondary} />
            </View>
            <Text style={styles.detailValue}>{weatherData.current.pressure}</Text>
            <Text style={styles.detailLabel}>Pressure</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderTodayTab = () => {
    if (!weatherData) return null;

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Weather Alerts */}
        {weatherData.alerts.length > 0 && (
          <View style={styles.alertsContainer}>
            <Text style={styles.sectionTitle}>Weather Alerts</Text>
            {weatherData.alerts.map((alert) => (
              <View
                key={alert.id}
                style={[
                  styles.alertCard,
                  {
                    backgroundColor: getAlertColor(alert.severity) + '10',
                    borderLeftColor: getAlertColor(alert.severity),
                  },
                ]}
              >
                <View style={styles.alertHeader}>
                  <Text
                    style={[styles.alertTitle, { color: getAlertColor(alert.severity) }]}
                  >
                    {alert.title}
                  </Text>
                  <Text
                    style={[styles.alertTime, { color: getAlertColor(alert.severity) }]}
                  >
                    {alert.startTime} - {alert.endTime}
                  </Text>
                </View>
                <Text style={styles.alertDescription}>{alert.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Hourly Forecast */}
        <View style={styles.hourlyContainer}>
          <Text style={styles.sectionTitle}>Hourly Forecast</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hourlyScroll}
          >
            {weatherData.hourly.map((hour, index) => (
              <View key={index} style={styles.hourlyItem}>
                <Text style={styles.hourlyTime}>{hour.time}</Text>
                <View style={styles.hourlyIcon}>
                  <Ionicons name={hour.icon as any} size={16} color={colors.primary} />
                </View>
                <Text style={styles.hourlyTemp}>{hour.temperature}°</Text>
                <Text style={styles.hourlyPrecip}>{hour.precipitation}%</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    );
  };

  const renderWeekTab = () => {
    if (!weatherData) return null;

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>7-Day Forecast</Text>
        {weatherData.daily.map((day, index) => (
          <View key={index} style={styles.dailyItem}>
            <Text style={styles.dailyDate}>{day.date}</Text>
            <View style={styles.dailyIconContainer}>
              <Ionicons name={day.icon as any} size={20} color={colors.primary} />
            </View>
            <Text style={styles.dailyCondition}>{day.condition}</Text>
            <View style={styles.dailyTempContainer}>
              <Text style={styles.dailyHigh}>{day.high}°</Text>
              <Text style={styles.dailyLow}>{day.low}°</Text>
            </View>
            <Text style={styles.dailyPrecip}>{day.precipitation}%</Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderAdviceTab = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Farming Recommendations</Text>
        {farmingAdvice.map((advice) => (
          <View
            key={advice.id}
            style={[
              styles.adviceCard,
              {
                backgroundColor: getPriorityColor(advice.priority) + '10',
                borderLeftColor: getPriorityColor(advice.priority),
              },
            ]}
          >
            <View style={styles.adviceHeader}>
              <View
                style={[
                  styles.adviceIconContainer,
                  { backgroundColor: getPriorityColor(advice.priority) + '20' },
                ]}
              >
                <Ionicons
                  name={advice.icon as any}
                  size={16}
                  color={getPriorityColor(advice.priority)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.adviceCategory,
                    { color: getPriorityColor(advice.priority) },
                  ]}
                >
                  {advice.category}
                </Text>
                <Text style={styles.adviceTitle}>{advice.title}</Text>
              </View>
            </View>
            <Text style={styles.adviceDescription}>{advice.description}</Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'today':
        return renderTodayTab();
      case 'week':
        return renderWeekTab();
      case 'advice':
        return renderAdviceTab();
      default:
        return renderTodayTab();
    }
  };

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
            <Text style={styles.headerTitle}>Weather Forecast</Text>
          </View>
          <TouchableOpacity style={styles.locationButton}>
            <Text style={styles.locationText}>{location}</Text>
            <Ionicons name="location" size={16} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadWeatherData}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {renderCurrentWeather()}

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

        <View style={styles.tabContent}>{renderTabContent()}</View>
      </ScrollView>
    </View>
  );
};

export default WeatherForecastScreen;
