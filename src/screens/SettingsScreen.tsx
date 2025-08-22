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
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [notifications, setNotifications] = useState(true);
  const [autoWatering, setAutoWatering] = useState(false);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingsItems = [
    {
      category: 'Account',
      items: [
        {
          icon: 'person',
          title: 'Profile Information',
          subtitle: 'Update your personal details',
          onPress: () => Alert.alert('Coming Soon', 'Profile settings will be available soon'),
        },
        {
          icon: 'shield-checkmark',
          title: 'Privacy & Security',
          subtitle: 'Manage your privacy settings',
          onPress: () => Alert.alert('Coming Soon', 'Privacy settings will be available soon'),
        },
        {
          icon: 'card',
          title: 'Payment Methods',
          subtitle: 'Manage payment options',
          onPress: () => Alert.alert('Coming Soon', 'Payment settings will be available soon'),
        },
      ]
    },
    {
      category: 'Notifications',
      items: [
        {
          icon: 'notifications',
          title: 'Push Notifications',
          subtitle: 'Receive important updates',
          hasSwitch: true,
          value: notifications,
          onToggle: setNotifications,
        },
        {
          icon: 'cloud-done',
          title: 'Weather Alerts',
          subtitle: 'Get weather notifications',
          hasSwitch: true,
          value: weatherAlerts,
          onToggle: setWeatherAlerts,
        },
      ]
    },
    {
      category: 'Automation',
      items: [
        {
          icon: 'water',
          title: 'Auto Watering',
          subtitle: 'Enable automatic watering system',
          hasSwitch: true,
          value: autoWatering,
          onToggle: setAutoWatering,
        },
        {
          icon: 'analytics',
          title: 'Smart Monitoring',
          subtitle: 'AI-powered plant monitoring',
          onPress: () => Alert.alert('Coming Soon', 'Smart monitoring settings will be available soon'),
        },
      ]
    },
    {
      category: 'App Preferences',
      items: [
        {
          icon: 'moon',
          title: 'Dark Mode',
          subtitle: 'Switch to dark theme',
          hasSwitch: true,
          value: darkMode,
          onToggle: setDarkMode,
        },
        {
          icon: 'language',
          title: 'Language',
          subtitle: 'English (US)',
          onPress: () => Alert.alert('Coming Soon', 'Language settings will be available soon'),
        },
        {
          icon: 'location',
          title: 'Location Services',
          subtitle: 'Enable location for weather data',
          onPress: () => Alert.alert('Coming Soon', 'Location settings will be available soon'),
        },
      ]
    },
    {
      category: 'Support',
      items: [
        {
          icon: 'help-circle',
          title: 'Help & FAQ',
          subtitle: 'Get help and support',
          onPress: () => Alert.alert('Help', 'For support, please contact us at support@soilsathi.com'),
        },
        {
          icon: 'chatbubble',
          title: 'Contact Support',
          subtitle: 'Reach out to our team',
          onPress: () => Alert.alert('Contact', 'Email: support@soilsathi.com\nPhone: +1-234-567-8900'),
        },
        {
          icon: 'star',
          title: 'Rate the App',
          subtitle: 'Share your feedback',
          onPress: () => Alert.alert('Thank You!', 'Your feedback helps us improve'),
        },
        {
          icon: 'information-circle',
          title: 'About',
          subtitle: 'App version and info',
          onPress: () => Alert.alert('SoilSathi', 'Version 1.0.0\nYour smart agriculture companion'),
        },
      ]
    },
    {
      category: 'Account Actions',
      items: [
        {
          icon: 'log-out',
          title: 'Sign Out',
          subtitle: 'Log out of your account',
          onPress: () => {
            Alert.alert(
              'Sign Out',
              'Are you sure you want to sign out?',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Sign Out', 
                  style: 'destructive',
                  onPress: () => navigation.navigate('Login')
                }
              ]
            );
          },
          isDestructive: true,
        },
      ]
    }
  ];

  const renderSettingItem = (item: any) => (
    <TouchableOpacity
      key={item.title}
      style={styles.settingItem}
      onPress={item.onPress}
      disabled={item.hasSwitch}
    >
      <View style={styles.settingIcon}>
        <Ionicons 
          name={item.icon} 
          size={24} 
          color={item.isDestructive ? colors.error : colors.primary} 
        />
      </View>
      <View style={styles.settingContent}>
        <Text style={[
          styles.settingTitle,
          item.isDestructive && { color: colors.error }
        ]}>
          {item.title}
        </Text>
        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
      </View>
      {item.hasSwitch ? (
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          trackColor={{ false: colors.border, true: colors.primaryLight }}
          thumbColor={item.value ? colors.primary : colors.text.hint}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.text.hint} />
      )}
    </TouchableOpacity>
  );

  const renderCategory = (category: any) => (
    <View key={category.category} style={styles.category}>
      <Text style={styles.categoryTitle}>{category.category}</Text>
      <View style={styles.categoryItems}>
        {category.items.map(renderSettingItem)}
      </View>
    </View>
  );

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
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingsItems.map(renderCategory)}
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  category: {
    marginBottom: spacing.xl,
  },
  categoryTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  categoryItems: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  settingSubtitle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs / 2,
  },
});

export default SettingsScreen;
