import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface ThemeToggleProps {
  variant?: 'switch' | 'button' | 'inline';
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'switch', 
  showLabel = true 
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  if (variant === 'inline') {
    return (
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        trackColor={{
          false: theme.colors.border,
          true: theme.colors.primaryLight,
        }}
        thumbColor={isDark ? theme.colors.primary : theme.colors.text.hint}
        ios_backgroundColor={theme.colors.border}
      />
    );
  }

  if (variant === 'button') {
    return (
      <TouchableOpacity
        style={[styles.buttonContainer, { backgroundColor: theme.colors.surface }]}
        onPress={toggleTheme}
        activeOpacity={0.7}
      >
        <View style={styles.buttonContent}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
            <Ionicons
              name={isDark ? "moon" : "sunny"}
              size={20}
              color={theme.colors.text.inverse}
            />
          </View>
          {showLabel && (
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: theme.colors.text.primary }]}>
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
                {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              </Text>
            </View>
          )}
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.text.hint}
          />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.switchContainer, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.switchContent}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
          <Ionicons
            name={isDark ? "moon" : "sunny"}
            size={20}
            color={theme.colors.text.inverse}
          />
        </View>
        {showLabel && (
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>
              Dark Mode
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
              {isDark ? 'Dark theme enabled' : 'Light theme enabled'}
            </Text>
          </View>
        )}
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{
            false: theme.colors.border,
            true: theme.colors.primaryLight,
          }}
          thumbColor={isDark ? theme.colors.primary : theme.colors.surface}
          ios_backgroundColor={theme.colors.border}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: borderRadius.lg,
    marginVertical: spacing.xs,
    elevation: 1,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  switchContainer: {
    borderRadius: borderRadius.lg,
    marginVertical: spacing.xs,
    elevation: 1,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  switchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.sm,
  },
});

export default ThemeToggle;
