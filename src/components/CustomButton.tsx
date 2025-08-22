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
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

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

  const buttonStyles = [
    styles.button,
    {
      height: getButtonHeight(),
      ...(fullWidth && { width: '100%' as const }),
    },
    variant === 'outline' && styles.outlineButton,
    variant === 'secondary' && styles.secondaryButton,
    isDisabled && styles.disabledButton,
    buttonStyle,
  ];

  const textStyles = [
    styles.text,
    {
      fontSize: getTextSize(),
    },
    variant === 'outline' && styles.outlineText,
    variant === 'secondary' && styles.secondaryText,
    isDisabled && styles.disabledText,
    textStyle,
  ];

  const ButtonContent = () => (
    <>
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? colors.primary : colors.surface}
          style={styles.loader}
        />
      )}
      <Text style={textStyles}>{title}</Text>
    </>
  );

  if (variant === 'primary' && !isDisabled) {
    return (
      <TouchableOpacity {...props} disabled={isDisabled} style={buttonStyles}>
        <LinearGradient
          colors={[colors.primaryLight, colors.primary]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <ButtonContent />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity {...props} disabled={isDisabled} style={buttonStyles}>
      <ButtonContent />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
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
  },
  gradient: {
    flex: 1,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    elevation: 0,
    shadowOpacity: 0,
  },
  disabledButton: {
    backgroundColor: colors.border,
    elevation: 0,
    shadowOpacity: 0,
  },
  text: {
    fontWeight: fontWeight.semibold,
    color: colors.surface,
    textAlign: 'center',
  },
  secondaryText: {
    color: colors.surface,
  },
  outlineText: {
    color: colors.primary,
  },
  disabledText: {
    color: colors.text.disabled,
  },
  loader: {
    marginRight: spacing.sm,
  },
});

export default CustomButton;
