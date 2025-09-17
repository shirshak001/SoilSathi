import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  ImageBackground,
  Image,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface SpectralHealthMapsScreenProps {
  navigation: any;
}

interface FieldMap {
  id: string;
  name: string;
  area: string;
  lastUpdated: string;
  ndvi: number;
  evi: number;
  riskLevel: 'high' | 'medium' | 'low';
  riskAreas: number;
  mapImage: any; // In a real app, this would be a proper image source
  description: string;
}

interface RiskZone {
  id: string;
  name: string;
  location: string;
  riskType: 'drought' | 'pest' | 'disease' | 'nutrient';
  riskLevel: 'high' | 'medium' | 'low';
  area: string;
  detectedOn: string;
  description: string;
  recommendation: string;
}

const { width } = Dimensions.get('window');

const mockFieldMapImages = [
  require('../../assets/icon.png'),
  require('../../assets/icon.png'),
  require('../../assets/icon.png'),
  require('../../assets/icon.png'),
];

const SpectralHealthMapsScreen: React.FC<SpectralHealthMapsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { translations } = useLanguage();

  const [activeTab, setActiveTab] = useState<'maps' | 'risks'>('maps');
  const [selectedField, setSelectedField] = useState<FieldMap | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<RiskZone | null>(null);
  const [fieldDetailVisible, setFieldDetailVisible] = useState<boolean>(false);
  const [riskDetailVisible, setRiskDetailVisible] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Mock data for field maps
  const fieldMaps: FieldMap[] = [
    {
      id: '1',
      name: 'North Rice Field',
      area: '24.5 hectares',
      lastUpdated: '1 day ago',
      ndvi: 0.78,
      evi: 0.65,
      riskLevel: 'low',
      riskAreas: 0,
      mapImage: mockFieldMapImages[0],
      description: 'Rice paddy field with consistently high NDVI values indicating good crop health. No significant stress areas detected.',
    },
    {
      id: '2',
      name: 'West Wheat Field',
      area: '36.2 hectares',
      lastUpdated: '3 days ago',
      ndvi: 0.56,
      evi: 0.48,
      riskLevel: 'medium',
      riskAreas: 2,
      mapImage: mockFieldMapImages[1],
      description: 'Wheat field showing moderate stress patterns in the southwestern corner, likely due to irrigation issues. Two medium-risk zones identified.',
    },
    {
      id: '3',
      name: 'East Maize Field',
      area: '18.7 hectares',
      lastUpdated: '2 days ago',
      ndvi: 0.32,
      evi: 0.28,
      riskLevel: 'high',
      riskAreas: 4,
      mapImage: mockFieldMapImages[2],
      description: 'Maize field exhibiting significant stress patterns across multiple zones. NDVI values are critically low in the eastern section. Four high-risk zones identified.',
    },
    {
      id: '4',
      name: 'South Soybean Field',
      area: '15.3 hectares',
      lastUpdated: '12 hours ago',
      ndvi: 0.67,
      evi: 0.59,
      riskLevel: 'medium',
      riskAreas: 1,
      mapImage: mockFieldMapImages[3],
      description: 'Soybean field with generally good health indices but showing a small area of stress in the southeastern corner. One medium-risk zone identified.',
    },
  ];

  // Mock data for risk zones
  const riskZones: RiskZone[] = [
    {
      id: '1',
      name: 'East Maize Field - Zone A',
      location: 'Eastern boundary',
      riskType: 'drought',
      riskLevel: 'high',
      area: '2.3 hectares',
      detectedOn: '2025-09-12',
      description: 'Severe drought stress detected with critically low NDVI values (0.21-0.28) and high land surface temperature. Soil moisture sensors confirm deficit.',
      recommendation: 'Immediate irrigation required. Consider installing drip irrigation system in this zone for long-term management. Monitor response with follow-up scan in 3 days.',
    },
    {
      id: '2',
      name: 'East Maize Field - Zone B',
      location: 'Northern section',
      riskType: 'nutrient',
      riskLevel: 'high',
      area: '1.8 hectares',
      detectedOn: '2025-09-12',
      description: 'Spectral signatures indicate severe nitrogen deficiency with chlorophyll absorption anomalies. Leaf yellowing visible in RGB imagery.',
      recommendation: 'Apply foliar nitrogen spray at 2% concentration immediately. Follow with soil application of slow-release nitrogen fertilizer at 45 kg/ha within 48 hours.',
    },
    {
      id: '3',
      name: 'West Wheat Field - Zone A',
      location: 'Southwestern corner',
      riskType: 'pest',
      riskLevel: 'medium',
      area: '1.2 hectares',
      detectedOn: '2025-09-10',
      description: 'Spectral patterns consistent with aphid infestation. Disrupted canopy structure and stress signatures visible in multispectral imagery.',
      recommendation: 'Deploy predatory insects (ladybugs) as biological control. If infestation continues, consider targeted application of neem-based insecticide.',
    },
    {
      id: '4',
      name: 'South Soybean Field - Zone A',
      location: 'Southeastern edge',
      riskType: 'disease',
      riskLevel: 'medium',
      area: '0.8 hectares',
      detectedOn: '2025-09-14',
      description: 'Multispectral signatures indicate potential fungal disease onset. Pattern analysis suggests early stage powdery mildew infection.',
      recommendation: 'Apply preventative fungicide treatment immediately. Improve air circulation by adjusting plant spacing in future plantings. Monitor for spread to adjacent areas.',
    },
    {
      id: '5',
      name: 'East Maize Field - Zone C',
      location: 'Central area',
      riskType: 'pest',
      riskLevel: 'high',
      area: '2.1 hectares',
      detectedOn: '2025-09-12',
      description: 'Stem borer infestation detected through canopy texture anomalies and specific reflectance patterns in near-infrared bands.',
      recommendation: 'Immediate application of recommended insecticide. Follow integrated pest management protocols with pheromone traps for monitoring.',
    },
    {
      id: '6',
      name: 'East Maize Field - Zone D',
      location: 'Western section',
      riskType: 'disease',
      riskLevel: 'high',
      area: '1.6 hectares',
      detectedOn: '2025-09-12',
      description: 'Spectral indices suggest corn leaf blight development. Patterns match historical disease progression signatures from reference database.',
      recommendation: 'Apply fungicide treatment as per recommended dosage. Consider resistant varieties for next planting season. Implement crop rotation plan.',
    },
    {
      id: '7',
      name: 'West Wheat Field - Zone B',
      location: 'Eastern boundary',
      riskType: 'nutrient',
      riskLevel: 'medium',
      area: '1.5 hectares',
      detectedOn: '2025-09-10',
      description: 'Potassium deficiency indicated by spectral reflectance patterns and confirmed with correlation to soil test results.',
      recommendation: 'Apply potassium sulfate at 30 kg/ha. Follow up with foliar application after 10 days if symptoms persist. Adjust fertilization program for next season.',
    },
  ];

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return '#D32F2F';
      case 'medium':
        return '#F57C00';
      case 'low':
        return '#388E3C';
      default:
        return colors.text.secondary;
    }
  };

  const getRiskTypeColor = (type: string) => {
    switch (type) {
      case 'drought':
        return '#FF9800';
      case 'pest':
        return '#7B1FA2';
      case 'disease':
        return '#D32F2F';
      case 'nutrient':
        return '#0288D1';
      default:
        return colors.primary;
    }
  };

  const getNDVIColor = (value: number) => {
    if (value >= 0.7) return '#1B5E20';
    if (value >= 0.5) return '#4CAF50';
    if (value >= 0.3) return '#FFC107';
    return '#F44336';
  };

  const handleFieldPress = (field: FieldMap) => {
    setSelectedField(field);
    setFieldDetailVisible(true);
  };

  const handleRiskPress = (risk: RiskZone) => {
    setSelectedRisk(risk);
    setRiskDetailVisible(true);
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
    content: {
      flex: 1,
      padding: spacing.lg,
    },
    tabsContainer: {
      flexDirection: 'row',
      marginBottom: spacing.lg,
      borderRadius: borderRadius.md,
      backgroundColor: colors.surface,
      padding: spacing.xs,
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      borderRadius: borderRadius.sm,
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    tabText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.secondary,
    },
    activeTabText: {
      color: colors.surface,
    },
    sectionTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    fieldCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      marginBottom: spacing.lg,
      overflow: 'hidden',
      elevation: 3,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    fieldImageContainer: {
      height: 160,
      overflow: 'hidden',
    },
    fieldImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    fieldOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.1)',
      padding: spacing.md,
    },
    fieldRiskBadge: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    fieldRiskText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.surface,
      marginLeft: spacing.xs,
    },
    fieldName: {
      position: 'absolute',
      bottom: spacing.md,
      left: spacing.md,
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.surface,
      textShadowColor: 'rgba(0,0,0,0.75)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    fieldContent: {
      padding: spacing.md,
    },
    fieldMetrics: {
      flexDirection: 'row',
      marginBottom: spacing.md,
    },
    fieldMetric: {
      flex: 1,
      alignItems: 'center',
      padding: spacing.sm,
      borderRadius: borderRadius.sm,
      backgroundColor: colors.background,
      marginHorizontal: spacing.xs,
    },
    fieldMetricValue: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
    },
    fieldMetricLabel: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      marginTop: spacing.xs,
    },
    fieldFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    fieldInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    fieldInfoText: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
    },
    viewDetailsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '20',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    viewDetailsText: {
      fontSize: fontSize.xs,
      color: colors.primary,
      marginRight: spacing.xs,
    },
    riskCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderLeftWidth: 4,
    },
    riskHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    riskTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      flex: 1,
      marginRight: spacing.sm,
    },
    riskMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    riskTypeBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      marginRight: spacing.sm,
    },
    riskTypeText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.surface,
    },
    riskLocation: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.md,
    },
    riskStats: {
      flexDirection: 'row',
      marginBottom: spacing.md,
    },
    riskStat: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    riskStatText: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: width * 0.9,
      maxHeight: width * 1.5,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
    },
    modalScrollView: {
      flexGrow: 1,
    },
    modalHeader: {
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    modalSubtitle: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    modalImage: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
    },
    modalBody: {
      padding: spacing.lg,
    },
    modalSectionTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    modalText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.md,
      lineHeight: 20,
    },
    modalMetricsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: spacing.md,
    },
    modalMetric: {
      width: '50%',
      padding: spacing.sm,
    },
    modalMetricLabel: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
    },
    modalMetricValue: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    modalFooter: {
      padding: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      alignItems: 'flex-end',
    },
    modalCloseButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.sm,
    },
    modalCloseText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.surface,
    },
    recommendationContainer: {
      backgroundColor: colors.primary + '10',
      padding: spacing.md,
      borderRadius: borderRadius.sm,
      marginBottom: spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    recommendationTitle: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    recommendationText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      lineHeight: 20,
    },
    alertButton: {
      position: 'absolute',
      bottom: spacing.xl,
      right: spacing.xl,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    alertBadge: {
      position: 'absolute',
      top: 0,
      right: 0,
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: '#D32F2F',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 4,
    },
    alertBadgeText: {
      fontSize: 10,
      fontWeight: fontWeight.bold,
      color: colors.surface,
    },
  });

  const styles = getStyles();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primary + '80']}
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
            <Text style={styles.headerTitle}>Spectral Health Maps</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'maps' && styles.activeTab]}
            onPress={() => setActiveTab('maps')}
          >
            <Text style={[styles.tabText, activeTab === 'maps' && styles.activeTabText]}>
              Field Maps
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'risks' && styles.activeTab]}
            onPress={() => setActiveTab('risks')}
          >
            <Text style={[styles.tabText, activeTab === 'risks' && styles.activeTabText]}>
              Risk Zones
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing.xl * 2 }}
        >
          {activeTab === 'maps' && (
            <>
              <Text style={styles.sectionTitle}>Health Map Overview</Text>

              {fieldMaps.map((field) => (
                <View key={field.id} style={styles.fieldCard}>
                  <View style={styles.fieldImageContainer}>
                    <Image source={field.mapImage} style={styles.fieldImage} />
                    <View style={styles.fieldOverlay}>
                      <View
                        style={[
                          styles.fieldRiskBadge,
                          { borderColor: getRiskLevelColor(field.riskLevel) },
                        ]}
                      >
                        <Ionicons
                          name={
                            field.riskLevel === 'high'
                              ? 'warning'
                              : field.riskLevel === 'medium'
                              ? 'alert-circle'
                              : 'checkmark-circle'
                          }
                          size={12}
                          color={getRiskLevelColor(field.riskLevel)}
                        />
                        <Text style={styles.fieldRiskText}>
                          {field.riskLevel.toUpperCase()} RISK
                        </Text>
                      </View>
                      <Text style={styles.fieldName}>{field.name}</Text>
                    </View>
                  </View>

                  <View style={styles.fieldContent}>
                    <View style={styles.fieldMetrics}>
                      <View style={styles.fieldMetric}>
                        <Text
                          style={[
                            styles.fieldMetricValue,
                            { color: getNDVIColor(field.ndvi) },
                          ]}
                        >
                          {field.ndvi.toFixed(2)}
                        </Text>
                        <Text style={styles.fieldMetricLabel}>NDVI</Text>
                      </View>
                      <View style={styles.fieldMetric}>
                        <Text
                          style={[
                            styles.fieldMetricValue,
                            { color: getNDVIColor(field.evi) },
                          ]}
                        >
                          {field.evi.toFixed(2)}
                        </Text>
                        <Text style={styles.fieldMetricLabel}>EVI</Text>
                      </View>
                      <View style={styles.fieldMetric}>
                        <Text
                          style={[
                            styles.fieldMetricValue,
                            {
                              color:
                                field.riskAreas > 0
                                  ? getRiskLevelColor(field.riskLevel)
                                  : getNDVIColor(0.8),
                            },
                          ]}
                        >
                          {field.riskAreas}
                        </Text>
                        <Text style={styles.fieldMetricLabel}>Risk Areas</Text>
                      </View>
                    </View>

                    <View style={styles.fieldFooter}>
                      <View style={styles.fieldInfo}>
                        <Ionicons name="resize" size={12} color={colors.text.secondary} />
                        <Text style={styles.fieldInfoText}>{field.area}</Text>
                      </View>
                      <View style={styles.fieldInfo}>
                        <Ionicons name="time" size={12} color={colors.text.secondary} />
                        <Text style={styles.fieldInfoText}>{field.lastUpdated}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.viewDetailsButton}
                        onPress={() => handleFieldPress(field)}
                      >
                        <Text style={styles.viewDetailsText}>Details</Text>
                        <Ionicons name="chevron-forward" size={12} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}

          {activeTab === 'risks' && (
            <>
              <Text style={styles.sectionTitle}>Identified Risk Zones</Text>

              {riskZones.map((risk) => (
                <TouchableOpacity
                  key={risk.id}
                  style={[
                    styles.riskCard,
                    { borderLeftColor: getRiskLevelColor(risk.riskLevel) },
                  ]}
                  onPress={() => handleRiskPress(risk)}
                >
                  <View style={styles.riskHeader}>
                    <Text style={styles.riskTitle}>{risk.name}</Text>
                    <View style={styles.riskMeta}>
                      <View
                        style={[
                          styles.riskTypeBadge,
                          { backgroundColor: getRiskTypeColor(risk.riskType) },
                        ]}
                      >
                        <Text style={styles.riskTypeText}>
                          {risk.riskType.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.riskLocation}>
                    <Ionicons name="location" size={12} color={colors.text.secondary} />{' '}
                    {risk.location}
                  </Text>

                  <View style={styles.riskStats}>
                    <View style={styles.riskStat}>
                      <Ionicons name="warning" size={14} color={getRiskLevelColor(risk.riskLevel)} />
                      <Text style={styles.riskStatText}>
                        {risk.riskLevel.toUpperCase()} RISK
                      </Text>
                    </View>
                    <View style={styles.riskStat}>
                      <Ionicons name="resize" size={14} color={colors.text.secondary} />
                      <Text style={styles.riskStatText}>{risk.area}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}
        </ScrollView>

        {/* Floating alert button with badge */}
        <TouchableOpacity
          style={styles.alertButton}
          onPress={() => {
            // Filter high risk zones
            const highRiskZones = riskZones.filter((zone) => zone.riskLevel === 'high');
            
            if (highRiskZones.length > 0) {
              // Set active tab to risks
              setActiveTab('risks');
              
              // Set first high risk as selected
              setSelectedRisk(highRiskZones[0]);
              setRiskDetailVisible(true);
            } else {
              Alert.alert('No Alerts', 'There are no high-risk alerts at this time.');
            }
          }}
        >
          <Ionicons name="notifications" size={28} color={colors.surface} />
          <View style={styles.alertBadge}>
            <Text style={styles.alertBadgeText}>
              {riskZones.filter((zone) => zone.riskLevel === 'high').length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Field Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={fieldDetailVisible}
        onRequestClose={() => setFieldDetailVisible(false)}
      >
        {selectedField && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView
                style={styles.modalScrollView}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                <Image source={selectedField.mapImage} style={styles.modalImage} />
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedField.name}</Text>
                  <Text style={styles.modalSubtitle}>{selectedField.area}</Text>
                </View>
                <View style={styles.modalBody}>
                  <Text style={styles.modalSectionTitle}>Field Overview</Text>
                  <Text style={styles.modalText}>{selectedField.description}</Text>

                  <Text style={styles.modalSectionTitle}>Health Metrics</Text>
                  <View style={styles.modalMetricsContainer}>
                    <View style={styles.modalMetric}>
                      <Text style={styles.modalMetricLabel}>NDVI Index</Text>
                      <Text
                        style={[
                          styles.modalMetricValue,
                          { color: getNDVIColor(selectedField.ndvi) },
                        ]}
                      >
                        {selectedField.ndvi.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.modalMetric}>
                      <Text style={styles.modalMetricLabel}>EVI Index</Text>
                      <Text
                        style={[
                          styles.modalMetricValue,
                          { color: getNDVIColor(selectedField.evi) },
                        ]}
                      >
                        {selectedField.evi.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.modalMetric}>
                      <Text style={styles.modalMetricLabel}>Risk Level</Text>
                      <Text
                        style={[
                          styles.modalMetricValue,
                          { color: getRiskLevelColor(selectedField.riskLevel) },
                        ]}
                      >
                        {selectedField.riskLevel.toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.modalMetric}>
                      <Text style={styles.modalMetricLabel}>Risk Areas</Text>
                      <Text
                        style={[
                          styles.modalMetricValue,
                          {
                            color:
                              selectedField.riskAreas > 0
                                ? getRiskLevelColor(selectedField.riskLevel)
                                : getNDVIColor(0.8),
                          },
                        ]}
                      >
                        {selectedField.riskAreas}
                      </Text>
                    </View>
                    <View style={styles.modalMetric}>
                      <Text style={styles.modalMetricLabel}>Last Updated</Text>
                      <Text style={styles.modalMetricValue}>{selectedField.lastUpdated}</Text>
                    </View>
                  </View>

                  {selectedField.riskAreas > 0 && (
                    <View style={styles.recommendationContainer}>
                      <Text style={styles.recommendationTitle}>Recommendations</Text>
                      <Text style={styles.recommendationText}>
                        This field has {selectedField.riskAreas} identified risk zones that require attention. Switch to the Risk Zones tab to view detailed information and recommendations for each area.
                      </Text>
                    </View>
                  )}
                </View>
              </ScrollView>
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setFieldDetailVisible(false)}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>

      {/* Risk Zone Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={riskDetailVisible}
        onRequestClose={() => setRiskDetailVisible(false)}
      >
        {selectedRisk && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView
                style={styles.modalScrollView}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                <View
                  style={[
                    styles.modalHeader,
                    { borderBottomColor: getRiskLevelColor(selectedRisk.riskLevel) },
                  ]}
                >
                  <Text style={styles.modalTitle}>{selectedRisk.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons
                      name="location"
                      size={14}
                      color={colors.text.secondary}
                      style={{ marginRight: spacing.xs }}
                    />
                    <Text style={styles.modalSubtitle}>{selectedRisk.location}</Text>
                  </View>
                </View>
                <View style={styles.modalBody}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: spacing.md,
                    }}
                  >
                    <View
                      style={[
                        styles.riskTypeBadge,
                        { backgroundColor: getRiskTypeColor(selectedRisk.riskType) },
                      ]}
                    >
                      <Text style={styles.riskTypeText}>
                        {selectedRisk.riskType.toUpperCase()}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.riskTypeBadge,
                        { backgroundColor: getRiskLevelColor(selectedRisk.riskLevel) },
                      ]}
                    >
                      <Text style={styles.riskTypeText}>
                        {selectedRisk.riskLevel.toUpperCase()} RISK
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.modalSectionTitle}>Description</Text>
                  <Text style={styles.modalText}>{selectedRisk.description}</Text>

                  <View style={styles.recommendationContainer}>
                    <Text style={styles.recommendationTitle}>Recommended Action</Text>
                    <Text style={styles.recommendationText}>
                      {selectedRisk.recommendation}
                    </Text>
                  </View>

                  <Text style={styles.modalSectionTitle}>Details</Text>
                  <View style={styles.modalMetricsContainer}>
                    <View style={styles.modalMetric}>
                      <Text style={styles.modalMetricLabel}>Area</Text>
                      <Text style={styles.modalMetricValue}>{selectedRisk.area}</Text>
                    </View>
                    <View style={styles.modalMetric}>
                      <Text style={styles.modalMetricLabel}>Detected On</Text>
                      <Text style={styles.modalMetricValue}>
                        {new Date(selectedRisk.detectedOn).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setRiskDetailVisible(false)}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

export default SpectralHealthMapsScreen;