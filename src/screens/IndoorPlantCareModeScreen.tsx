import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface IndoorPlantCareModeScreenProps {
  navigation: any;
}

interface LightReading {
  level: number;
  timestamp: string;
  quality: 'excellent' | 'good' | 'moderate' | 'poor' | 'very poor';
  recommendation: string;
}

interface GrowLight {
  id: string;
  name: string;
  type: 'LED' | 'Fluorescent' | 'Full Spectrum';
  wattage: string;
  coverage: string;
  price: string;
  rating: number;
  features: string[];
  bestFor: string[];
}

interface PlantLightRequirement {
  name: string;
  icon: string;
  lightLevel: 'low' | 'medium' | 'high';
  minLux: number;
  maxLux: number;
  dailyHours: string;
  symptoms: {
    tooLittle: string[];
    tooMuch: string[];
  };
}

const { width, height } = Dimensions.get('window');

const IndoorPlantCareModeScreen: React.FC<IndoorPlantCareModeScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { translations } = useLanguage();

  const [selectedTab, setSelectedTab] = useState<'scanner' | 'plants' | 'lights' | 'tips'>('scanner');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [currentLightReading, setCurrentLightReading] = useState<LightReading | null>(null);
  const [lightHistory, setLightHistory] = useState<LightReading[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<PlantLightRequirement | null>(null);
  const [showPlantModal, setShowPlantModal] = useState(false);

  const tabs = [
    { key: 'scanner', label: 'Light Scanner', icon: 'flashlight' },
    { key: 'plants', label: 'Plant Guide', icon: 'leaf' },
    { key: 'lights', label: 'Grow Lights', icon: 'bulb' },
    { key: 'tips', label: 'Care Tips', icon: 'information-circle' },
  ];

  const plantRequirements: PlantLightRequirement[] = [
    {
      name: 'Snake Plant',
      icon: 'leaf',
      lightLevel: 'low',
      minLux: 200,
      maxLux: 2000,
      dailyHours: '6-8 hours',
      symptoms: {
        tooLittle: ['Slow growth', 'Pale color'],
        tooMuch: ['Yellow leaves', 'Brown spots'],
      },
    },
    {
      name: 'Pothos',
      icon: 'leaf',
      lightLevel: 'low',
      minLux: 300,
      maxLux: 2500,
      dailyHours: '6-10 hours',
      symptoms: {
        tooLittle: ['Leggy growth', 'Small leaves'],
        tooMuch: ['Scorched leaves', 'Wilting'],
      },
    },
    {
      name: 'Monstera',
      icon: 'leaf',
      lightLevel: 'medium',
      minLux: 1000,
      maxLux: 5000,
      dailyHours: '8-12 hours',
      symptoms: {
        tooLittle: ['No fenestrations', 'Dark green leaves'],
        tooMuch: ['Yellow patches', 'Crispy edges'],
      },
    },
    {
      name: 'Fiddle Leaf Fig',
      icon: '🌳',
      lightLevel: 'high',
      minLux: 2000,
      maxLux: 8000,
      dailyHours: '10-12 hours',
      symptoms: {
        tooLittle: ['Dropping leaves', 'Leaning toward light'],
        tooMuch: ['Brown spots', 'Bleached appearance'],
      },
    },
    {
      name: 'Succulents',
      icon: '🌵',
      lightLevel: 'high',
      minLux: 3000,
      maxLux: 10000,
      dailyHours: '12-14 hours',
      symptoms: {
        tooLittle: ['Stretching', 'Pale color'],
        tooMuch: ['Red/purple tinge', 'Shriveling'],
      },
    },
    {
      name: 'Peace Lily',
      icon: 'leaf',
      lightLevel: 'low',
      minLux: 500,
      maxLux: 3000,
      dailyHours: '6-8 hours',
      symptoms: {
        tooLittle: ['No flowers', 'Dark green leaves'],
        tooMuch: ['Yellow leaves', 'Brown tips'],
      },
    },
  ];

  const growLights: GrowLight[] = [
    {
      id: '1',
      name: 'Philips LED Grow Light',
      type: 'LED',
      wattage: '24W',
      coverage: '2x2 feet',
      price: '₹2,499',
      rating: 4.5,
      features: ['Full spectrum', 'Energy efficient', 'Long lasting'],
      bestFor: ['Herbs', 'Small plants', 'Seedlings'],
    },
    {
      id: '2',
      name: 'Spider Farmer SF-1000',
      type: 'Full Spectrum',
      wattage: '100W',
      coverage: '3x3 feet',
      price: '₹8,999',
      rating: 4.8,
      features: ['Samsung LEDs', 'Dimmable', 'Heat dissipation'],
      bestFor: ['Medium plants', 'Vegetables', 'Flowering plants'],
    },
    {
      id: '3',
      name: 'Barrina T5 Grow Lights',
      type: 'Fluorescent',
      wattage: '120W',
      coverage: '4x2 feet',
      price: '₹3,999',
      rating: 4.3,
      features: ['Easy installation', 'Linkable', 'Reflector included'],
      bestFor: ['Seedlings', 'Microgreens', 'Herbs'],
    },
    {
      id: '4',
      name: 'Mars Hydro TS 600',
      type: 'LED',
      wattage: '100W',
      coverage: '2x2 feet',
      price: '₹6,499',
      rating: 4.6,
      features: ['Samsung chips', 'Fanless design', 'Full spectrum'],
      bestFor: ['Small to medium plants', 'Indoor gardens'],
    },
  ];

  const careTips = [
    {
      title: 'Light Positioning',
      icon: 'locate',
      tips: [
        'Keep grow lights 12-18 inches above plants',
        'Adjust height as plants grow',
        'Use a timer for consistent lighting schedule',
        'Rotate plants weekly for even light exposure',
      ],
    },
    {
      title: 'Duration Guidelines',
      icon: 'time',
      tips: [
        'Low-light plants: 6-8 hours daily',
        'Medium-light plants: 8-12 hours daily',
        'High-light plants: 12-14 hours daily',
        'Give plants 6-8 hours of darkness',
      ],
    },
    {
      title: 'Energy Efficiency',
      icon: 'flash',
      tips: [
        'LED lights consume 80% less energy',
        'Use timers to avoid overuse',
        'Choose lights with high PAR values',
        'Consider dimmable options for flexibility',
      ],
    },
    {
      title: 'Plant Health Signs',
      icon: 'heart',
      tips: [
        'Healthy growth indicates proper lighting',
        'Yellowing may indicate too much light',
        'Stretching suggests insufficient light',
        'Monitor leaf color and growth rate',
      ],
    },
  ];

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const simulateLightReading = () => {
    setIsScanning(true);
    
    setTimeout(() => {
      // Simulate light sensor reading (in reality, this would use actual sensor data)
      const level = Math.floor(Math.random() * 10000) + 200;
      const quality = level < 500 ? 'very poor' :
                     level < 1500 ? 'poor' :
                     level < 3000 ? 'moderate' :
                     level < 6000 ? 'good' : 'excellent';
      
      const recommendation = level < 500 ? 'Consider grow lights for most plants' :
                           level < 1500 ? 'Suitable for low-light plants only' :
                           level < 3000 ? 'Good for low to medium-light plants' :
                           level < 6000 ? 'Excellent for most indoor plants' :
                           'Perfect for high-light plants';

      const newReading: LightReading = {
        level,
        timestamp: new Date().toLocaleTimeString(),
        quality,
        recommendation,
      };

      setCurrentLightReading(newReading);
      setLightHistory(prev => [newReading, ...prev.slice(0, 9)]);
      setIsScanning(false);
    }, 2000);
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return '#2ECC71';
      case 'good': return '#27AE60';
      case 'moderate': return '#F39C12';
      case 'poor': return '#E67E22';
      case 'very poor': return '#E74C3C';
      default: return colors.text.secondary;
    }
  };

  const getLightLevelColor = (level: string) => {
    switch (level) {
      case 'low': return '#3498DB';
      case 'medium': return '#F39C12';
      case 'high': return '#E74C3C';
      default: return colors.text.secondary;
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
    settingsButton: {
      padding: spacing.sm,
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
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      borderRadius: borderRadius.lg,
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    tabText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.text.secondary,
      marginTop: spacing.xs / 2,
      textAlign: 'center',
    },
    activeTabText: {
      color: colors.surface,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
    },
    scannerContainer: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    scannerTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    scanButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.lg,
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    scanButtonText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.surface,
      marginTop: spacing.sm,
    },
    scanningIndicator: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
    },
    scanningText: {
      fontSize: fontSize.md,
      color: colors.text.secondary,
      marginTop: spacing.md,
    },
    readingCard: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      marginBottom: spacing.lg,
    },
    readingHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    lightLevel: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    lightUnit: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    qualityBadge: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.sm,
    },
    qualityText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.surface,
      textTransform: 'uppercase',
    },
    recommendation: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      lineHeight: 20,
    },
    historyContainer: {
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
    historyTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    historyItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    historyLeft: {
      flex: 1,
    },
    historyLevel: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
    },
    historyTime: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
    },
    historyQuality: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      textTransform: 'uppercase',
    },
    plantGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    plantCard: {
      width: '48%',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    plantEmoji: {
      fontSize: 32,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    plantName: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.xs,
    },
    lightLevelBadge: {
      alignSelf: 'center',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
      borderRadius: borderRadius.sm,
      marginBottom: spacing.sm,
    },
    lightLevelText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.surface,
      textTransform: 'uppercase',
    },
    plantRequirement: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    growLightCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    lightHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    lightInfo: {
      flex: 1,
    },
    lightName: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.xs / 2,
    },
    lightSpecs: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs / 2,
    },
    lightPrice: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.primary,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.xs,
    },
    ratingText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
    },
    featuresContainer: {
      marginTop: spacing.sm,
    },
    featureTag: {
      backgroundColor: colors.background,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
      borderRadius: borderRadius.sm,
      marginRight: spacing.xs,
      marginBottom: spacing.xs,
    },
    featureText: {
      fontSize: fontSize.xs,
      color: colors.text.primary,
    },
    bestForContainer: {
      marginTop: spacing.sm,
    },
    bestForTitle: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    bestForText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    tipCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    tipHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    tipTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginLeft: spacing.md,
    },
    tipList: {
      marginLeft: spacing.md,
    },
    tipItem: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
      lineHeight: 20,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      width: width * 0.9,
      maxHeight: height * 0.8,
    },
    modalTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    requirementRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    requirementLabel: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    requirementValue: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
    },
    symptomsContainer: {
      marginTop: spacing.md,
    },
    symptomsTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    symptomCategory: {
      marginBottom: spacing.sm,
    },
    symptomCategoryTitle: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    symptomText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginLeft: spacing.md,
      marginBottom: spacing.xs / 2,
    },
    closeButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      alignItems: 'center',
      marginTop: spacing.lg,
    },
    closeButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.surface,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xl,
    },
    emptyStateText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      textAlign: 'center',
      marginTop: spacing.md,
    },
  });

  const styles = getStyles();

  const renderScannerTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.scannerContainer}>
        <Text style={styles.scannerTitle}>Light Level Scanner</Text>
        
        {!isScanning ? (
          <TouchableOpacity style={styles.scanButton} onPress={simulateLightReading}>
            <Ionicons name="flashlight" size={32} color={colors.surface} />
            <Text style={styles.scanButtonText}>Scan Light Level</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.scanningIndicator}>
            <Ionicons name="sync" size={32} color={colors.primary} />
            <Text style={styles.scanningText}>Analyzing light conditions...</Text>
          </View>
        )}

        {currentLightReading && (
          <View style={styles.readingCard}>
            <View style={styles.readingHeader}>
              <View>
                <Text style={styles.lightLevel}>
                  {currentLightReading.level} <Text style={styles.lightUnit}>lux</Text>
                </Text>
              </View>
              <View style={[styles.qualityBadge, { backgroundColor: getQualityColor(currentLightReading.quality) }]}>
                <Text style={styles.qualityText}>{currentLightReading.quality}</Text>
              </View>
            </View>
            <Text style={styles.recommendation}>{currentLightReading.recommendation}</Text>
          </View>
        )}
      </View>

      {lightHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Reading History</Text>
          {lightHistory.map((reading, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <Text style={styles.historyLevel}>{reading.level} lux</Text>
                <Text style={styles.historyTime}>{reading.timestamp}</Text>
              </View>
              <Text style={[styles.historyQuality, { color: getQualityColor(reading.quality) }]}>
                {reading.quality}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const renderPlantsTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.plantGrid}>
        {plantRequirements.map((plant, index) => (
          <TouchableOpacity
            key={index}
            style={styles.plantCard}
            onPress={() => {
              setSelectedPlant(plant);
              setShowPlantModal(true);
            }}
          >
            <Ionicons name={plant.icon as any} size={28} color={colors.primary} />
            <Text style={styles.plantName}>{plant.name}</Text>
            <View style={[styles.lightLevelBadge, { backgroundColor: getLightLevelColor(plant.lightLevel) }]}>
              <Text style={styles.lightLevelText}>{plant.lightLevel} light</Text>
            </View>
            <Text style={styles.plantRequirement}>
              {plant.minLux}-{plant.maxLux} lux
            </Text>
            <Text style={styles.plantRequirement}>{plant.dailyHours}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderLightsTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {growLights.map((light) => (
        <View key={light.id} style={styles.growLightCard}>
          <View style={styles.lightHeader}>
            <View style={styles.lightInfo}>
              <Text style={styles.lightName}>{light.name}</Text>
              <Text style={styles.lightSpecs}>
                {light.type} • {light.wattage} • {light.coverage}
              </Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#F39C12" />
                <Text style={styles.ratingText}>{light.rating}/5</Text>
              </View>
            </View>
            <Text style={styles.lightPrice}>{light.price}</Text>
          </View>

          <View style={styles.featuresContainer}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {light.features.map((feature, index) => (
                <View key={index} style={styles.featureTag}>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.bestForContainer}>
            <Text style={styles.bestForTitle}>Best for:</Text>
            <Text style={styles.bestForText}>{light.bestFor.join(', ')}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderTipsTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {careTips.map((tip, index) => (
        <View key={index} style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Ionicons name={tip.icon as any} size={24} color={colors.primary} />
            <Text style={styles.tipTitle}>{tip.title}</Text>
          </View>
          <View style={styles.tipList}>
            {tip.tips.map((tipItem, tipIndex) => (
              <Text key={tipIndex} style={styles.tipItem}>
                • {tipItem}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );

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
            <Text style={styles.headerTitle}>Indoor Plant Care</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings" size={24} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

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

      <View style={styles.content}>
        {selectedTab === 'scanner' && renderScannerTab()}
        {selectedTab === 'plants' && renderPlantsTab()}
        {selectedTab === 'lights' && renderLightsTab()}
        {selectedTab === 'tips' && renderTipsTab()}
      </View>

      {/* Plant Details Modal */}
      <Modal
        visible={showPlantModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPlantModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedPlant && (
              <>
                <Text style={styles.modalTitle}>
                  <Ionicons name={selectedPlant.icon as any} size={20} color={colors.primary} style={{ marginRight: spacing.sm }} />
                  <Text style={styles.plantName}>{selectedPlant.name}</Text>
                </Text>
                
                <View style={styles.requirementRow}>
                  <Text style={styles.requirementLabel}>Light Level:</Text>
                  <Text style={[styles.requirementValue, { color: getLightLevelColor(selectedPlant.lightLevel) }]}>
                    {selectedPlant.lightLevel.toUpperCase()}
                  </Text>
                </View>
                
                <View style={styles.requirementRow}>
                  <Text style={styles.requirementLabel}>Light Range:</Text>
                  <Text style={styles.requirementValue}>
                    {selectedPlant.minLux}-{selectedPlant.maxLux} lux
                  </Text>
                </View>
                
                <View style={styles.requirementRow}>
                  <Text style={styles.requirementLabel}>Daily Duration:</Text>
                  <Text style={styles.requirementValue}>{selectedPlant.dailyHours}</Text>
                </View>

                <View style={styles.symptomsContainer}>
                  <Text style={styles.symptomsTitle}>Warning Signs</Text>
                  
                  <View style={styles.symptomCategory}>
                    <Text style={styles.symptomCategoryTitle}>Too Little Light:</Text>
                    {selectedPlant.symptoms.tooLittle.map((symptom, index) => (
                      <Text key={index} style={styles.symptomText}>• {symptom}</Text>
                    ))}
                  </View>
                  
                  <View style={styles.symptomCategory}>
                    <Text style={styles.symptomCategoryTitle}>Too Much Light:</Text>
                    {selectedPlant.symptoms.tooMuch.map((symptom, index) => (
                      <Text key={index} style={styles.symptomText}>• {symptom}</Text>
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowPlantModal(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default IndoorPlantCareModeScreen;
