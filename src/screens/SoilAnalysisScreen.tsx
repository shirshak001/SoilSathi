import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import CustomButton from '../components/CustomButton';

interface SoilAnalysisScreenProps {
  navigation: any;
}

interface SoilData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture: number;
  ph: number;
  temperature: number;
  lastUpdated: string;
}

interface Recommendation {
  id: string;
  type: 'fertilizer' | 'water' | 'ph' | 'general';
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  products?: Product[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - spacing.lg * 3) / 2;

const SoilAnalysisScreen: React.FC<SoilAnalysisScreenProps> = ({ navigation }) => {
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Simulated soil sensor data
  useEffect(() => {
    const fetchSoilData = () => {
      setTimeout(() => {
        setSoilData({
          nitrogen: 65,
          phosphorus: 45,
          potassium: 55,
          moisture: 32,
          ph: 6.8,
          temperature: 24,
          lastUpdated: new Date().toLocaleString(),
        });
        setIsLoading(false);
      }, 2000);
    };

    fetchSoilData();
  }, []);

  const recommendations: Recommendation[] = [
    {
      id: '1',
      type: 'water',
      title: 'Low Soil Moisture',
      description: 'Your soil moisture is at 32%. Water your plants immediately for better growth.',
      urgency: 'high',
    },
    {
      id: '2',
      type: 'fertilizer',
      title: 'Phosphorus Deficiency',
      description: 'Phosphorus levels are low (45%). Add phosphorus-rich fertilizer to promote root development.',
      urgency: 'medium',
      products: [
        {
          id: '1',
          name: 'Bone Meal Organic Fertilizer',
          price: 299,
          description: 'High phosphorus organic fertilizer for better root growth',
          image: 'leaf'
        }
      ]
    },
    {
      id: '3',
      type: 'general',
      title: 'Optimal pH Level',
      description: 'Your soil pH (6.8) is perfect for most plants. Keep maintaining this level.',
      urgency: 'low',
    }
  ];

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
      <View style={styles.parameterCard}>
        <View style={[styles.parameterIcon, { backgroundColor: statusColor }]}>
          <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={20} color={colors.surface} />
        </View>
        <Text style={styles.parameterTitle}>{title}</Text>
        <Text style={styles.parameterValue}>{value}{unit}</Text>
        <Text style={[styles.parameterStatus, { color: statusColor }]}>{status}</Text>
      </View>
    );
  };

  const renderRecommendation = (rec: Recommendation) => {
    const urgencyColor = rec.urgency === 'high' ? colors.error : 
                        rec.urgency === 'medium' ? colors.warning : colors.success;
    
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
            {rec.products.map(product => (
              <TouchableOpacity 
                key={product.id} 
                style={styles.productCard}
                onPress={() => navigation.navigate('ProductStore', { productId: product.id })}
              >
                <Ionicons name={product.image as keyof typeof Ionicons.glyphMap} size={24} color={colors.primary} />
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
            <Text style={styles.headerTitle}>Soil Analysis</Text>
            <View style={styles.placeholder} />
          </View>
        </LinearGradient>

        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <Ionicons name="analytics" size={64} color={colors.primary} />
            <Text style={styles.loadingTitle}>Analyzing Soil Data</Text>
            <Text style={styles.loadingSubtitle}>
              Reading sensor data from your garden...
            </Text>
            <View style={styles.loadingProgress}>
              <View style={styles.progressBar} />
            </View>
          </View>
        </View>
      </View>
    );
  }

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
          <Text style={styles.headerTitle}>Soil Analysis</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 2000);
            }}
          >
            <Ionicons name="refresh" size={24} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Soil Conditions</Text>
          <Text style={styles.lastUpdated}>Last updated: {soilData?.lastUpdated}</Text>
        </View>

        <View style={styles.parametersGrid}>
          {renderSoilParameter('Nitrogen (N)', soilData?.nitrogen || 0, '%', 'leaf', [60, 80])}
          {renderSoilParameter('Phosphorus (P)', soilData?.phosphorus || 0, '%', 'flower', [50, 70])}
          {renderSoilParameter('Potassium (K)', soilData?.potassium || 0, '%', 'nutrition', [50, 70])}
          {renderSoilParameter('Moisture', soilData?.moisture || 0, '%', 'water', [40, 60])}
          {renderSoilParameter('pH Level', soilData?.ph || 0, '', 'flask', [6.0, 7.5])}
          {renderSoilParameter('Temperature', soilData?.temperature || 0, '°C', 'thermometer', [20, 30])}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Smart Recommendations</Text>
          <Text style={styles.sectionSubtitle}>
            Based on your soil analysis, here's what your plants need
          </Text>
        </View>

        <View style={styles.recommendationsContainer}>
          {recommendations.map(renderRecommendation)}
        </View>

        <View style={styles.actionButtons}>
          <CustomButton
            title="View Plant Store"
            variant="primary"
            onPress={() => navigation.navigate('ProductStore')}
            style={styles.actionButton}
          />
          
          <CustomButton
            title="Set Reminders"
            variant="outline"
            onPress={() => setShowRecommendations(true)}
            style={styles.actionButton}
          />
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
    paddingTop: StatusBar.currentHeight || spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.surface,
    textAlign: 'center',
  },
  refreshButton: {
    padding: spacing.sm,
  },
  placeholder: {
    width: spacing.xl + spacing.md,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  lastUpdated: {
    fontSize: fontSize.sm,
    color: colors.text.hint,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  loadingCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  loadingTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  loadingSubtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  loadingProgress: {
    width: 200,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    width: '70%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  parametersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  parameterCard: {
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
  parameterIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  parameterTitle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  parameterValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  parameterStatus: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  recommendationsContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  recommendationCard: {
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
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  urgencyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
  urgencyText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  recommendationTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  recommendationDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  productSection: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  productSectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  productInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  productName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  productDescription: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs / 2,
  },
  productPrice: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginTop: spacing.xs / 2,
  },
  actionButtons: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  actionButton: {
    width: '100%',
  },
});

export default SoilAnalysisScreen;
