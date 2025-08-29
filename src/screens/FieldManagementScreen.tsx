import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import CustomButton from '../components/CustomButton';

interface FieldManagementProps {
  navigation: any;
}

interface Field {
  id: string;
  name: string;
  crop: string;
  area: string;
  plantingDate: string;
  status: 'healthy' | 'warning' | 'critical';
  soilType: string;
  lastWatered: string;
  nextActivity: string;
}

interface Activity {
  id: string;
  fieldId: string;
  type: 'watering' | 'fertilizing' | 'harvesting' | 'planting' | 'weeding';
  date: string;
  status: 'pending' | 'completed' | 'overdue';
  description: string;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - spacing.lg * 3) / 2;

const FieldManagementScreen: React.FC<FieldManagementProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const colors = theme.colors;

  const [fields, setFields] = useState<Field[]>([
    {
      id: '1',
      name: 'North Field',
      crop: 'Wheat',
      area: '2.5 acres',
      plantingDate: '2024-11-15',
      status: 'healthy',
      soilType: 'Loamy',
      lastWatered: '2 days ago',
      nextActivity: 'Fertilizing in 3 days'
    },
    {
      id: '2',
      name: 'South Field',
      crop: 'Rice',
      area: '1.8 acres',
      plantingDate: '2024-10-20',
      status: 'warning',
      soilType: 'Clay',
      lastWatered: '1 day ago',
      nextActivity: 'Pest control needed'
    },
    {
      id: '3',
      name: 'East Field',
      crop: 'Corn',
      area: '3.2 acres',
      plantingDate: '2024-12-01',
      status: 'healthy',
      soilType: 'Sandy Loam',
      lastWatered: '3 days ago',
      nextActivity: 'Watering today'
    },
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      fieldId: '1',
      type: 'fertilizing',
      date: '2025-09-02',
      status: 'pending',
      description: 'Apply nitrogen fertilizer'
    },
    {
      id: '2',
      fieldId: '2',
      type: 'watering',
      date: '2025-08-29',
      status: 'overdue',
      description: 'Deep watering required'
    },
    {
      id: '3',
      fieldId: '3',
      type: 'weeding',
      date: '2025-08-30',
      status: 'pending',
      description: 'Remove weeds around crops'
    },
  ]);

  const [showAddField, setShowAddField] = useState(false);
  const [newField, setNewField] = useState({
    name: '',
    crop: '',
    area: '',
    soilType: '',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'critical':
        return colors.error;
      default:
        return colors.text.secondary;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'watering':
        return 'water';
      case 'fertilizing':
        return 'nutrition';
      case 'harvesting':
        return 'basket';
      case 'planting':
        return 'leaf';
      case 'weeding':
        return 'cut';
      default:
        return 'document';
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'overdue':
        return colors.error;
      default:
        return colors.text.secondary;
    }
  };

  const handleAddField = () => {
    if (!newField.name || !newField.crop || !newField.area) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const field: Field = {
      id: (fields.length + 1).toString(),
      name: newField.name,
      crop: newField.crop,
      area: newField.area,
      soilType: newField.soilType || 'Unknown',
      plantingDate: new Date().toISOString().split('T')[0],
      status: 'healthy',
      lastWatered: 'Never',
      nextActivity: 'Plan activities'
    };

    setFields([...fields, field]);
    setNewField({ name: '', crop: '', area: '', soilType: '' });
    setShowAddField(false);
    Alert.alert('Success', 'Field added successfully!');
  };

  const markActivityComplete = (activityId: string) => {
    setActivities(activities.map(activity =>
      activity.id === activityId
        ? { ...activity, status: 'completed' }
        : activity
    ));
    Alert.alert('Success', 'Activity marked as completed!');
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
    headerTitle: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.surface,
      flex: 1,
      textAlign: 'center',
    },
    backButton: {
      padding: spacing.xs,
    },
    addButton: {
      padding: spacing.xs,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    seeAllText: {
      fontSize: fontSize.sm,
      color: colors.primary,
      fontWeight: fontWeight.medium,
    },
    fieldCard: {
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
    fieldHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    fieldName: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      flex: 1,
    },
    statusBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
      borderRadius: borderRadius.sm,
      marginLeft: spacing.sm,
    },
    statusText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.surface,
      textTransform: 'uppercase',
    },
    fieldInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: spacing.md,
    },
    infoItem: {
      width: '50%',
      marginBottom: spacing.sm,
    },
    infoLabel: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs / 2,
    },
    infoValue: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
    },
    fieldActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      marginHorizontal: spacing.xs,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    actionButtonPrimary: {
      backgroundColor: colors.primary,
    },
    actionButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.primary,
      marginLeft: spacing.xs,
    },
    actionButtonTextPrimary: {
      color: colors.surface,
    },
    activityCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
      elevation: 1,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    activityHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    activityIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.sm,
    },
    activityInfo: {
      flex: 1,
    },
    activityTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
    },
    activityField: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.xs / 2,
    },
    activityDate: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    activityDescription: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.xs,
    },
    activityActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: spacing.sm,
    },
    completeButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      backgroundColor: colors.success,
    },
    completeButtonText: {
      fontSize: fontSize.sm,
      color: colors.surface,
      fontWeight: fontWeight.medium,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: width * 0.9,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
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
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: fontSize.md,
      color: colors.text.primary,
      backgroundColor: colors.background,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.lg,
    },
    modalButton: {
      flex: 1,
      marginHorizontal: spacing.xs,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
    },
    statCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      width: cardWidth,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    statValue: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      textAlign: 'center',
    },
    statLabel: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      textAlign: 'center',
      marginTop: spacing.xs,
    },
  });

  const styles = getStyles();

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {language === 'hi' ? 'खेत प्रबंधन' : 'Field Management'}
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddField(true)}
          >
            <Ionicons name="add" size={24} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Statistics */}
        <View style={styles.section}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{fields.length}</Text>
              <Text style={styles.statLabel}>
                {language === 'hi' ? 'कुल खेत' : 'Total Fields'}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {fields.reduce((sum, field) => sum + parseFloat(field.area), 0).toFixed(1)}
              </Text>
              <Text style={styles.statLabel}>
                {language === 'hi' ? 'कुल एकड़' : 'Total Acres'}
              </Text>
            </View>
          </View>
        </View>

        {/* Fields Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {language === 'hi' ? 'मेरे खेत' : 'My Fields'}
            </Text>
          </View>

          {fields.map((field) => (
            <View key={field.id} style={styles.fieldCard}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldName}>{field.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(field.status) }]}>
                  <Text style={styles.statusText}>{field.status}</Text>
                </View>
              </View>

              <View style={styles.fieldInfo}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>
                    {language === 'hi' ? 'फसल' : 'Crop'}
                  </Text>
                  <Text style={styles.infoValue}>{field.crop}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>
                    {language === 'hi' ? 'क्षेत्रफल' : 'Area'}
                  </Text>
                  <Text style={styles.infoValue}>{field.area}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>
                    {language === 'hi' ? 'मिट्टी का प्रकार' : 'Soil Type'}
                  </Text>
                  <Text style={styles.infoValue}>{field.soilType}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>
                    {language === 'hi' ? 'अंतिम सिंचाई' : 'Last Watered'}
                  </Text>
                  <Text style={styles.infoValue}>{field.lastWatered}</Text>
                </View>
              </View>

              <View style={styles.fieldActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('SoilAnalysis')}
                >
                  <Ionicons name="analytics" size={16} color={colors.primary} />
                  <Text style={styles.actionButtonText}>
                    {language === 'hi' ? 'विश्लेषण' : 'Analyze'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonPrimary]}
                  onPress={() => navigation.navigate('WaterSchedule')}
                >
                  <Ionicons name="water" size={16} color={colors.surface} />
                  <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>
                    {language === 'hi' ? 'सिंचाई' : 'Water'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Activities Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {language === 'hi' ? 'आगामी गतिविधियां' : 'Upcoming Activities'}
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>
                {language === 'hi' ? 'सभी देखें' : 'See All'}
              </Text>
            </TouchableOpacity>
          </View>

          {activities.map((activity) => {
            const field = fields.find(f => f.id === activity.fieldId);
            return (
              <View key={activity.id} style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <View style={[
                    styles.activityIcon,
                    { backgroundColor: getActivityStatusColor(activity.status) + '20' }
                  ]}>
                    <Ionicons
                      name={getActivityIcon(activity.type)}
                      size={16}
                      color={getActivityStatusColor(activity.status)}
                    />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </Text>
                    <Text style={styles.activityField}>{field?.name}</Text>
                  </View>
                  <Text style={styles.activityDate}>{activity.date}</Text>
                </View>
                <Text style={styles.activityDescription}>{activity.description}</Text>
                {activity.status === 'pending' && (
                  <View style={styles.activityActions}>
                    <TouchableOpacity
                      style={styles.completeButton}
                      onPress={() => markActivityComplete(activity.id)}
                    >
                      <Text style={styles.completeButtonText}>
                        {language === 'hi' ? 'पूर्ण' : 'Complete'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Add Field Modal */}
      <Modal
        visible={showAddField}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddField(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {language === 'hi' ? 'नया खेत जोड़ें' : 'Add New Field'}
            </Text>
            
            <ScrollView>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {language === 'hi' ? 'खेत का नाम *' : 'Field Name *'}
                </Text>
                <TextInput
                  style={styles.input}
                  value={newField.name}
                  onChangeText={(text) => setNewField({ ...newField, name: text })}
                  placeholder={language === 'hi' ? 'खेत का नाम दर्ज करें' : 'Enter field name'}
                  placeholderTextColor={colors.text.hint}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {language === 'hi' ? 'फसल *' : 'Crop *'}
                </Text>
                <TextInput
                  style={styles.input}
                  value={newField.crop}
                  onChangeText={(text) => setNewField({ ...newField, crop: text })}
                  placeholder={language === 'hi' ? 'फसल का नाम दर्ज करें' : 'Enter crop name'}
                  placeholderTextColor={colors.text.hint}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {language === 'hi' ? 'क्षेत्रफल (एकड़) *' : 'Area (acres) *'}
                </Text>
                <TextInput
                  style={styles.input}
                  value={newField.area}
                  onChangeText={(text) => setNewField({ ...newField, area: text })}
                  placeholder={language === 'hi' ? 'एकड़ में क्षेत्रफल' : 'Area in acres'}
                  placeholderTextColor={colors.text.hint}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {language === 'hi' ? 'मिट्टी का प्रकार' : 'Soil Type'}
                </Text>
                <TextInput
                  style={styles.input}
                  value={newField.soilType}
                  onChangeText={(text) => setNewField({ ...newField, soilType: text })}
                  placeholder={language === 'hi' ? 'मिट्टी का प्रकार' : 'e.g., Loamy, Clay, Sandy'}
                  placeholderTextColor={colors.text.hint}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <CustomButton
                title={language === 'hi' ? 'रद्द करें' : 'Cancel'}
                variant="outline"
                onPress={() => setShowAddField(false)}
                buttonStyle={styles.modalButton}
              />
              <CustomButton
                title={language === 'hi' ? 'जोड़ें' : 'Add Field'}
                onPress={handleAddField}
                buttonStyle={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FieldManagementScreen;
