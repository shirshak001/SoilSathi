import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import CustomButton from '../components/CustomButton';

interface PredictiveModelsScreenProps {
  navigation: any;
}

interface ModelData {
  id: string;
  name: string;
  description: string;
  accuracy: string;
  lastUpdated: string;
  predictionType: string;
  icon: string;
}

interface PredictionResult {
  id: string;
  fieldName: string;
  date: string;
  stressLevel: number;
  stressType: string;
  recommendation: string;
  confidence: number;
}

const { width } = Dimensions.get('window');

const PredictiveModelsScreen: React.FC<PredictiveModelsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { translations } = useLanguage();

  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'models' | 'predictions'>('models');
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [runningModel, setRunningModel] = useState<boolean>(false);

  // Mock data for available models
  const availableModels: ModelData[] = [
    {
      id: '1',
      name: 'LSTM Vegetation Stress Predictor',
      description: 'Time-series analysis for predicting long-term stress patterns in crops',
      accuracy: '92.7%',
      lastUpdated: '2 days ago',
      predictionType: 'Long-term',
      icon: 'trending-up',
    },
    {
      id: '2',
      name: 'CNN Leaf Disease Classifier',
      description: 'Image-based classification of plant diseases and stress markers',
      accuracy: '95.2%',
      lastUpdated: '1 day ago',
      predictionType: 'Current',
      icon: 'leaf',
    },
    {
      id: '3',
      name: 'Hybrid LSTM-CNN Drought Predictor',
      description: 'Combined model for predicting drought stress with spatial and temporal features',
      accuracy: '90.4%',
      lastUpdated: '5 days ago',
      predictionType: 'Medium-term',
      icon: 'water',
    },
    {
      id: '4',
      name: 'GNN Field Anomaly Detector',
      description: 'Graph neural network for detecting anomalous growth patterns across fields',
      accuracy: '88.9%',
      lastUpdated: '1 week ago',
      predictionType: 'Current',
      icon: 'warning',
    },
  ];

  // Mock data for previous predictions
  const predictionResults: PredictionResult[] = [
    {
      id: '1',
      fieldName: 'North Wheat Field',
      date: '2025-09-15',
      stressLevel: 0.75,
      stressType: 'Water Stress',
      recommendation: 'Increase irrigation by 15% for the next 7 days',
      confidence: 0.92,
    },
    {
      id: '2',
      fieldName: 'East Rice Paddy',
      date: '2025-09-14',
      stressLevel: 0.25,
      stressType: 'Nutrient Deficiency',
      recommendation: 'Apply nitrogen-rich fertilizer within 3 days',
      confidence: 0.88,
    },
    {
      id: '3',
      fieldName: 'South Vegetable Garden',
      date: '2025-09-10',
      stressLevel: 0.62,
      stressType: 'Pest Infestation',
      recommendation: 'Inspect for aphids and apply organic pesticide if confirmed',
      confidence: 0.94,
    },
    {
      id: '4',
      fieldName: 'West Corn Field',
      date: '2025-09-08',
      stressLevel: 0.12,
      stressType: 'None Detected',
      recommendation: 'Continue current management practices',
      confidence: 0.96,
    },
  ];

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId === selectedModel ? null : modelId);
  };

  const handleRunModel = (modelId: string) => {
    setRunningModel(true);
    
    // Simulate model running
    setTimeout(() => {
      setRunningModel(false);
      Alert.alert(
        "Analysis Complete",
        "The predictive model has successfully analyzed your field data. View the results in the Predictions tab.",
        [
          { text: "View Results", onPress: () => setActiveTab('predictions') },
          { text: "OK", style: "cancel" }
        ]
      );
    }, 3000);
  };

  const getStressLevelColor = (level: number) => {
    if (level > 0.7) return '#EF4444';
    if (level > 0.4) return '#F59E0B';
    return '#10B981';
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
    modelItem: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      marginBottom: spacing.md,
      padding: spacing.md,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    selectedModelItem: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    modelHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    modelName: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      flex: 1,
    },
    accuracyBadge: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    accuracyText: {
      fontSize: fontSize.xs,
      color: colors.primary,
      fontWeight: fontWeight.medium,
    },
    modelDescription: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.sm,
    },
    modelFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    modelMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    modelMetaText: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
    },
    runButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.sm,
    },
    runButtonText: {
      color: colors.surface,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      marginLeft: spacing.xs,
    },
    predictionItem: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      marginBottom: spacing.md,
      overflow: 'hidden',
    },
    predictionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    fieldName: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    predictionDate: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
    },
    predictionContent: {
      padding: spacing.md,
    },
    stressIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    stressLabel: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginRight: spacing.md,
      width: 100,
    },
    stressBar: {
      height: 8,
      flex: 1,
      backgroundColor: colors.border,
      borderRadius: borderRadius.sm,
      overflow: 'hidden',
    },
    stressFill: {
      height: '100%',
    },
    stressType: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    recommendationBox: {
      backgroundColor: colors.background + '80',
      borderRadius: borderRadius.sm,
      padding: spacing.md,
      marginTop: spacing.sm,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    recommendationTitle: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    recommendationText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    confidenceTag: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
      backgroundColor: colors.primary + '20',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    confidenceText: {
      fontSize: fontSize.xs,
      color: colors.primary,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
    },
    emptyStateText: {
      fontSize: fontSize.md,
      color: colors.text.secondary,
      textAlign: 'center',
      marginTop: spacing.md,
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
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
            <Text style={styles.headerTitle}>Predictive Models</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'models' && styles.activeTab]}
            onPress={() => setActiveTab('models')}
          >
            <Text style={[styles.tabText, activeTab === 'models' && styles.activeTabText]}>
              Models
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'predictions' && styles.activeTab]}
            onPress={() => setActiveTab('predictions')}
          >
            <Text style={[styles.tabText, activeTab === 'predictions' && styles.activeTabText]}>
              Predictions
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {activeTab === 'models' && (
            <>
              {runningModel ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={{ marginTop: spacing.md, color: colors.text.secondary }}>
                    Running analysis... This may take a few moments.
                  </Text>
                </View>
              ) : (
                <>
                  {availableModels.map((model) => (
                    <TouchableOpacity
                      key={model.id}
                      style={[
                        styles.modelItem,
                        selectedModel === model.id && styles.selectedModelItem,
                      ]}
                      onPress={() => handleModelSelect(model.id)}
                    >
                      <View style={styles.modelHeader}>
                        <Text style={styles.modelName}>{model.name}</Text>
                        <View style={styles.accuracyBadge}>
                          <Text style={styles.accuracyText}>Accuracy: {model.accuracy}</Text>
                        </View>
                      </View>

                      <Text style={styles.modelDescription}>{model.description}</Text>

                      <View style={styles.modelFooter}>
                        <View style={styles.modelMeta}>
                          <Ionicons
                            name={model.icon as any}
                            size={16}
                            color={colors.text.secondary}
                          />
                          <Text style={styles.modelMetaText}>
                            {model.predictionType} | Updated {model.lastUpdated}
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={styles.runButton}
                          onPress={() => handleRunModel(model.id)}
                        >
                          <Ionicons name="play" size={16} color={colors.surface} />
                          <Text style={styles.runButtonText}>Run Model</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </>
          )}

          {activeTab === 'predictions' && (
            <>
              {predictionResults.length > 0 ? (
                predictionResults.map((prediction) => (
                  <View key={prediction.id} style={styles.predictionItem}>
                    <View style={styles.predictionHeader}>
                      <Text style={styles.fieldName}>{prediction.fieldName}</Text>
                      <Text style={styles.predictionDate}>
                        {new Date(prediction.date).toLocaleDateString()}
                      </Text>
                    </View>

                    <View style={styles.predictionContent}>
                      <View style={styles.stressIndicator}>
                        <Text style={styles.stressLabel}>Stress Level:</Text>
                        <View style={styles.stressBar}>
                          <LinearGradient
                            colors={[
                              getStressLevelColor(prediction.stressLevel),
                              getStressLevelColor(prediction.stressLevel) + '80',
                            ]}
                            style={[
                              styles.stressFill,
                              { width: `${prediction.stressLevel * 100}%` },
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                          />
                        </View>
                      </View>

                      <View style={styles.stressType}>
                        <Text style={styles.stressLabel}>Stress Type:</Text>
                        <Text
                          style={{
                            color:
                              prediction.stressType === 'None Detected'
                                ? '#10B981'
                                : colors.text.primary,
                            fontWeight: 'bold',
                          }}
                        >
                          {prediction.stressType}
                        </Text>
                      </View>

                      <View style={styles.recommendationBox}>
                        <Text style={styles.recommendationTitle}>Recommendation:</Text>
                        <Text style={styles.recommendationText}>
                          {prediction.recommendation}
                        </Text>
                      </View>

                      <View style={styles.confidenceTag}>
                        <Text style={styles.confidenceText}>
                          Confidence: {Math.round(prediction.confidence * 100)}%
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="analytics" size={48} color={colors.text.secondary} />
                  <Text style={styles.emptyStateText}>
                    No predictions found. Run a model to generate predictions.
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default PredictiveModelsScreen;