import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface PrivacySecurityScreenProps {
  navigation: any;
}

interface PrivacyItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  type: 'toggle' | 'action' | 'info';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  isDestructive?: boolean;
}

interface PrivacySection {
  title: string;
  items: PrivacyItem[];
}

const PrivacySecurityScreen: React.FC<PrivacySecurityScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  // Dummy privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    twoFactorAuth: true,
    biometricLogin: false,
    locationSharing: true,
    dataCollection: false,
    marketingEmails: true,
    analyticsSharing: false,
    autoLogout: true,
    deviceTracking: false,
  });

  const updateSetting = (key: string, value: boolean) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const privacySections: PrivacySection[] = [
    {
      title: 'Security',
      items: [
        {
          id: 'password',
          title: 'Change Password',
          subtitle: 'Last changed 30 days ago',
          icon: 'lock-closed',
          type: 'action',
          onPress: () => Alert.alert('Change Password', 'This would open password change form'),
        },
        {
          id: 'twoFactor',
          title: 'Two-Factor Authentication',
          subtitle: 'Add an extra layer of security',
          icon: 'shield-checkmark',
          type: 'toggle',
          value: privacySettings.twoFactorAuth,
          onToggle: (value) => updateSetting('twoFactorAuth', value),
        },
        {
          id: 'biometric',
          title: 'Biometric Login',
          subtitle: 'Use fingerprint or face ID',
          icon: 'finger-print',
          type: 'toggle',
          value: privacySettings.biometricLogin,
          onToggle: (value) => updateSetting('biometricLogin', value),
        },
        {
          id: 'autoLogout',
          title: 'Auto Logout',
          subtitle: 'Automatically log out after inactivity',
          icon: 'timer',
          type: 'toggle',
          value: privacySettings.autoLogout,
          onToggle: (value) => updateSetting('autoLogout', value),
        },
        {
          id: 'sessions',
          title: 'Active Sessions',
          subtitle: 'Manage logged in devices',
          icon: 'phone-portrait',
          type: 'action',
          onPress: () => Alert.alert('Active Sessions', '3 active sessions found:\n• iPhone 12 Pro (Current)\n• MacBook Pro\n• iPad Air'),
        },
      ]
    },
    {
      title: 'Privacy',
      items: [
        {
          id: 'location',
          title: 'Location Sharing',
          subtitle: 'Share location for weather data',
          icon: 'location',
          type: 'toggle',
          value: privacySettings.locationSharing,
          onToggle: (value) => updateSetting('locationSharing', value),
        },
        {
          id: 'dataCollection',
          title: 'Data Collection',
          subtitle: 'Allow collection of usage data',
          icon: 'analytics',
          type: 'toggle',
          value: privacySettings.dataCollection,
          onToggle: (value) => updateSetting('dataCollection', value),
        },
        {
          id: 'marketing',
          title: 'Marketing Emails',
          subtitle: 'Receive promotional emails',
          icon: 'mail',
          type: 'toggle',
          value: privacySettings.marketingEmails,
          onToggle: (value) => updateSetting('marketingEmails', value),
        },
        {
          id: 'analytics',
          title: 'Analytics Sharing',
          subtitle: 'Share app usage analytics',
          icon: 'bar-chart',
          type: 'toggle',
          value: privacySettings.analyticsSharing,
          onToggle: (value) => updateSetting('analyticsSharing', value),
        },
        {
          id: 'tracking',
          title: 'Device Tracking',
          subtitle: 'Allow app to track across devices',
          icon: 'phone-portrait',
          type: 'toggle',
          value: privacySettings.deviceTracking,
          onToggle: (value) => updateSetting('deviceTracking', value),
        },
      ]
    },
    {
      title: 'Data Management',
      items: [
        {
          id: 'download',
          title: 'Download My Data',
          subtitle: 'Get a copy of your data',
          icon: 'download',
          type: 'action',
          onPress: () => Alert.alert('Download Data', 'Your data export will be emailed to you within 24 hours.'),
        },
        {
          id: 'backup',
          title: 'Backup Settings',
          subtitle: 'Last backup: Yesterday',
          icon: 'cloud-upload',
          type: 'action',
          onPress: () => Alert.alert('Backup', 'Settings backed up successfully!'),
        },
        {
          id: 'clear',
          title: 'Clear Cache',
          subtitle: 'Free up storage space',
          icon: 'trash',
          type: 'action',
          onPress: () => Alert.alert('Clear Cache', 'Cache cleared successfully! (47.3 MB freed)'),
        },
      ]
    },
    {
      title: 'Account Actions',
      items: [
        {
          id: 'deactivate',
          title: 'Deactivate Account',
          subtitle: 'Temporarily disable your account',
          icon: 'pause-circle',
          type: 'action',
          isDestructive: true,
          onPress: () => Alert.alert(
            'Deactivate Account',
            'This will temporarily disable your account. You can reactivate it by logging in again.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Deactivate', style: 'destructive' }
            ]
          ),
        },
        {
          id: 'delete',
          title: 'Delete Account',
          subtitle: 'Permanently delete your account',
          icon: 'trash',
          type: 'action',
          isDestructive: true,
          onPress: () => Alert.alert(
            'Delete Account',
            'This action cannot be undone. All your data will be permanently deleted.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive' }
            ]
          ),
        },
      ]
    }
  ];

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
    placeholder: {
      width: 40,
    },
    content: {
      flex: 1,
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionHeader: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    sectionTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.secondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    itemContainer: {
      backgroundColor: colors.surface,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.xs,
      borderRadius: borderRadius.md,
      elevation: 1,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.lg,
    },
    itemIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    itemContent: {
      flex: 1,
    },
    itemTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
      marginBottom: spacing.xs / 2,
    },
    itemSubtitle: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    itemAction: {
      marginLeft: spacing.md,
    },
    destructiveTitle: {
      color: colors.error,
    },
    destructiveIcon: {
      backgroundColor: colors.error + '20',
    },
    infoCard: {
      backgroundColor: colors.primaryLight + '20',
      margin: spacing.lg,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    infoTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.primary,
      marginBottom: spacing.xs,
    },
    infoText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      lineHeight: 20,
    },
  });

  const styles = getStyles();

  const renderItem = (item: PrivacyItem) => {
    return (
      <View key={item.id} style={styles.itemContainer}>
        <TouchableOpacity
          style={styles.item}
          onPress={item.onPress}
          disabled={item.type === 'toggle'}
        >
          <View style={[styles.itemIcon, item.isDestructive && styles.destructiveIcon]}>
            <Ionicons
              name={item.icon as keyof typeof Ionicons.glyphMap}
              size={20}
              color={item.isDestructive ? colors.error : colors.text.secondary}
            />
          </View>
          <View style={styles.itemContent}>
            <Text style={[styles.itemTitle, item.isDestructive && styles.destructiveTitle]}>
              {item.title}
            </Text>
            <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
          </View>
          <View style={styles.itemAction}>
            {item.type === 'toggle' ? (
              <Switch
                value={item.value}
                onValueChange={item.onToggle}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={item.value ? colors.primary : colors.text.hint}
              />
            ) : (
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.text.hint}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

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
          <Text style={styles.headerTitle}>Privacy & Security</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🔒 Your Privacy Matters</Text>
          <Text style={styles.infoText}>
            We're committed to protecting your privacy and securing your data. 
            Review and customize your privacy settings below to control how your information is used.
          </Text>
        </View>

        {privacySections.map((section, index) => (
          <View key={index} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            {section.items.map(renderItem)}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default PrivacySecurityScreen;
