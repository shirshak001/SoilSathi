import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import CustomButton from '../components/CustomButton';

interface UserTypeSelectionScreenProps {
  navigation: any;
}

type UserType = 'farmer' | 'gardener' | null;

const { width } = Dimensions.get('window');

const UserTypeSelectionScreen: React.FC<UserTypeSelectionScreenProps> = ({ navigation }) => {
  const [selectedUserType, setSelectedUserType] = useState<UserType>(null);

  const userTypes = [
    {
      id: 'farmer',
      title: 'Farmer',
      description: 'Large-scale agricultural irrigation management',
      icon: 'leaf',
      features: [
        'Multi-field management',
        'Crop rotation planning',
        'Weather integration',
        'Yield optimization'
      ]
    },
    {
      id: 'gardener',
      title: 'Gardener',
      description: 'Home garden and small-scale irrigation',
      icon: 'flower',
      features: [
        'Garden zone control',
        'Plant care reminders',
        'Seasonal planning',
        'Water conservation'
      ]
    }
  ];

  const handleContinue = () => {
    if (selectedUserType === 'farmer') {
      navigation.navigate('FarmerDashboard');
    } else if (selectedUserType === 'gardener') {
      navigation.navigate('GardenerDashboard');
    }
  };

  const renderUserTypeCard = (userType: typeof userTypes[0]) => {
    const isSelected = selectedUserType === userType.id;
    
    return (
      <TouchableOpacity
        key={userType.id}
        style={[
          styles.userTypeCard,
          isSelected && styles.selectedCard
        ]}
        onPress={() => setSelectedUserType(userType.id as UserType)}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          <View style={[
            styles.iconContainer,
            isSelected && styles.selectedIconContainer
          ]}>
            <Ionicons
              name={userType.icon as keyof typeof Ionicons.glyphMap}
              size={40}
              color={isSelected ? colors.surface : colors.primary}
            />
          </View>
          
          <Text style={[
            styles.cardTitle,
            isSelected && styles.selectedCardTitle
          ]}>
            {userType.title}
          </Text>
          
          <Text style={[
            styles.cardDescription,
            isSelected && styles.selectedCardDescription
          ]}>
            {userType.description}
          </Text>
          
          <View style={styles.featuresContainer}>
            {userType.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={isSelected ? colors.surface : colors.primary}
                />
                <Text style={[
                  styles.featureText,
                  isSelected && styles.selectedFeatureText
                ]}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Ionicons name="checkmark-circle" size={24} color={colors.surface} />
          </View>
        )}
      </TouchableOpacity>
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
          <View style={styles.logoContainer}>
            <Ionicons name="leaf" size={32} color={colors.surface} />
            <Text style={styles.appName}>SoilSathi</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.title}>Choose Your Profile</Text>
        <Text style={styles.subtitle}>
          Select the option that best describes your irrigation needs
        </Text>

        <View style={styles.cardsContainer}>
          {userTypes.map(renderUserTypeCard)}
        </View>

        <CustomButton
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedUserType}
          fullWidth
          style={styles.continueButton}
        />
        
        <TouchableOpacity
          style={styles.skipContainer}
          onPress={() => navigation.navigate('FarmerDashboard')} // Default to farmer for now
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.surface,
    marginLeft: spacing.sm,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  cardsContainer: {
    flex: 1,
    gap: spacing.md,
  },
  userTypeCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  cardContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  selectedIconContainer: {
    backgroundColor: colors.primaryDark,
  },
  cardTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  selectedCardTitle: {
    color: colors.surface,
  },
  cardDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  selectedCardDescription: {
    color: colors.surface,
    opacity: 0.9,
  },
  featuresContainer: {
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  featureText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  selectedFeatureText: {
    color: colors.surface,
  },
  selectedIndicator: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  continueButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  skipContainer: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  skipText: {
    fontSize: fontSize.md,
    color: colors.text.hint,
    fontWeight: fontWeight.medium,
  },
});

export default UserTypeSelectionScreen;
