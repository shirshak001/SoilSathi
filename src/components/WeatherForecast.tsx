import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import {
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
} from "../constants/theme";

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
}

interface WeatherForecastProps {
  gardenerId: string; // Pass logged-in gardener ID
  onPress?: () => void;
}

const { width } = Dimensions.get("window");

const OPENWEATHER_API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

const WeatherForecast: React.FC<WeatherForecastProps> = ({
  gardenerId,
  onPress,
}) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const colors = theme.colors;

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch city from your backend gardener DB
  const fetchCityAndWeather = async () => {
    try {
      setLoading(true);

      // Step 1: Get gardener city from backend
      const gardenerRes = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/gardener/${gardenerId}`
      );
      const city = gardenerRes.data.city || "Delhi"; // fallback

      // Step 2: Fetch weather data from OpenWeather
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );

      // Current weather
      const currentWeather = weatherRes.data.list[0];
      const current = {
        temperature: currentWeather.main.temp,
        condition: currentWeather.weather[0].description,
        humidity: currentWeather.main.humidity,
        windSpeed: currentWeather.wind.speed,
        uvIndex: 6, // ⚠️ OpenWeather free API doesn’t provide UV Index directly
        icon: currentWeather.weather[0].icon,
      };

      // Forecast: Group by day
      const forecastMap: Record<string, any> = {};
      weatherRes.data.list.forEach((entry: any) => {
        const date = new Date(entry.dt * 1000);
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

        if (!forecastMap[dayName]) {
          forecastMap[dayName] = {
            high: entry.main.temp_max,
            low: entry.main.temp_min,
            condition: entry.weather[0].main,
            icon: entry.weather[0].icon,
            precipitation: entry.pop * 100,
          };
        } else {
          forecastMap[dayName].high = Math.max(
            forecastMap[dayName].high,
            entry.main.temp_max
          );
          forecastMap[dayName].low = Math.min(
            forecastMap[dayName].low,
            entry.main.temp_min
          );
        }
      });

      const forecast = Object.keys(forecastMap)
        .slice(0, 5)
        .map((day) => ({
          day,
          ...forecastMap[day],
        }));

      setWeatherData({ current, forecast });
    } catch (err) {
      console.error("Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCityAndWeather();
  }, [gardenerId]);

  const getWeatherIcon = (iconCode: string) =>
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  const getWeatherAdvice = () => {
    if (!weatherData) return "";
    const temp = weatherData.current.temperature;
    const condition = weatherData.current.condition.toLowerCase();
    const humidity = weatherData.current.humidity;

    if (language === "hi") {
      if (condition.includes("rain")) {
        return "बारिश के कारण खेत में काम न करें। फसल को ढकें।";
      } else if (temp > 35) {
        return "बहुत गर्मी है। सुबह या शाम को काम करें।";
      } else if (humidity > 80) {
        return "नमी अधिक है। फंगल रोगों से सावधान रहें।";
      } else {
        return "खेती के लिए अच्छा दिन है।";
      }
    } else {
      if (condition.includes("rain")) {
        return "Avoid field work today due to rain. Cover crops.";
      } else if (temp > 35) {
        return "Very hot today. Work in early morning/evening.";
      } else if (humidity > 80) {
        return "High humidity. Watch for fungal diseases.";
      } else {
        return "Good day for farming.";
      }
    }
  };

  const styles = getStyles(colors);

  if (loading || !weatherData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text.primary, marginTop: 8 }}>
          {language === "hi" ? "मौसम लोड हो रहा है..." : "Loading weather..."}
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>
          {language === "hi" ? "मौसम पूर्वानुमान" : "Weather Forecast"}
        </Text>
      </View>

      {/* Current Weather */}
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.currentWeatherGradient}
      >
        <View style={styles.currentMain}>
          <Ionicons
            name="cloud"
            size={48}
            color={colors.surface}
            style={styles.currentIcon}
          />
          <View>
            <Text style={styles.temperature}>
              {weatherData.current.temperature}°C
            </Text>
            <Text style={styles.condition}>
              {weatherData.current.condition}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Forecast */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {weatherData.forecast.map((day, index) => (
          <View key={index} style={styles.forecastItem}>
            <Text style={styles.forecastDay}>{day.day}</Text>
            <Ionicons name="cloud" size={24} color={colors.primary} />
            <Text style={styles.forecastHigh}>{day.high}°</Text>
            <Text style={styles.forecastLow}>{day.low}°</Text>
            <Text style={styles.forecastPrecip}>{day.precipitation}%</Text>
          </View>
        ))}
      </ScrollView>

      {/* Advice */}
      <View style={styles.advice}>
        <Ionicons
          name="bulb"
          size={16}
          color={colors.warning}
          style={{ marginRight: spacing.xs }}
        />
        <Text style={styles.adviceText}>{getWeatherAdvice()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      margin: spacing.md,
      paddingBottom: spacing.lg,
      elevation: 4,
    },
    header: {
      padding: spacing.lg,
    },
    sectionTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    currentWeatherGradient: {
      borderRadius: borderRadius.md,
      marginHorizontal: spacing.lg,
      padding: spacing.lg,
    },
    currentMain: {
      flexDirection: "row",
      alignItems: "center",
    },
    currentIcon: {
      marginRight: spacing.md,
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
    forecastItem: {
      marginHorizontal: spacing.sm,
      alignItems: "center",
    },
    forecastDay: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    forecastHigh: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    forecastLow: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    forecastPrecip: {
      fontSize: fontSize.xs,
      color: colors.primary,
    },
    advice: {
      flexDirection: "row",
      alignItems: "center",
      margin: spacing.lg,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.background,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    adviceText: {
      fontSize: fontSize.sm,
      color: colors.text.primary,
      marginLeft: spacing.sm,
    },
    loadingContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.lg,
    },
  });

export default WeatherForecast;
