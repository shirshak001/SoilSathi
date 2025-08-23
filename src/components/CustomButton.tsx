import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  buttonStyle,
  textStyle,
  disabled,
  ...props
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const getButtonHeight = () => {
    switch (size) {
      case 'small':
        return 36;
      case 'large':
        return 56;
      default:
        return 48;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return fontSize.sm;
      case 'large':
        return fontSize.lg;
      default:
        return fontSize.md;
    }
  };

  const isDisabled = disabled || loading;

  const getButtonStyles = () => [
    {
      height: getButtonHeight(),
      borderRadius: borderRadius.md,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      flexDirection: 'row' as const,
      paddingHorizontal: spacing.lg,
      backgroundColor: colors.primary,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      ...(fullWidth && { width: '100%' as const }),
    },
    variant === 'outline' && {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: colors.primary,
      elevation: 0,
      shadowOpacity: 0,
    },
    variant === 'secondary' && {
      backgroundColor: colors.secondary,
    },
    isDisabled && {
      backgroundColor: colors.border,
      elevation: 0,
      shadowOpacity: 0,
    },
    buttonStyle,
  ];

  const getTextStyles = () => [
    {
      fontSize: getTextSize(),
      fontWeight: fontWeight.semibold,
      color: colors.surface,
      textAlign: 'center' as const,
    },
    variant === 'outline' && {
      color: colors.primary,
    },
    variant === 'secondary' && {
      color: colors.surface,
    },
    isDisabled && {
      color: colors.text.disabled,
    },
    textStyle,
  ];

  const ButtonContent = () => (
    <>
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? colors.primary : colors.surface}
          style={{ marginRight: spacing.sm }}
        />
      )}
      <Text style={getTextStyles()}>{title}</Text>
    </>
  );

  if (variant === 'primary' && !isDisabled) {
    return (
      <TouchableOpacity {...props} disabled={isDisabled} style={getButtonStyles()}>
        <LinearGradient
          colors={[colors.primary, colors.primary]}
          style={{
            flex: 1,
            borderRadius: borderRadius.md,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: spacing.lg,
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <ButtonContent />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity {...props} disabled={isDisabled} style={getButtonStyles()}>
      <ButtonContent />
    </TouchableOpacity>
  );
};

export default CustomButton;
