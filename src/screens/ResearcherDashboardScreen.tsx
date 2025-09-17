import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface ResearcherDashboardScreenProps {
  navigation: any;
}

interface DatasetCard {
  id: string;
  name: string;
  type: 'soil' | 'crop' | 'weather' | 'satellite';
  lastUpdated: string;
  size: string;
  format: string;
  records: number;
  description: string;
  icon: string;
}

interface AnalysisCard {
  id: string;
  title: string;
  description: string;
  type: 'temporal' | 'spatial' | 'predictive' | 'anomaly';
  status: 'complete' | 'in-progress' | 'draft';
  date: string;
  insights: number;
  author: string;
  icon: string;
}

const { width } = Dimensions.get('window');

const ResearcherDashboardScreen: React.FC<ResearcherDashboardScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { translations } = useLanguage();

  const [activeTab, setActiveTab] = useState<'datasets' | 'analysis'>('datasets');
  const [exportModalVisible, setExportModalVisible] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf' | 'json'>('csv');
  const [exportName, setExportName] = useState<string>('');
  const [exportItem, setExportItem] = useState<string | null>(null);

  // Mock data for datasets
  const datasets: DatasetCard[] = [
    {
      id: '1',
      name: 'Soil Health Metrics 2025',
      type: 'soil',
      lastUpdated: '2 days ago',
      size: '1.45 GB',
      format: 'CSV',
      records: 12450,
      description: 'Comprehensive soil health metrics including pH, organic matter, NPK levels, and microbial activity across 200 fields',
      icon: 'layers',
    },
    {
      id: '2',
      name: 'Crop Growth Patterns Q3',
      type: 'crop',
      lastUpdated: '1 week ago',
      size: '856 MB',
      format: 'JSON',
      records: 8720,
      description: 'Temporal growth patterns for wheat, rice, and maize crops with weekly measurements of height, leaf area, and biomass',
      icon: 'leaf',
    },
    {
      id: '3',
      name: 'Microclimate Sensor Array',
      type: 'weather',
      lastUpdated: '3 hours ago',
      size: '2.31 GB',
      format: 'CSV',
      records: 31245,
      description: 'High-resolution microclimate data from sensor arrays placed across multiple fields, recording temperature, humidity, and soil moisture',
      icon: 'thermometer',
    },
    {
      id: '4',
      name: 'Multispectral Imagery Collection',
      type: 'satellite',
      lastUpdated: '5 days ago',
      size: '4.7 GB',
      format: 'TIFF',
      records: 285,
      description: 'Multispectral satellite imagery with NDVI, EVI, and NDWI indices for vegetation stress analysis',
      icon: 'globe',
    },
  ];

  // Mock data for analysis
  const analyses: AnalysisCard[] = [
    {
      id: '1',
      title: 'Temporal Drought Stress Patterns',
      description: 'Analysis of drought stress patterns across seasons using LSTM models with soil moisture and precipitation data',
      type: 'temporal',
      status: 'complete',
      date: '2025-09-10',
      insights: 12,
      author: 'Dr. Agarwal',
      icon: 'analytics',
    },
    {
      id: '2',
      title: 'Nitrogen Deficiency Anomaly Detection',
      description: 'Automated detection of nitrogen deficiency anomalies using spectral indices and machine learning classifiers',
      type: 'anomaly',
      status: 'in-progress',
      date: '2025-09-14',
      insights: 8,
      author: 'Dr. Patel',
      icon: 'warning',
    },
    {
      id: '3',
      title: 'Spatial Variability in Soil Organic Matter',
      description: 'Kriging interpolation and hotspot analysis of soil organic matter content across multiple fields',
      type: 'spatial',
      status: 'complete',
      date: '2025-09-08',
      insights: 15,
      author: 'Dr. Singh',
      icon: 'map',
    },
    {
      id: '4',
      title: 'Yield Prediction Model Validation',
      description: 'Validation of CNN-based yield prediction models using historical yield data and current growth metrics',
      type: 'predictive',
      status: 'draft',
      date: '2025-09-16',
      insights: 0,
      author: 'Dr. Kumar',
      icon: 'trending-up',
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'soil':
        return '#8B4513';
      case 'crop':
        return '#2E7D32';
      case 'weather':
        return '#1565C0';
      case 'satellite':
        return '#6A1B9A';
      case 'temporal':
        return '#0277BD';
      case 'spatial':
        return '#00695C';
      case 'predictive':
        return '#4527A0';
      case 'anomaly':
        return '#C62828';
      default:
        return colors.primary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return '#2E7D32';
      case 'in-progress':
        return '#F57C00';
      case 'draft':
        return '#757575';
      default:
        return colors.text.secondary;
    }
  };

  const handleDatasetPress = (datasetId: string) => {
    // Navigate to dataset detail view
    console.log('Opening dataset:', datasetId);
  };

  const handleAnalysisPress = (analysisId: string) => {
    // Navigate to analysis detail view
    console.log('Opening analysis:', analysisId);
  };

  const handleExport = (id: string, name: string, type: string) => {
    setExportItem(id);
    setExportName(name);
    setExportModalVisible(true);
  };

  const confirmExport = () => {
    setExportModalVisible(false);
    
    Alert.alert(
      'Export Successful',
      `${exportName} has been exported as ${exportFormat.toUpperCase()}`,
      [{ text: 'OK' }]
    );
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
    welcomeSection: {
      marginBottom: spacing.lg,
    },
    welcomeTitle: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    welcomeSubtitle: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    tabsContainer: {
      flexDirection: 'row',
      marginVertical: spacing.lg,
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
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewAllText: {
      fontSize: fontSize.sm,
      color: colors.primary,
      marginRight: spacing.xs,
    },
    datasetCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    datasetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    datasetTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      flex: 1,
      marginRight: spacing.sm,
    },
    datasetMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    datasetType: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      marginRight: spacing.sm,
    },
    datasetTypeText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.surface,
    },
    datasetDescription: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.md,
    },
    datasetFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    datasetStats: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    datasetStatItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    datasetStatText: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
    },
    exportButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '20',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    exportButtonText: {
      fontSize: fontSize.xs,
      color: colors.primary,
      marginLeft: spacing.xs,
    },
    analysisCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    analysisHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    analysisTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      flex: 1,
      marginRight: spacing.sm,
    },
    analysisMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    analysisType: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      marginRight: spacing.sm,
    },
    analysisTypeText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.surface,
    },
    analysisDescription: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.md,
    },
    analysisFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    analysisStats: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    analysisStatItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    analysisStatText: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
    },
    statusBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      marginLeft: spacing.xs,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      width: width * 0.8,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      elevation: 5,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    modalTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    modalInputLabel: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    modalInput: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.sm,
      padding: spacing.sm,
      fontSize: fontSize.sm,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    formatOptions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
    },
    formatOption: {
      flex: 1,
      padding: spacing.md,
      alignItems: 'center',
      borderRadius: borderRadius.sm,
      backgroundColor: colors.background,
      marginHorizontal: spacing.xs,
    },
    formatOptionSelected: {
      backgroundColor: colors.primary + '20',
      borderColor: colors.primary,
      borderWidth: 1,
    },
    formatText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.xs,
    },
    formatTextSelected: {
      color: colors.primary,
      fontWeight: fontWeight.medium,
    },
    modalButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalCancelButton: {
      flex: 1,
      padding: spacing.sm,
      alignItems: 'center',
      borderRadius: borderRadius.sm,
      marginRight: spacing.sm,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    modalCancelText: {
      fontSize: fontSize.sm,
      color: colors.primary,
    },
    modalExportButton: {
      flex: 1,
      padding: spacing.sm,
      alignItems: 'center',
      borderRadius: borderRadius.sm,
      backgroundColor: colors.primary,
      marginLeft: spacing.sm,
    },
    modalExportText: {
      fontSize: fontSize.sm,
      color: colors.surface,
      fontWeight: fontWeight.medium,
    },
    quickActionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
    },
    quickActionButton: {
      flex: 1,
      padding: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      marginHorizontal: spacing.xs,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    quickActionText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
      marginTop: spacing.xs,
      textAlign: 'center',
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
            <Text style={styles.headerTitle}>Researcher Dashboard</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome, Dr. Sharma</Text>
          <Text style={styles.welcomeSubtitle}>
            Access advanced analytics, temporal plots, and anomaly reports
          </Text>
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('SpectralHealthMaps')}
          >
            <Ionicons name="map" size={24} color={colors.primary} />
            <Text style={styles.quickActionText}>Spectral Maps</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('DataExport')}
          >
            <Ionicons name="download" size={24} color={colors.primary} />
            <Text style={styles.quickActionText}>Data Export</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('FeedbackLoop')}
          >
            <Ionicons name="chatbubble-ellipses" size={24} color={colors.primary} />
            <Text style={styles.quickActionText}>Feedback</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'datasets' && styles.activeTab]}
            onPress={() => setActiveTab('datasets')}
          >
            <Text style={[styles.tabText, activeTab === 'datasets' && styles.activeTabText]}>
              Datasets
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'analysis' && styles.activeTab]}
            onPress={() => setActiveTab('analysis')}
          >
            <Text style={[styles.tabText, activeTab === 'analysis' && styles.activeTabText]}>
              Analysis
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {activeTab === 'datasets' && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Available Datasets</Text>
                <TouchableOpacity style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>View All</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {datasets.map((dataset) => (
                <TouchableOpacity
                  key={dataset.id}
                  style={styles.datasetCard}
                  onPress={() => handleDatasetPress(dataset.id)}
                >
                  <View style={styles.datasetHeader}>
                    <Text style={styles.datasetTitle}>{dataset.name}</Text>
                    <View style={styles.datasetMeta}>
                      <View
                        style={[
                          styles.datasetType,
                          { backgroundColor: getTypeColor(dataset.type) },
                        ]}
                      >
                        <Text style={styles.datasetTypeText}>
                          {dataset.type.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.datasetDescription}>{dataset.description}</Text>

                  <View style={styles.datasetFooter}>
                    <View style={styles.datasetStats}>
                      <View style={styles.datasetStatItem}>
                        <Ionicons name="document" size={12} color={colors.text.secondary} />
                        <Text style={styles.datasetStatText}>{dataset.records} records</Text>
                      </View>
                      <View style={styles.datasetStatItem}>
                        <Ionicons name="time" size={12} color={colors.text.secondary} />
                        <Text style={styles.datasetStatText}>{dataset.lastUpdated}</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.exportButton}
                      onPress={() => handleExport(dataset.id, dataset.name, 'dataset')}
                    >
                      <Ionicons name="download" size={12} color={colors.primary} />
                      <Text style={styles.exportButtonText}>Export</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}

          {activeTab === 'analysis' && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Analyses</Text>
                <TouchableOpacity style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>View All</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {analyses.map((analysis) => (
                <TouchableOpacity
                  key={analysis.id}
                  style={styles.analysisCard}
                  onPress={() => handleAnalysisPress(analysis.id)}
                >
                  <View style={styles.analysisHeader}>
                    <Text style={styles.analysisTitle}>{analysis.title}</Text>
                    <View style={styles.analysisMeta}>
                      <View
                        style={[
                          styles.analysisType,
                          { backgroundColor: getTypeColor(analysis.type) },
                        ]}
                      >
                        <Text style={styles.analysisTypeText}>
                          {analysis.type.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.analysisDescription}>{analysis.description}</Text>

                  <View style={styles.analysisFooter}>
                    <View style={styles.analysisStats}>
                      <View style={styles.analysisStatItem}>
                        <Ionicons name="person" size={12} color={colors.text.secondary} />
                        <Text style={styles.analysisStatText}>{analysis.author}</Text>
                      </View>
                      <View style={styles.analysisStatItem}>
                        <Ionicons name="calendar" size={12} color={colors.text.secondary} />
                        <Text style={styles.analysisStatText}>
                          {new Date(analysis.date).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(analysis.status) + '20' },
                      ]}
                    >
                      <Ionicons
                        name={
                          analysis.status === 'complete'
                            ? 'checkmark-circle'
                            : analysis.status === 'in-progress'
                            ? 'time'
                            : 'document'
                        }
                        size={12}
                        color={getStatusColor(analysis.status)}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(analysis.status) },
                        ]}
                      >
                        {analysis.status.replace('-', ' ')}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}
        </ScrollView>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={exportModalVisible}
        onRequestClose={() => setExportModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Export Options</Text>

            <Text style={styles.modalInputLabel}>File Name</Text>
            <TextInput
              style={styles.modalInput}
              value={exportName}
              onChangeText={setExportName}
              placeholder="Enter file name"
              placeholderTextColor={colors.text.secondary}
            />

            <Text style={styles.modalInputLabel}>Format</Text>
            <View style={styles.formatOptions}>
              <TouchableOpacity
                style={[
                  styles.formatOption,
                  exportFormat === 'csv' && styles.formatOptionSelected,
                ]}
                onPress={() => setExportFormat('csv')}
              >
                <Ionicons
                  name="document-text"
                  size={24}
                  color={exportFormat === 'csv' ? colors.primary : colors.text.secondary}
                />
                <Text
                  style={[
                    styles.formatText,
                    exportFormat === 'csv' && styles.formatTextSelected,
                  ]}
                >
                  CSV
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.formatOption,
                  exportFormat === 'pdf' && styles.formatOptionSelected,
                ]}
                onPress={() => setExportFormat('pdf')}
              >
                <Ionicons
                  name="document"
                  size={24}
                  color={exportFormat === 'pdf' ? colors.primary : colors.text.secondary}
                />
                <Text
                  style={[
                    styles.formatText,
                    exportFormat === 'pdf' && styles.formatTextSelected,
                  ]}
                >
                  PDF
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.formatOption,
                  exportFormat === 'json' && styles.formatOptionSelected,
                ]}
                onPress={() => setExportFormat('json')}
              >
                <Ionicons
                  name="code-slash"
                  size={24}
                  color={exportFormat === 'json' ? colors.primary : colors.text.secondary}
                />
                <Text
                  style={[
                    styles.formatText,
                    exportFormat === 'json' && styles.formatTextSelected,
                  ]}
                >
                  JSON
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setExportModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalExportButton}
                onPress={confirmExport}
              >
                <Text style={styles.modalExportText}>Export</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ResearcherDashboardScreen;