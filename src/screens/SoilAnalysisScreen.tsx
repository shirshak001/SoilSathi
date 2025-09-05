import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import CustomButton from '../components/CustomButton';

interface SoilAnalysisScreenProps {
  navigation: any;
}

interface SoilData {
  Nitrogen: number;
  Phosphorus: number;
  Potassium: number;
  moisture: number;
  pH: number;
  temperature: number;
  lastUpdated: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string; // URL of product image
}

interface Recommendation {
  id: string;
  type: 'fertilizer' | 'water' | 'ph' | 'general';
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  products?: Product[];
}

const { width } = Dimensions.get('window');
const cardWidth = (width - spacing.lg * 3) / 2;

const SoilAnalysisScreen: React.FC<SoilAnalysisScreenProps> = ({ navigation }) => {
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isRecLoading, setIsRecLoading] = useState(false);

  // Fetch soil sensor data
  useEffect(() => {
    const fetchSoilData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;
        setIsLoading(true);

        const userRes = await axios.get(
          'https://soilsathi-backend.onrender.com/api/v1/gardener/protected',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const deviceId = userRes.data.user.deviceId;

        const sensorRes = await axios.get(
          `https://soilsathi-backend.onrender.com/api/v1/sensor/getData/${deviceId}`
        );

        setSoilData(sensorRes.data.data);
      } catch (err) {
        console.error('Error fetching soil data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSoilData();
    const interval = setInterval(fetchSoilData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!soilData) return;
      setIsRecLoading(true);
      try {
        const payload = {
          N: soilData.Nitrogen,
          P: soilData.Phosphorus,
          K: soilData.Potassium,
          pH: soilData.pH,
          moisture: soilData.moisture,
          temperature: soilData.temperature,
        };

        const res = await axios.post(
          'http://192.168.113.210:8000/analyze',
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        );

        setRecommendations(res.data.recommendations || []);
      } catch (err) {
        console.error('Recommendation API error:', err);
        setRecommendations([]);
      } finally {
        setIsRecLoading(false);
      }
    };

    fetchRecommendations();
  }, [soilData]);

  const getStatusColor = (value: number, optimal: [number, number]) => {
    if (value >= optimal[0] && value <= optimal[1]) return colors.success;
    if (value < optimal[0] * 0.7 || value > optimal[1] * 1.3) return colors.error;
    return colors.warning;
  };

  const getStatusText = (value: number, optimal: [number, number]) => {
    if (value >= optimal[0] && value <= optimal[1]) return 'Optimal';
    if (value < optimal[0]) return 'Low';
    if (value > optimal[1]) return 'High';
    return 'Moderate';
  };

  const renderSoilParameter = (
    title: string,
    value: number,
    unit: string,
    icon: string,
    optimal: [number, number]
  ) => {
    const status = getStatusText(value, optimal);
    const statusColor = getStatusColor(value, optimal);

    return (
      <View style={styles.parameterCard} key={title}>
        <View style={[styles.parameterIcon, { backgroundColor: statusColor }]}>
          <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={20} color={colors.surface} />
        </View>
        <Text style={styles.parameterTitle}>{title}</Text>
        <Text style={styles.parameterValue}>
          {value}
          {unit}
        </Text>
        <Text style={[styles.parameterStatus, { color: statusColor }]}>{status}</Text>
      </View>
    );
  };

  const renderRecommendation = (rec: Recommendation) => {
    const urgencyColor =
      rec.urgency === 'high' ? colors.error : rec.urgency === 'medium' ? colors.warning : colors.success;

    return (
      <View key={rec.id} style={styles.recommendationCard}>
        <View style={styles.recommendationHeader}>
          <View style={[styles.urgencyBadge, { backgroundColor: urgencyColor }]}>
            <Text style={styles.urgencyText}>{rec.urgency.toUpperCase()}</Text>
          </View>
          <Ionicons
            name={rec.type === 'water' ? 'water' : rec.type === 'fertilizer' ? 'leaf' : 'information-circle'}
            size={20}
            color={colors.primary}
          />
        </View>
        <Text style={styles.recommendationTitle}>{rec.title}</Text>
        <Text style={styles.recommendationDescription}>{rec.description}</Text>

        {rec.products && rec.products.length > 0 && (
          <View style={styles.productSection}>
            <Text style={styles.productSectionTitle}>Recommended Products:</Text>
            {rec.products.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                onPress={() => navigation.navigate('ProductStore', { productId: product.id })}
              >
                <Image source={{ uri: product.image }} style={{ width: 40, height: 40, borderRadius: 6 }} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productDescription}>{product.description}</Text>
                  <Text style={styles.productPrice}>₹{product.price}</Text>
                </View>
                <Ionicons name="bag-add" size={20} color={colors.primary} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <LinearGradient colors={[colors.primaryLight, colors.primary]} style={styles.headerGradient}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={colors.surface} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Soil Analysis</Text>
            <View style={styles.placeholder} />
          </View>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: spacing.md, fontSize: fontSize.md, color: colors.text.secondary }}>
            Reading sensor data...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <LinearGradient colors={[colors.primaryLight, colors.primary]} style={styles.headerGradient}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Soil Analysis</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Soil Conditions</Text>
          <Text style={styles.lastUpdated}>Last updated: {soilData?.lastUpdated}</Text>
        </View>

        <View style={styles.parametersGrid}>
          {renderSoilParameter('Nitrogen (N)', soilData?.Nitrogen || 0, '%', 'leaf', [60, 80])}
          {renderSoilParameter('Phosphorus (P)', soilData?.Phosphorus || 0, '%', 'flower', [50, 70])}
          {renderSoilParameter('Potassium (K)', soilData?.Potassium || 0, '%', 'nutrition', [50, 70])}
          {renderSoilParameter('Soil Moisture', soilData?.moisture || 0, '%', 'water', [40, 60])}
          {renderSoilParameter('pH Level', soilData?.pH || 0, '', 'flask', [6, 7.5])}
          {renderSoilParameter('Temperature', soilData?.temperature || 0, '°C', 'thermometer', [20, 30])}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Smart Recommendations</Text>
          <Text style={styles.sectionSubtitle}>Based on your soil analysis, here's what your plants need</Text>
        </View>

        <View style={styles.recommendationsContainer}>
          {isRecLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : recommendations.length === 0 ? (
            <Text style={{ color: colors.text.secondary, fontSize: fontSize.sm }}>No recommendations yet.</Text>
          ) : (
            recommendations.map(renderRecommendation)
          )}
        </View>

        <View style={styles.actionButtons}>
          <CustomButton title="View Plant Store" variant="primary" onPress={() => navigation.navigate('ProductStore')} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerGradient: { paddingTop: StatusBar.currentHeight || spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.lg, paddingHorizontal: spacing.lg },
  backButton: { padding: spacing.sm },
  headerTitle: { flex: 1, fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.surface, textAlign: 'center' },
  placeholder: { width: spacing.xl + spacing.md },
  content: { flex: 1 },
  section: { padding: spacing.lg },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text.primary, marginBottom: spacing.xs },
  sectionSubtitle: { fontSize: fontSize.md, color: colors.text.secondary, lineHeight: 22 },
  lastUpdated: { fontSize: fontSize.sm, color: colors.text.hint },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  parametersGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.lg, gap: spacing.md },
  parameterCard: { width: cardWidth, backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center', marginBottom: spacing.md },
  parameterIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  parameterTitle: { fontSize: fontSize.sm, color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.xs },
  parameterValue: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text.primary, marginBottom: spacing.xs },
  parameterStatus: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold },
  recommendationsContainer: { paddingHorizontal: spacing.lg, gap: spacing.md },
  recommendationCard: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.md },
  recommendationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  urgencyBadge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs / 2, borderRadius: borderRadius.sm },
  urgencyText: { fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: colors.surface },
  recommendationTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text.primary, marginBottom: spacing.xs },
  recommendationDescription: { fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 20, marginBottom: spacing.sm },
  productSection: { marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  productSectionTitle: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.text.primary, marginBottom: spacing.sm },
  productCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderRadius: borderRadius.sm, padding: spacing.sm, marginBottom: spacing.xs },
  productInfo: { flex: 1, marginLeft: spacing.sm },
  productName: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.text.primary },
  productDescription: { fontSize: fontSize.xs, color: colors.text.secondary, marginTop: spacing.xs / 2 },
  productPrice: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.primary, marginTop: spacing.xs / 2 },
  actionButtons: { padding: spacing.lg, gap: spacing.md },
});

export default SoilAnalysisScreen;
