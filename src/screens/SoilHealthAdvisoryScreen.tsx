import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface SoilHealthAdvisoryScreenProps {
  navigation: any;
}

interface SoilTestData {
  id: string;
  fieldName: string;
  testDate: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  moisture: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

interface FertilizerRecommendation {
  nutrient: string;
  currentLevel: number;
  targetLevel: number;
  recommendation: string;
  product: string;
  quantity: string;
  applicationMethod: string;
}

const { width } = Dimensions.get('window');

const SoilHealthAdvisoryScreen: React.FC<SoilHealthAdvisoryScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { translations } = useLanguage();

  const [selectedTab, setSelectedTab] = useState<'overview' | 'tests' | 'recommendations'>('overview');
  const [manualInputModal, setManualInputModal] = useState(false);
  const [deviceSyncModal, setDeviceSyncModal] = useState(false);
  const [selectedField, setSelectedField] = useState('all');

  // Manual input states
  const [manualData, setManualData] = useState({
    fieldName: '',
    ph: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    organicMatter: '',
    moisture: '',
  });

  const tabs = [
    { key: 'overview', label: 'Soil Overview', icon: 'earth' },
    { key: 'tests', label: 'Test Results', icon: 'flask' },
    { key: 'recommendations', label: 'Fertilizer Guide', icon: 'leaf' },
  ];

  const soilTestData: SoilTestData[] = [
    {
      id: '1',
      fieldName: 'Field A - Wheat',
      testDate: '2024-08-25',
      ph: 6.8,
      nitrogen: 45,
      phosphorus: 38,
      potassium: 52,
      organicMatter: 3.2,
      moisture: 65,
      status: 'good',
    },
    {
      id: '2',
      fieldName: 'Field B - Corn',
      testDate: '2024-08-20',
      ph: 7.2,
      nitrogen: 38,
      phosphorus: 42,
      potassium: 48,
      organicMatter: 2.8,
      moisture: 58,
      status: 'excellent',
    },
    {
      id: '3',
      fieldName: 'Field C - Tomatoes',
      testDate: '2024-08-18',
      ph: 6.2,
      nitrogen: 32,
      phosphorus: 28,
      potassium: 35,
      organicMatter: 2.1,
      moisture: 42,
      status: 'fair',
    },
  ];

  const fertilizerRecommendations: FertilizerRecommendation[] = [
    {
      nutrient: 'Nitrogen (N)',
      currentLevel: 32,
      targetLevel: 45,
      recommendation: 'Apply nitrogen-rich fertilizer to boost leaf growth',
      product: 'Urea (46-0-0)',
      quantity: '25 kg per acre',
      applicationMethod: 'Split application: 50% at sowing, 50% at vegetative stage',
    },
    {
      nutrient: 'Phosphorus (P)',
      currentLevel: 28,
      targetLevel: 40,
      recommendation: 'Increase phosphorus for better root development',
      product: 'DAP (18-46-0)',
      quantity: '15 kg per acre',
      applicationMethod: 'Apply at sowing time near seed placement',
    },
    {
      nutrient: 'Potassium (K)',
      currentLevel: 35,
      targetLevel: 50,
      recommendation: 'Apply potassium for disease resistance and fruit quality',
      product: 'MOP (0-0-60)',
      quantity: '12 kg per acre',
      applicationMethod: 'Apply before flowering stage',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return '#10B981';
      case 'good':
        return '#3B82F6';
      case 'fair':
        return '#F59E0B';
      case 'poor':
        return '#EF4444';
      default:
        return colors.text.secondary;
    }
  };

  const getHealthLevel = (value: number, nutrient: string) => {
    if (nutrient === 'ph') {
      if (value >= 6.5 && value <= 7.5) return 'Optimal';
      if (value >= 6.0 && value <= 8.0) return 'Good';
      if (value >= 5.5 && value <= 8.5) return 'Fair';
      return 'Poor';
    }
    if (value >= 40) return 'High';
    if (value >= 25) return 'Medium';
    if (value >= 15) return 'Low';
    return 'Very Low';
  };

  const handleManualSubmit = () => {
    if (!manualData.fieldName || !manualData.ph) {
      Alert.alert('Missing Data', 'Please fill in at least field name and pH value.');
      return;
    }

    Alert.alert('Data Saved', 'Soil test data has been saved successfully!', [
      {
        text: 'OK',
        onPress: () => {
          setManualInputModal(false);
          setManualData({
            fieldName: '',
            ph: '',
            nitrogen: '',
            phosphorus: '',
            potassium: '',
            organicMatter: '',
            moisture: '',
          });
        },
      },
    ]);
  };

  const handleDeviceSync = () => {
    setDeviceSyncModal(true);
    // Simulate device sync
    setTimeout(() => {
      setDeviceSyncModal(false);
      Alert.alert('Sync Complete', 'Successfully synced data from your soil testing device!');
    }, 2000);
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
    syncButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.surface + '20',
      borderRadius: borderRadius.md,
    },
    syncText: {
      fontSize: fontSize.sm,
      color: colors.surface,
      marginRight: spacing.xs,
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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      borderRadius: borderRadius.lg,
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    tabText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
    },
    activeTabText: {
      color: colors.surface,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
    },
    actionButtons: {
      flexDirection: 'row',
      marginBottom: spacing.lg,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      marginHorizontal: spacing.xs,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    actionButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.primary,
      marginLeft: spacing.xs,
    },
    overviewGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
    },
    overviewCard: {
      width: (width - spacing.lg * 3) / 2,
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
    overviewValue: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.primary,
      marginBottom: spacing.xs,
    },
    overviewLabel: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    overviewStatus: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      textTransform: 'uppercase',
    },
    testCard: {
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
    testHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    testFieldName: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    testDate: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    statusBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
      borderRadius: borderRadius.sm,
    },
    statusText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.surface,
      textTransform: 'uppercase',
    },
    testGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    testItem: {
      width: '48%',
      marginBottom: spacing.sm,
    },
    testItemLabel: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      marginBottom: spacing.xs / 2,
    },
    testItemValue: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    testItemUnit: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    recommendationCard: {
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
    nutrientHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    nutrientName: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    levelComparison: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    levelText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginRight: spacing.xs,
    },
    levelValue: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
    },
    currentLevel: {
      color: '#EF4444',
    },
    targetLevel: {
      color: '#10B981',
    },
    recommendationText: {
      fontSize: fontSize.sm,
      color: colors.text.primary,
      marginBottom: spacing.sm,
      lineHeight: 20,
    },
    productInfo: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.sm,
      padding: spacing.sm,
      marginBottom: spacing.sm,
    },
    productName: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      color: colors.primary,
      marginBottom: spacing.xs / 2,
    },
    productQuantity: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs / 2,
    },
    applicationMethod: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      fontStyle: 'italic',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      width: '90%',
      maxHeight: '80%',
    },
    modalTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.lg,
      textAlign: 'center',
    },
    inputGroup: {
      marginBottom: spacing.md,
    },
    inputLabel: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    textInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      fontSize: fontSize.sm,
      color: colors.text.primary,
    },
    inputRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    halfInput: {
      width: '48%',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.lg,
    },
    modalButton: {
      flex: 1,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      marginHorizontal: spacing.xs,
    },
    cancelButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    submitButton: {
      backgroundColor: colors.primary,
    },
    cancelButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
    },
    submitButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.surface,
    },
    syncModalContent: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      alignItems: 'center',
      width: '80%',
    },
    syncIcon: {
      marginBottom: spacing.lg,
    },
    syncModalText: {
      fontSize: fontSize.md,
      color: colors.text.primary,
      textAlign: 'center',
    },
  });

  const styles = getStyles();

  const renderOverview = () => {
    const averageData = soilTestData.reduce(
      (acc, test) => ({
        ph: acc.ph + test.ph,
        nitrogen: acc.nitrogen + test.nitrogen,
        phosphorus: acc.phosphorus + test.phosphorus,
        potassium: acc.potassium + test.potassium,
        organicMatter: acc.organicMatter + test.organicMatter,
        moisture: acc.moisture + test.moisture,
      }),
      { ph: 0, nitrogen: 0, phosphorus: 0, potassium: 0, organicMatter: 0, moisture: 0 }
    );

    const avgCount = soilTestData.length;
    const avgPh = averageData.ph / avgCount;
    const avgNitrogen = averageData.nitrogen / avgCount;
    const avgPhosphorus = averageData.phosphorus / avgCount;
    const avgPotassium = averageData.potassium / avgCount;

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setManualInputModal(true)}
          >
            <Ionicons name="create" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Manual Input</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDeviceSync}>
            <Ionicons name="bluetooth" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Sync Device</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.overviewGrid}>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewValue}>{avgPh.toFixed(1)}</Text>
            <Text style={styles.overviewLabel}>Average pH</Text>
            <Text style={[styles.overviewStatus, { color: getStatusColor('good') }]}>
              {getHealthLevel(avgPh, 'ph')}
            </Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewValue}>{avgNitrogen.toFixed(0)}</Text>
            <Text style={styles.overviewLabel}>Nitrogen (ppm)</Text>
            <Text style={[styles.overviewStatus, { color: getStatusColor('fair') }]}>
              {getHealthLevel(avgNitrogen, 'nitrogen')}
            </Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewValue}>{avgPhosphorus.toFixed(0)}</Text>
            <Text style={styles.overviewLabel}>Phosphorus (ppm)</Text>
            <Text style={[styles.overviewStatus, { color: getStatusColor('good') }]}>
              {getHealthLevel(avgPhosphorus, 'phosphorus')}
            </Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewValue}>{avgPotassium.toFixed(0)}</Text>
            <Text style={styles.overviewLabel}>Potassium (ppm)</Text>
            <Text style={[styles.overviewStatus, { color: getStatusColor('excellent') }]}>
              {getHealthLevel(avgPotassium, 'potassium')}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderTestResults = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {soilTestData.map((test) => (
        <View key={test.id} style={styles.testCard}>
          <View style={styles.testHeader}>
            <View>
              <Text style={styles.testFieldName}>{test.fieldName}</Text>
              <Text style={styles.testDate}>Tested on {test.testDate}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(test.status) }]}>
              <Text style={styles.statusText}>{test.status}</Text>
            </View>
          </View>
          <View style={styles.testGrid}>
            <View style={styles.testItem}>
              <Text style={styles.testItemLabel}>pH Level</Text>
              <Text style={styles.testItemValue}>
                {test.ph} <Text style={styles.testItemUnit}>pH</Text>
              </Text>
            </View>
            <View style={styles.testItem}>
              <Text style={styles.testItemLabel}>Nitrogen</Text>
              <Text style={styles.testItemValue}>
                {test.nitrogen} <Text style={styles.testItemUnit}>ppm</Text>
              </Text>
            </View>
            <View style={styles.testItem}>
              <Text style={styles.testItemLabel}>Phosphorus</Text>
              <Text style={styles.testItemValue}>
                {test.phosphorus} <Text style={styles.testItemUnit}>ppm</Text>
              </Text>
            </View>
            <View style={styles.testItem}>
              <Text style={styles.testItemLabel}>Potassium</Text>
              <Text style={styles.testItemValue}>
                {test.potassium} <Text style={styles.testItemUnit}>ppm</Text>
              </Text>
            </View>
            <View style={styles.testItem}>
              <Text style={styles.testItemLabel}>Organic Matter</Text>
              <Text style={styles.testItemValue}>
                {test.organicMatter} <Text style={styles.testItemUnit}>%</Text>
              </Text>
            </View>
            <View style={styles.testItem}>
              <Text style={styles.testItemLabel}>Moisture</Text>
              <Text style={styles.testItemValue}>
                {test.moisture} <Text style={styles.testItemUnit}>%</Text>
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderRecommendations = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {fertilizerRecommendations.map((rec, index) => (
        <View key={index} style={styles.recommendationCard}>
          <View style={styles.nutrientHeader}>
            <Text style={styles.nutrientName}>{rec.nutrient}</Text>
            <View style={styles.levelComparison}>
              <Text style={styles.levelText}>Current:</Text>
              <Text style={[styles.levelValue, styles.currentLevel]}>{rec.currentLevel}</Text>
              <Text style={styles.levelText}> → Target:</Text>
              <Text style={[styles.levelValue, styles.targetLevel]}>{rec.targetLevel}</Text>
            </View>
          </View>
          <Text style={styles.recommendationText}>{rec.recommendation}</Text>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{rec.product}</Text>
            <Text style={styles.productQuantity}>Quantity: {rec.quantity}</Text>
            <Text style={styles.applicationMethod}>Application: {rec.applicationMethod}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return renderOverview();
      case 'tests':
        return renderTestResults();
      case 'recommendations':
        return renderRecommendations();
      default:
        return renderOverview();
    }
  };

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
            <Text style={styles.headerTitle}>Soil Health Advisory</Text>
          </View>
          <TouchableOpacity style={styles.syncButton} onPress={handleDeviceSync}>
            <Text style={styles.syncText}>Sync</Text>
            <Ionicons name="refresh" size={16} color={colors.surface} />
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

      <View style={styles.content}>{renderTabContent()}</View>

      {/* Manual Input Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={manualInputModal}
        onRequestClose={() => setManualInputModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Manual Soil Data Input</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Field Name *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter field name"
                  placeholderTextColor={colors.text.hint}
                  value={manualData.fieldName}
                  onChangeText={(text) => setManualData({ ...manualData, fieldName: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>pH Level *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="6.5"
                  placeholderTextColor={colors.text.hint}
                  value={manualData.ph}
                  onChangeText={(text) => setManualData({ ...manualData, ph: text })}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, styles.halfInput]}>
                  <Text style={styles.inputLabel}>Nitrogen (ppm)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="40"
                    placeholderTextColor={colors.text.hint}
                    value={manualData.nitrogen}
                    onChangeText={(text) => setManualData({ ...manualData, nitrogen: text })}
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputGroup, styles.halfInput]}>
                  <Text style={styles.inputLabel}>Phosphorus (ppm)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="35"
                    placeholderTextColor={colors.text.hint}
                    value={manualData.phosphorus}
                    onChangeText={(text) => setManualData({ ...manualData, phosphorus: text })}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, styles.halfInput]}>
                  <Text style={styles.inputLabel}>Potassium (ppm)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="45"
                    placeholderTextColor={colors.text.hint}
                    value={manualData.potassium}
                    onChangeText={(text) => setManualData({ ...manualData, potassium: text })}
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputGroup, styles.halfInput]}>
                  <Text style={styles.inputLabel}>Organic Matter (%)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="3.0"
                    placeholderTextColor={colors.text.hint}
                    value={manualData.organicMatter}
                    onChangeText={(text) => setManualData({ ...manualData, organicMatter: text })}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Moisture (%)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="60"
                  placeholderTextColor={colors.text.hint}
                  value={manualData.moisture}
                  onChangeText={(text) => setManualData({ ...manualData, moisture: text })}
                  keyboardType="numeric"
                />
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setManualInputModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleManualSubmit}
              >
                <Text style={styles.submitButtonText}>Save Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Device Sync Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deviceSyncModal}
        onRequestClose={() => setDeviceSyncModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.syncModalContent}>
            <View style={styles.syncIcon}>
              <Ionicons name="bluetooth" size={48} color={colors.primary} />
            </View>
            <Text style={styles.syncModalText}>
              Syncing with soil testing device...
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SoilHealthAdvisoryScreen;
