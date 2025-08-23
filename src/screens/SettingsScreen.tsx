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
import { useLanguage, supportedLanguages } from '../contexts/LanguageContext';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { translations, language } = useLanguage();
  
  const [notifications, setNotifications] = useState(true);
  const [autoWatering, setAutoWatering] = useState(false);
  const [weatherAlerts, setWeatherAlerts] = useState(true);

  // Get current language info
  const currentLanguage = supportedLanguages.find(lang => lang.code === language);

  const settingsItems = [
    {
      category: translations.settings.account,
      items: [
        {
          icon: 'person',
          title: translations.settings.profileInfo,
          subtitle: translations.settings.updateDetails,
          onPress: () => navigation.navigate('Profile'),
        },
        {
          icon: 'shield-checkmark',
          title: translations.settings.privacySec,
          subtitle: translations.settings.managePrivacy,
          onPress: () => navigation.navigate('PrivacySecurity'),
        },
        {
          icon: 'card',
          title: translations.settings.paymentMethods,
          subtitle: translations.settings.managePayments,
          onPress: () => navigation.navigate('PaymentMethods'),
        },
      ]
    },
    {
      category: translations.settings.notifications,
      items: [
        {
          icon: 'notifications',
          title: translations.settings.pushNotifications,
          subtitle: translations.settings.importantUpdates,
          hasSwitch: true,
          value: notifications,
          onToggle: setNotifications,
        },
        {
          icon: 'cloud-done',
          title: translations.settings.weatherAlerts,
          subtitle: translations.settings.weatherNotifications,
          hasSwitch: true,
          value: weatherAlerts,
          onToggle: setWeatherAlerts,
        },
      ]
    },
    {
      category: translations.settings.automation,
      items: [
        {
          icon: 'water',
          title: translations.settings.autoWatering,
          subtitle: translations.settings.automaticWatering,
          hasSwitch: true,
          value: autoWatering,
          onToggle: setAutoWatering,
        },
        {
          icon: 'analytics',
          title: translations.settings.smartMonitoring,
          subtitle: translations.settings.aiMonitoring,
          onPress: () => Alert.alert(translations.messages.comingSoon, translations.messages.featureAvailable),
        },
      ]
    },
    {
      category: translations.settings.preferences,
      items: [
        {
          icon: 'language',
          title: translations.settings.language,
          subtitle: `${currentLanguage?.name || 'English'} (${currentLanguage?.nativeName || 'English'})`,
          hasLanguageSelector: true,
        },
        {
          icon: 'location',
          title: translations.settings.locationServices,
          subtitle: translations.settings.weatherLocation,
          onPress: () => Alert.alert(translations.messages.comingSoon, translations.messages.featureAvailable),
        },
        {
          icon: 'contrast',
          title: translations.settings.appearance,
          subtitle: translations.settings.theme,
          hasThemeToggle: true,
        },
      ]
    },
    {
      category: translations.settings.support,
      items: [
        {
          icon: 'help-circle',
          title: translations.settings.helpFaq,
          subtitle: translations.settings.getHelp,
          onPress: () => Alert.alert('Help', 'For support, please contact us at support@soilsathi.com'),
        },
        {
          icon: 'chatbubble',
          title: translations.settings.contactSupport,
          subtitle: translations.settings.reachTeam,
          onPress: () => Alert.alert('Contact', 'Email: support@soilsathi.com\nPhone: +1-234-567-8900'),
        },
        {
          icon: 'star',
          title: translations.settings.rateApp,
          subtitle: translations.settings.shareFeeback,
          onPress: () => Alert.alert('Thank You!', 'Your feedback helps us improve'),
        },
        {
          icon: 'information-circle',
          title: translations.settings.about,
          subtitle: translations.settings.appVersion,
          onPress: () => Alert.alert('SoilSathi', 'Version 1.0.0\nYour smart agriculture companion'),
        },
      ]
    },
    {
      category: translations.settings.accountActions,
      items: [
        {
          icon: 'log-out',
          title: translations.settings.signOut,
          subtitle: translations.settings.logOut,
          onPress: () => {
            Alert.alert(
              translations.settings.signOut,
              translations.messages.confirmSignOut,
              [
                { text: translations.common.cancel, style: 'cancel' },
                { 
                  text: translations.settings.signOut, 
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

  const styles = getStyles();

  const renderSettingItem = (item: any) => (
    <TouchableOpacity
      key={item.title}
      style={styles.settingItem}
      onPress={item.hasLanguageSelector || item.hasThemeToggle ? undefined : item.onPress}
      disabled={item.hasSwitch}
      activeOpacity={item.hasLanguageSelector || item.hasThemeToggle || item.hasSwitch ? 1 : 0.7}
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
      ) : item.hasLanguageSelector ? (
        <LanguageSelector showButton={false} />
      ) : item.hasThemeToggle ? (
        <ThemeToggle variant="inline" />
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
          <Text style={styles.headerTitle}>{translations.settings.title}</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>        
        {settingsItems.map(renderCategory)}
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
