import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import LocationServices from '../components/LocationServices';

interface ProfileScreenProps {
  navigation: any;
}

interface ProfileField {
  key: string;
  label: string;
  value: string;
  icon: string;
  multiline?: boolean;
}

interface ProfileSection {
  title: string;
  fields: ProfileField[];
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { translations } = useLanguage();

  // Dummy user data
  const [userProfile, setUserProfile] = useState({
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    location: 'California, USA',
    farmSize: '25 acres',
    cropTypes: 'Wheat, Corn, Tomatoes',
    experienceYears: '8 years',
    bio: 'Passionate farmer dedicated to sustainable agriculture and modern farming techniques.',
  });

  const [isEditing, setIsEditing] = useState(false);

  const profileSections: ProfileSection[] = [
    {
      title: 'Personal Information',
      fields: [
        { key: 'name', label: 'Full Name', value: userProfile.name, icon: 'person' },
        { key: 'email', label: 'Email Address', value: userProfile.email, icon: 'mail' },
        { key: 'phone', label: 'Phone Number', value: userProfile.phone, icon: 'call' },
        { key: 'location', label: 'Location', value: userProfile.location, icon: 'location' },
      ]
    },
    {
      title: 'Farming Details',
      fields: [
        { key: 'farmSize', label: 'Farm Size', value: userProfile.farmSize, icon: 'resize' },
        { key: 'cropTypes', label: 'Crop Types', value: userProfile.cropTypes, icon: 'leaf' },
        { key: 'experienceYears', label: 'Experience', value: userProfile.experienceYears, icon: 'medal' },
      ]
    },
    {
      title: 'About',
      fields: [
        { key: 'bio', label: 'Bio', value: userProfile.bio, icon: 'document-text', multiline: true },
      ]
    }
  ];

  const handleSave = () => {
    Alert.alert('Success', 'Profile updated successfully!');
    setIsEditing(false);
  };

  const handleFieldChange = (key: string, value: string) => {
    setUserProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };

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
    editButton: {
      padding: spacing.sm,
    },
    content: {
      flex: 1,
    },
    profileHeader: {
      alignItems: 'center',
      padding: spacing.xl,
      backgroundColor: colors.surface,
      marginBottom: spacing.lg,
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: spacing.lg,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarPlaceholder: {
      fontSize: fontSize.xxl * 2,
      color: colors.surface,
      fontWeight: fontWeight.bold,
    },
    cameraButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: colors.primary,
      borderRadius: 15,
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.surface,
    },
    userName: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    userEmail: {
      fontSize: fontSize.md,
      color: colors.text.secondary,
    },
    section: {
      backgroundColor: colors.surface,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    sectionTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.lg,
    },
    fieldContainer: {
      marginBottom: spacing.lg,
    },
    fieldLabel: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    fieldRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    fieldIcon: {
      marginRight: spacing.md,
      width: 24,
    },
    fieldValue: {
      flex: 1,
      fontSize: fontSize.md,
      color: colors.text.primary,
    },
    fieldInput: {
      flex: 1,
      fontSize: fontSize.md,
      color: colors.text.primary,
      paddingVertical: spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: colors.primary,
    },
    bioInput: {
      minHeight: 80,
      textAlignVertical: 'top',
      paddingTop: spacing.sm,
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      margin: spacing.lg,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    saveButtonText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.surface,
      textAlign: 'center',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: spacing.lg,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.primary,
    },
    statLabel: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.xs,
    },
  });

  const styles = getStyles();

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
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            <Ionicons 
              name={isEditing ? "checkmark" : "create"} 
              size={24} 
              color={colors.surface} 
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarPlaceholder}>
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera" size={16} color={colors.surface} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userProfile.name}</Text>
          <Text style={styles.userEmail}>{userProfile.email}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Active Fields</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>25</Text>
            <Text style={styles.statLabel}>Acres</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Years Exp.</Text>
          </View>
        </View>

        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.fields.map((field, fieldIndex) => (
              <View key={fieldIndex} style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <View style={styles.fieldRow}>
                  <Ionicons 
                    name={field.icon as keyof typeof Ionicons.glyphMap} 
                    size={20} 
                    color={colors.text.secondary} 
                    style={styles.fieldIcon}
                  />
                  {isEditing ? (
                    <TextInput
                      style={[styles.fieldInput, field.multiline && styles.bioInput]}
                      value={field.value}
                      onChangeText={(value) => handleFieldChange(field.key, value)}
                      multiline={field.multiline}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      placeholderTextColor={colors.text.hint}
                    />
                  ) : (
                    <Text style={styles.fieldValue}>{field.value}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        ))}

        {/* Location Services Section */}
        <LocationServices navigation={navigation} />

        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
