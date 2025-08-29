import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface Field {
  id: string;
  name: string;
  crop: string;
  status: 'healthy' | 'warning' | 'critical';
}

interface FieldSummaryProps {
  onPress: () => void;
}

const { width } = Dimensions.get('window');

const FieldSummary: React.FC<FieldSummaryProps> = ({ onPress }) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const colors = theme.colors;

  // Mock field data - in real app this would come from props or state
  const fields: Field[] = [
    { id: '1', name: 'North Field', crop: 'Wheat', status: 'healthy' },
    { id: '2', name: 'South Field', crop: 'Rice', status: 'warning' },
    { id: '3', name: 'East Field', crop: 'Corn', status: 'healthy' },
  ];

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'checkmark-circle';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'alert-circle';
      default:
        return 'help-circle';
    }
  };

  const healthyFields = fields.filter(f => f.status === 'healthy').length;
  const warningFields = fields.filter(f => f.status === 'warning').length;
  const criticalFields = fields.filter(f => f.status === 'critical').length;

  const getStyles = () => StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      margin: spacing.md,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.lg,
      paddingBottom: spacing.md,
    },
    title: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    manageButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      backgroundColor: colors.primary + '20',
    },
    manageButtonText: {
      fontSize: fontSize.sm,
      color: colors.primary,
      fontWeight: fontWeight.medium,
      marginLeft: spacing.xs,
    },
    summaryContainer: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
    },
    summaryGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    summaryItem: {
      alignItems: 'center',
      flex: 1,
    },
    summaryValue: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      marginBottom: spacing.xs,
    },
    summaryLabel: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    fieldsPreview: {
      gap: spacing.xs,
    },
    fieldItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.xs,
    },
    fieldStatus: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: spacing.sm,
    },
    fieldInfo: {
      flex: 1,
    },
    fieldName: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
    },
    fieldCrop: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      marginTop: spacing.xs / 2,
    },
    viewAllButton: {
      alignSelf: 'center',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      marginTop: spacing.sm,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    viewAllText: {
      fontSize: fontSize.sm,
      color: colors.primary,
      fontWeight: fontWeight.medium,
    },
  });

  const styles = getStyles();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === 'hi' ? 'खेत सारांश' : 'Field Summary'}
        </Text>
        <TouchableOpacity style={styles.manageButton} onPress={onPress}>
          <Ionicons name="settings" size={14} color={colors.primary} />
          <Text style={styles.manageButtonText}>
            {language === 'hi' ? 'प्रबंधन' : 'Manage'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Summary Stats */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: colors.text.primary }]}>
              {fields.length}
            </Text>
            <Text style={styles.summaryLabel}>
              {language === 'hi' ? 'कुल खेत' : 'Total\nFields'}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: colors.success }]}>
              {healthyFields}
            </Text>
            <Text style={styles.summaryLabel}>
              {language === 'hi' ? 'स्वस्थ' : 'Healthy'}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: colors.warning }]}>
              {warningFields}
            </Text>
            <Text style={styles.summaryLabel}>
              {language === 'hi' ? 'चेतावनी' : 'Warning'}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: colors.error }]}>
              {criticalFields}
            </Text>
            <Text style={styles.summaryLabel}>
              {language === 'hi' ? 'गंभीर' : 'Critical'}
            </Text>
          </View>
        </View>

        {/* Field Preview */}
        <View style={styles.fieldsPreview}>
          {fields.slice(0, 3).map((field) => (
            <View key={field.id} style={styles.fieldItem}>
              <View
                style={[
                  styles.fieldStatus,
                  { backgroundColor: getStatusColor(field.status) }
                ]}
              />
              <View style={styles.fieldInfo}>
                <Text style={styles.fieldName}>{field.name}</Text>
                <Text style={styles.fieldCrop}>{field.crop}</Text>
              </View>
              <Ionicons
                name={getStatusIcon(field.status)}
                size={16}
                color={getStatusColor(field.status)}
              />
            </View>
          ))}
        </View>

        {/* View All Button */}
        <TouchableOpacity style={styles.viewAllButton} onPress={onPress}>
          <Text style={styles.viewAllText}>
            {language === 'hi' ? 'सभी खेत देखें' : 'View All Fields'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FieldSummary;
