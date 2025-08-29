import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage, supportedLanguages, LanguageOption } from '../contexts/LanguageContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface LanguageSelectorProps {
  showButton?: boolean;
  style?: any;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  showButton = true,
  style 
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { language, setLanguage, translations } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLanguage = supportedLanguages.find(lang => lang.code === language);

  const handleLanguageSelect = (languageCode: string) => {
    setLanguage(languageCode as any);
    setModalVisible(false);
  };

  const getStyles = () => StyleSheet.create({
    container: {
      flex: 1,
    },
    selectorButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      borderWidth: 3,
      borderColor: colors.border,
    },
    flagText: {
      fontSize: fontSize.lg,
      marginRight: spacing.sm,
    },
    languageText: {
      flex: 1,
      fontSize: fontSize.md,
      color: colors.text.primary,
      fontWeight: fontWeight.medium,
    },
    chevronIcon: {
      marginLeft: spacing.sm,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      margin: spacing.lg,
      maxHeight: '80%',
      width: '90%',
      elevation: 10,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.3,
      shadowRadius: 10,
    },
    modalHeader: {
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    languageList: {
      maxHeight: 400,
    },
    languageItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    selectedLanguageItem: {
      backgroundColor: colors.primaryLight + '20',
    },
    languageFlag: {
      fontSize: fontSize.xl,
      marginRight: spacing.md,
    },
    languageInfo: {
      flex: 1,
    },
    languageName: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
    },
    languageNative: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.xs / 2,
    },
    checkIcon: {
      marginLeft: spacing.sm,
    },
    modalFooter: {
      padding: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    closeButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
    },
    closeButtonText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.surface,
    },
    inlineSelector: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xs,
    },
    inlineLanguageInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    inlineLanguageText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
      fontWeight: fontWeight.normal,
    },
  });

  const styles = getStyles();

  const renderLanguageItem = (lang: LanguageOption) => {
    const isSelected = lang.code === language;
    
    return (
      <TouchableOpacity
        key={lang.code}
        style={[styles.languageItem, isSelected && styles.selectedLanguageItem]}
        onPress={() => handleLanguageSelect(lang.code)}
      >
        <Text style={styles.languageFlag}>{lang.flag}</Text>
        <View style={styles.languageInfo}>
          <Text style={styles.languageName}>{lang.name}</Text>
          <Text style={styles.languageNative}>{lang.nativeName}</Text>
        </View>
        {isSelected && (
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={colors.primary}
            style={styles.checkIcon}
          />
        )}
      </TouchableOpacity>
    );
  };

  if (!showButton) {
    // Inline selector for settings page
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.inlineSelector}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.text.hint}
          />
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {translations.settings.language}
                </Text>
              </View>
              
              <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
                {supportedLanguages.map(renderLanguageItem)}
              </ScrollView>
              
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>
                    {translations.common.done}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Full button selector
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.flagText}>{currentLanguage?.flag}</Text>
        <Text style={styles.languageText}>{currentLanguage?.nativeName}</Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={colors.text.hint}
          style={styles.chevronIcon}
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {translations.settings.language}
              </Text>
            </View>
            
            <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
              {supportedLanguages.map(renderLanguageItem)}
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>
                  {translations.common.done}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LanguageSelector;
