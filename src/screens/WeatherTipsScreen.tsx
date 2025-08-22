import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface WeatherTipsScreenProps {
  navigation: any;
}

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  precipitation: number;
  forecast: DayForecast[];
}

interface DayForecast {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  rainChance: number;
}

interface GardeningTip {
  id: string;
  title: string;
  description: string;
  category: 'watering' | 'planting' | 'harvesting' | 'maintenance' | 'seasonal';
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'all';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
}

const { width } = Dimensions.get('window');

const WeatherTipsScreen: React.FC<WeatherTipsScreenProps> = ({ navigation }) => {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 24,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    uvIndex: 6,
    precipitation: 20,
    forecast: [
      { day: 'Today', high: 26, low: 18, condition: 'Partly Cloudy', icon: 'partly-sunny', rainChance: 20 },
      { day: 'Tomorrow', high: 28, low: 20, condition: 'Sunny', icon: 'sunny', rainChance: 5 },
      { day: 'Wednesday', high: 25, low: 17, condition: 'Rainy', icon: 'rainy', rainChance: 80 },
      { day: 'Thursday', high: 23, low: 15, condition: 'Cloudy', icon: 'cloudy', rainChance: 45 },
      { day: 'Friday', high: 27, low: 19, condition: 'Sunny', icon: 'sunny', rainChance: 10 },
    ]
  });

  const [gardeningTips] = useState<GardeningTip[]>([
    {
      id: '1',
      title: 'Perfect Watering Time',
      description: 'Water your plants early morning (6-10 AM) to reduce evaporation and prevent fungal diseases.',
      category: 'watering',
      season: 'all',
      difficulty: 'beginner',
      icon: 'water'
    },
    {
      id: '2',
      title: 'Companion Planting',
      description: 'Plant tomatoes with basil to improve flavor and repel pests naturally.',
      category: 'planting',
      season: 'summer',
      difficulty: 'intermediate',
      icon: 'leaf'
    },
    {
      id: '3',
      title: 'Soil pH Testing',
      description: 'Test your soil pH monthly. Most vegetables prefer slightly acidic to neutral soil (6.0-7.0).',
      category: 'maintenance',
      season: 'all',
      difficulty: 'intermediate',
      icon: 'flask'
    },
    {
      id: '4',
      title: 'Mulching Benefits',
      description: 'Apply 2-3 inches of organic mulch to retain moisture and suppress weeds.',
      category: 'maintenance',
      season: 'all',
      difficulty: 'beginner',
      icon: 'layers'
    },
    {
      id: '5',
      title: 'Harvest Timing',
      description: 'Harvest leafy greens in the morning after dew dries but before heat builds up.',
      category: 'harvesting',
      season: 'summer',
      difficulty: 'beginner',
      icon: 'basket'
    },
    {
      id: '6',
      title: 'Winter Protection',
      description: 'Cover tender plants with frost cloth when temperatures drop below 4°C.',
      category: 'seasonal',
      season: 'winter',
      difficulty: 'intermediate',
      icon: 'snow'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  const categories = [
    { key: 'all', label: 'All Tips', icon: 'grid' },
    { key: 'watering', label: 'Watering', icon: 'water' },
    { key: 'planting', label: 'Planting', icon: 'leaf' },
    { key: 'harvesting', label: 'Harvesting', icon: 'basket' },
    { key: 'maintenance', label: 'Care', icon: 'build' },
    { key: 'seasonal', label: 'Seasonal', icon: 'calendar' }
  ];

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return 'sunny';
      case 'partly cloudy': return 'partly-sunny';
      case 'cloudy': return 'cloudy';
      case 'rainy': return 'rainy';
      case 'stormy': return 'thunderstorm';
      default: return 'partly-sunny';
    }
  };

  const getWeatherAdvice = () => {
    const { temperature, humidity, precipitation, condition } = weatherData;
    
    if (precipitation > 70) {
      return {
        title: 'Rainy Day Advice',
        advice: 'Great day to avoid watering! Check for proper drainage and protect sensitive plants.',
        icon: 'umbrella',
        color: colors.secondary
      };
    } else if (temperature > 30) {
      return {
        title: 'Hot Weather Care',
        advice: 'Provide shade for delicate plants and water deeply in early morning.',
        icon: 'sunny',
        color: colors.warning
      };
    } else if (humidity < 40) {
      return {
        title: 'Low Humidity Alert',
        advice: 'Increase watering frequency and consider misting for humidity-loving plants.',
        icon: 'water',
        color: colors.secondary
      };
    } else {
      return {
        title: 'Perfect Growing Conditions',
        advice: 'Ideal weather for most garden activities. Great time for planting and maintenance.',
        icon: 'leaf',
        color: colors.success
      };
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return colors.success;
      case 'intermediate': return colors.warning;
      case 'advanced': return colors.error;
      default: return colors.text.secondary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'watering': return 'water';
      case 'planting': return 'leaf';
      case 'harvesting': return 'basket';
      case 'maintenance': return 'build';
      case 'seasonal': return 'calendar';
      default: return 'information-circle';
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const filteredTips = selectedCategory === 'all' 
    ? gardeningTips 
    : gardeningTips.filter(tip => tip.category === selectedCategory);

  const weatherAdvice = getWeatherAdvice();

  const renderForecastCard = (forecast: DayForecast, index: number) => (
    <View key={index} style={styles.forecastCard}>
      <Text style={styles.forecastDay}>{forecast.day}</Text>
      <Ionicons name={forecast.icon as any} size={32} color={colors.primary} />
      <Text style={styles.forecastHigh}>{forecast.high}°</Text>
      <Text style={styles.forecastLow}>{forecast.low}°</Text>
      <View style={styles.rainChance}>
        <Ionicons name="water" size={12} color={colors.secondary} />
        <Text style={styles.rainText}>{forecast.rainChance}%</Text>
      </View>
    </View>
  );

  const renderTipCard = (tip: GardeningTip) => (
    <View key={tip.id} style={styles.tipCard}>
      <View style={styles.tipHeader}>
        <View style={styles.tipIconContainer}>
          <Ionicons name={getCategoryIcon(tip.category) as any} size={24} color={colors.primary} />
        </View>
        <View style={styles.tipInfo}>
          <Text style={styles.tipTitle}>{tip.title}</Text>
          <View style={styles.tipMeta}>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(tip.difficulty) }]}>
              <Text style={styles.difficultyText}>{tip.difficulty}</Text>
            </View>
            <Text style={styles.categoryText}>{tip.category}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.tipDescription}>{tip.description}</Text>
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
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Weather & Tips</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Ionicons name="refresh" size={24} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Current Weather */}
        <View style={styles.weatherContainer}>
          <LinearGradient
            colors={[colors.primaryLight, colors.primary]}
            style={styles.weatherCard}
          >
            <View style={styles.weatherMain}>
              <View style={styles.weatherLeft}>
                <Text style={styles.temperature}>{weatherData.temperature}°C</Text>
                <Text style={styles.condition}>{weatherData.condition}</Text>
              </View>
              <Ionicons 
                name={getWeatherIcon(weatherData.condition) as any} 
                size={64} 
                color={colors.surface} 
              />
            </View>
            
            <View style={styles.weatherDetails}>
              <View style={styles.weatherDetailRow}>
                <View style={styles.weatherDetail}>
                  <Ionicons name="water" size={16} color={colors.surface} />
                  <Text style={styles.weatherDetailText}>Humidity: {weatherData.humidity}%</Text>
                </View>
                <View style={styles.weatherDetail}>
                  <Ionicons name="speedometer" size={16} color={colors.surface} />
                  <Text style={styles.weatherDetailText}>Wind: {weatherData.windSpeed} km/h</Text>
                </View>
              </View>
              <View style={styles.weatherDetailRow}>
                <View style={styles.weatherDetail}>
                  <Ionicons name="sunny" size={16} color={colors.surface} />
                  <Text style={styles.weatherDetailText}>UV Index: {weatherData.uvIndex}</Text>
                </View>
                <View style={styles.weatherDetail}>
                  <Ionicons name="rainy" size={16} color={colors.surface} />
                  <Text style={styles.weatherDetailText}>Rain: {weatherData.precipitation}%</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Weather Advice */}
        <View style={styles.adviceContainer}>
          <View style={[styles.adviceCard, { borderLeftColor: weatherAdvice.color }]}>
            <View style={styles.adviceHeader}>
              <Ionicons name={weatherAdvice.icon as any} size={24} color={weatherAdvice.color} />
              <Text style={styles.adviceTitle}>{weatherAdvice.title}</Text>
            </View>
            <Text style={styles.adviceText}>{weatherAdvice.advice}</Text>
          </View>
        </View>

        {/* 5-Day Forecast */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5-Day Forecast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastScroll}>
            {weatherData.forecast.map(renderForecastCard)}
          </ScrollView>
        </View>

        {/* Category Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gardening Tips</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.key && styles.activeCategoryButton
                ]}
                onPress={() => setSelectedCategory(category.key)}
              >
                <Ionicons 
                  name={category.icon as any} 
                  size={20} 
                  color={selectedCategory === category.key ? colors.surface : colors.text.secondary} 
                />
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category.key && styles.activeCategoryButtonText
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tips List */}
        <View style={styles.tipsContainer}>
          {filteredTips.map(renderTipCard)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.surface,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.md,
  },
  refreshButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
  },
  weatherContainer: {
    padding: spacing.lg,
  },
  weatherCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  weatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  weatherLeft: {
    flex: 1,
  },
  temperature: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  condition: {
    fontSize: fontSize.lg,
    color: colors.surface,
    opacity: 0.9,
  },
  weatherDetails: {
    gap: spacing.sm,
  },
  weatherDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  weatherDetailText: {
    fontSize: fontSize.sm,
    color: colors.surface,
    opacity: 0.9,
  },
  adviceContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  adviceCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  adviceTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  adviceText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  forecastScroll: {
    paddingLeft: spacing.lg,
  },
  forecastCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginRight: spacing.md,
    alignItems: 'center',
    minWidth: 80,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  forecastDay: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  forecastHigh: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  forecastLow: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  rainChance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rainText: {
    fontSize: fontSize.xs,
    color: colors.secondary,
  },
  categoryScroll: {
    paddingLeft: spacing.lg,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  activeCategoryButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  activeCategoryButtonText: {
    color: colors.surface,
    fontWeight: fontWeight.medium,
  },
  tipsContainer: {
    padding: spacing.lg,
  },
  tipCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipHeader: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  tipInfo: {
    flex: 1,
  },
  tipTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  tipMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  difficultyText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  categoryText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  tipDescription: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});

export default WeatherTipsScreen;
