export const colors = {
  primary: '#2E7D32',      // Dark green
  primaryLight: '#4CAF50', // Medium green
  primaryDark: '#1B5E20',  // Very dark green
  secondary: '#66BB6A',    // Light green
  accent: '#81C784',       // Accent green
  background: '#F1F8E9',   // Very light green background
  surface: '#FFFFFF',      // White surface
  error: '#F44336',        // Red for errors
  warning: '#FF9800',      // Orange for warnings
  success: '#4CAF50',      // Green for success
  text: {
    primary: '#1B5E20',    // Dark green text
    secondary: '#388E3C',  // Medium green text
    hint: '#81C784',       // Light green hint text
    disabled: '#C8E6C9',   // Very light green disabled text
  },
  border: '#C8E6C9',       // Light green border
  placeholder: '#A5D6A7',  // Placeholder text color
  shadow: 'rgba(46, 125, 50, 0.1)', // Green shadow
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  title: 28,
  heading: 32,
};

export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
