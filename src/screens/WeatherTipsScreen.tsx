import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// ✅ Define WeatherData type
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

// ✅ OpenWeather API key
const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

const WeatherForecast: React.FC<WeatherForecastProps> = ({ onPress }) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const colors = theme.colors;

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);


  // ✅ Fetch Gardener city from protected route + weather data
  const fetchWeatherData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      // 1. Fetch logged-in user
      const res = await fetch("https://soilsathi-backend.onrender.com/api/v1/gardener/protected", {
        headers: {
          Authorization: `Bearer ${token}`, // replace with stored token
        },
      });
      const data = await res.json();

      if (!data.success) throw new Error("Failed to get user");

      const city = data.user.City; // ✅ Gardener's city
      console.log("🌍 City from DB:", city);

      // 2. Fetch weather from OpenWeather
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const weatherJson = await weatherRes.json();

      // ✅ Transform OpenWeather response to your UI format
      const transformed: WeatherData = {
        current: {
          temperature: weatherJson.list[0].main.temp,
          condition: weatherJson.list[0].weather[0].main,
          humidity: weatherJson.list[0].main.humidity,
          windSpeed: weatherJson.list[0].wind.speed,
          uvIndex: Math.floor(Math.random() * 10), // OpenWeather free API doesn’t provide UV
          icon: weatherJson.list[0].weather[0].main.toLowerCase(),
        },
        forecast: weatherJson.list.slice(0, 5).map((item: any, index: number) => ({
          day:
            index === 0
              ? "Today"
              : new Date(item.dt_txt).toLocaleDateString("en-US", {
                  weekday: "long",
                }),
          high: item.main.temp_max,
          low: item.main.temp_min,
          condition: item.weather[0].main,
          icon: item.weather[0].main.toLowerCase(),
          precipitation: item.pop ? item.pop * 100 : 0,
        })),
        alerts: [],
      };

      setWeatherData(transformed);
    } catch (err) {
      console.error("❌ Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return 'sunny';
      case 'partly cloudy':
      case 'partly-sunny': return 'partly-sunny';
      case 'clouds': return 'cloudy';
      case 'rain': return 'rainy';
      case 'thunderstorm': return 'thunderstorm';
      case 'snow': return 'snow';
      default: return 'partly-sunny';
    }
  };

  const getWeatherAdvice = () => {
    if (!weatherData) return "";
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

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      margin: spacing.md,
      elevation: 4,
    },
    sectionTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    temperature: {
      fontSize: fontSize.title,
      fontWeight: fontWeight.bold,
      color: colors.surface,
    },
    condition: {
      fontSize: fontSize.md,
      color: colors.surface,
    },
    advice: {
      margin: spacing.lg,
      padding: spacing.md,
      backgroundColor: colors.background,
      borderRadius: borderRadius.md,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    adviceText: {
      fontSize: fontSize.sm,
      color: colors.text.primary,
    },
  });

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />;
  }

  if (!weatherData) {
    return <Text style={{ color: colors.text.primary, margin: 20 }}>❌ Failed to load weather data.</Text>;
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      {/* Current Weather */}
      <LinearGradient colors={[colors.primary, colors.primaryLight]} style={{ padding: spacing.lg }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name={getWeatherIcon(weatherData.current.icon)}
            size={48}
            color={colors.surface}
            style={{ marginRight: spacing.md }}
          />
          <View>
            <Text style={styles.temperature}>{weatherData.current.temperature}°C</Text>
            <Text style={styles.condition}>{weatherData.current.condition}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Forecast */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ margin: spacing.md }}>
        {weatherData.forecast.map((day, index) => (
          <View key={index} style={{ marginRight: spacing.md, alignItems: "center" }}>
            <Text>{day.day}</Text>
            <Ionicons name={getWeatherIcon(day.icon)} size={24} color={colors.primary} />
            <Text>{day.high}° / {day.low}°</Text>
          </View>
        ))}
      </ScrollView>

      {/* Farming Advice */}
      <View style={styles.advice}>
        <Text style={styles.adviceText}>{getWeatherAdvice()}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default WeatherForecast;
