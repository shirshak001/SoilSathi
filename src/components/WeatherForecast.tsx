import React, { useState, useEffect } from 'react';
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

interface WeatherData {
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    uvIndex: number;
    icon: string;
  };
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
    precipitation: number;
  }>;
  alerts?: Array<{
    type: 'warning' | 'advisory';
    title: string;
    description: string;
  }>;
}

interface WeatherForecastProps {
  onPress?: () => void;
}

const { width } = Dimensions.get('window');

const WeatherForecast: React.FC<WeatherForecastProps> = ({ onPress }) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const colors = theme.colors;

  const [weatherData, setWeatherData] = useState<WeatherData>({
    current: {
      temperature: 28,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      uvIndex: 6,
      icon: 'partly-sunny',
    },
    forecast: [
      {
        day: 'Today',
        high: 32,
        low: 22,
        condition: 'Partly Cloudy',
        icon: 'partly-sunny',
        precipitation: 20,
      },
      {
        day: 'Tomorrow',
        high: 29,
        low: 20,
        condition: 'Rainy',
        icon: 'rainy',
        precipitation: 80,
      },
      {
        day: 'Saturday',
        high: 31,
        low: 23,
        condition: 'Sunny',
        icon: 'sunny',
        precipitation: 5,
      },
      {
        day: 'Sunday',
        high: 27,
        low: 19,
        condition: 'Thunderstorm',
        icon: 'thunderstorm',
        precipitation: 90,
      },
      {
        day: 'Monday',
        high: 30,
        low: 21,
        condition: 'Cloudy',
        icon: 'cloudy',
        precipitation: 30,
      },
    ],
    alerts: [
      {
        type: 'warning',
        title: 'Heavy Rain Alert',
        description: 'Heavy rainfall expected tomorrow. Consider covering sensitive crops.',
      },
    ],
  });

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return 'sunny';
      case 'partly cloudy':
      case 'partly-sunny':
        return 'partly-sunny';
      case 'cloudy':
        return 'cloudy';
      case 'rainy':
        return 'rainy';
      case 'thunderstorm':
        return 'thunderstorm';
      case 'snow':
        return 'snow';
      default:
        return 'partly-sunny';
    }
  };

  const getWeatherAdvice = () => {
    const temp = weatherData.current.temperature;
    const condition = weatherData.current.condition.toLowerCase();
    const humidity = weatherData.current.humidity;

    if (language === 'hi') {
      if (condition.includes('rain') || condition.includes('thunderstorm')) {
        return 'बारिश के कारण आज खेत में काम न करें। फसल को ढकने का विचार करें।';
      } else if (temp > 35) {
        return 'आज बहुत गर्मी है। सुबह जल्दी या शाम को काम करें।';
      } else if (humidity > 80) {
        return 'नमी अधिक है। फंगल रोगों पर नजर रखें।';
      } else {
        return 'आज खेती के काम के लिए अच्छा दिन है।';
      }
    } else {
      if (condition.includes('rain') || condition.includes('thunderstorm')) {
        return 'Avoid field work today due to rain. Consider covering crops.';
      } else if (temp > 35) {
        return 'Very hot today. Work early morning or evening.';
      } else if (humidity > 80) {
        return 'High humidity. Watch for fungal diseases.';
      } else {
        return 'Good day for farming activities.';
      }
    }
  };

  const getStyles = () => StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      margin: spacing.md,
      elevation: 4,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.lg,
      paddingBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    seeAllText: {
      fontSize: fontSize.sm,
      color: colors.primary,
      fontWeight: fontWeight.medium,
    },
    currentWeather: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
    },
    currentWeatherGradient: {
      borderRadius: borderRadius.md,
      padding: spacing.lg,
    },
    currentMain: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    currentIcon: {
      marginRight: spacing.md,
    },
    currentInfo: {
      flex: 1,
    },
    temperature: {
      fontSize: fontSize.title,
      fontWeight: fontWeight.bold,
      color: colors.surface,
    },
    condition: {
      fontSize: fontSize.md,
      color: colors.surface,
      opacity: 0.9,
      marginTop: spacing.xs,
    },
    currentDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    detailItem: {
      alignItems: 'center',
    },
    detailIcon: {
      marginBottom: spacing.xs,
    },
    detailValue: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.surface,
    },
    detailLabel: {
      fontSize: fontSize.xs,
      color: colors.surface,
      opacity: 0.8,
      marginTop: spacing.xs / 2,
    },
    alertBanner: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
      borderRadius: borderRadius.md,
      padding: spacing.md,
    },
    alertTitle: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      color: colors.surface,
      marginBottom: spacing.xs,
    },
    alertDescription: {
      fontSize: fontSize.xs,
      color: colors.surface,
      opacity: 0.9,
    },
    forecast: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
    },
    forecastScroll: {
      paddingVertical: spacing.sm,
    },
    forecastItem: {
      alignItems: 'center',
      marginRight: spacing.md,
      padding: spacing.sm,
      borderRadius: borderRadius.md,
      backgroundColor: colors.background,
      minWidth: 80,
    },
    forecastDay: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    forecastIcon: {
      marginVertical: spacing.xs,
    },
    forecastHigh: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    forecastLow: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      marginTop: spacing.xs / 2,
    },
    forecastPrecip: {
      fontSize: fontSize.xs,
      color: colors.primary,
      marginTop: spacing.xs,
    },
    advice: {
      margin: spacing.lg,
      marginTop: 0,
      padding: spacing.md,
      backgroundColor: colors.background,
      borderRadius: borderRadius.md,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    adviceText: {
      fontSize: fontSize.sm,
      color: colors.text.primary,
      lineHeight: 20,
    },
  });

  const styles = getStyles();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>
          {language === 'hi' ? 'मौसम पूर्वानुमान' : 'Weather Forecast'}
        </Text>
        <Text style={styles.seeAllText}>
          {language === 'hi' ? '10 दिन' : '10 Days'}
        </Text>
      </View>

      {/* Current Weather */}
      <View style={styles.currentWeather}>
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.currentWeatherGradient}
        >
          <View style={styles.currentMain}>
            <View style={styles.currentIcon}>
              <Ionicons
                name={getWeatherIcon(weatherData.current.icon)}
                size={48}
                color={colors.surface}
              />
            </View>
            <View style={styles.currentInfo}>
              <Text style={styles.temperature}>
                {weatherData.current.temperature}°C
              </Text>
              <Text style={styles.condition}>
                {weatherData.current.condition}
              </Text>
            </View>
          </View>

          <View style={styles.currentDetails}>
            <View style={styles.detailItem}>
              <Ionicons
                name="water"
                size={16}
                color={colors.surface}
                style={styles.detailIcon}
              />
              <Text style={styles.detailValue}>
                {weatherData.current.humidity}%
              </Text>
              <Text style={styles.detailLabel}>
                {language === 'hi' ? 'नमी' : 'Humidity'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons
                name="speedometer"
                size={16}
                color={colors.surface}
                style={styles.detailIcon}
              />
              <Text style={styles.detailValue}>
                {weatherData.current.windSpeed} km/h
              </Text>
              <Text style={styles.detailLabel}>
                {language === 'hi' ? 'हवा' : 'Wind'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons
                name="sunny"
                size={16}
                color={colors.surface}
                style={styles.detailIcon}
              />
              <Text style={styles.detailValue}>
                {weatherData.current.uvIndex}
              </Text>
              <Text style={styles.detailLabel}>
                {language === 'hi' ? 'UV सूचकांक' : 'UV Index'}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Weather Alerts */}
      {weatherData.alerts && weatherData.alerts.length > 0 && (
        <View
          style={[
            styles.alertBanner,
            {
              backgroundColor: weatherData.alerts[0].type === 'warning'
                ? colors.error
                : colors.warning
            }
          ]}
        >
          <Text style={styles.alertTitle}>
            {weatherData.alerts[0].title}
          </Text>
          <Text style={styles.alertDescription}>
            {weatherData.alerts[0].description}
          </Text>
        </View>
      )}

      {/* 5-Day Forecast */}
      <View style={styles.forecast}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.forecastScroll}
        >
          {weatherData.forecast.map((day, index) => (
            <View key={index} style={styles.forecastItem}>
              <Text style={styles.forecastDay}>
                {language === 'hi' && day.day === 'Today' ? 'आज' :
                 language === 'hi' && day.day === 'Tomorrow' ? 'कल' :
                 day.day}
              </Text>
              <Ionicons
                name={getWeatherIcon(day.icon)}
                size={24}
                color={colors.primary}
                style={styles.forecastIcon}
              />
              <Text style={styles.forecastHigh}>{day.high}°</Text>
              <Text style={styles.forecastLow}>{day.low}°</Text>
              <Text style={styles.forecastPrecip}>
                {day.precipitation}%
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Farming Advice */}
      <View style={styles.advice}>
        <Text style={styles.adviceText}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="bulb" size={16} color={colors.warning} style={{ marginRight: spacing.xs }} />
            <Text style={styles.adviceText}>{getWeatherAdvice()}</Text>
          </View>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default WeatherForecast;
