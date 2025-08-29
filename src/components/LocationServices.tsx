import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface LocationServicesProps {
  navigation?: any;
}

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  accuracy: number;
  timestamp: number;
}

interface LocationPermission {
  granted: boolean;
  accuracy: 'precise' | 'approximate' | 'denied';
}

const LocationServices: React.FC<LocationServicesProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { translations } = useLanguage();

  const [locationEnabled, setLocationEnabled] = useState(false);
  const [automaticLocation, setAutomaticLocation] = useState(true);
  const [weatherLocation, setWeatherLocation] = useState(true);
  const [fieldMapping, setFieldMapping] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState<LocationPermission>({
    granted: false,
    accuracy: 'denied',
  });

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      // Simulate permission check
      // In real app, use expo-location to check permissions
      setPermission({
        granted: true,
        accuracy: 'precise',
      });
      setLocationEnabled(true);
    } catch (error) {
      console.error('Error checking location permission:', error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      Alert.alert(
        'Location Permission',
        'SoilSathi needs access to your location to provide accurate weather data and field mapping.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Allow',
            onPress: () => {
              setPermission({
                granted: true,
                accuracy: 'precise',
              });
              setLocationEnabled(true);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = async () => {
    if (!permission.granted) {
      await requestLocationPermission();
      return;
    }

    setIsLoading(true);
    try {
      // Simulate getting current location
      // In real app, use expo-location to get current position
      setTimeout(() => {
        setCurrentLocation({
          latitude: 37.7749,
          longitude: -122.4194,
          address: '123 Farm Road, Agricultural Valley, CA 94102',
          accuracy: 10,
          timestamp: Date.now(),
        });
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Unable to get current location. Please try again.');
      console.error('Error getting location:', error);
    }
  };

  const clearLocationData = () => {
    Alert.alert(
      'Clear Location Data',
      'This will remove all stored location data from your device. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setCurrentLocation(null);
            Alert.alert('Success', 'Location data cleared successfully.');
          },
        },
      ]
    );
  };

  const getLocationAccuracyText = () => {
    switch (permission.accuracy) {
      case 'precise':
        return 'High accuracy (GPS enabled)';
      case 'approximate':
        return 'Approximate location only';
      case 'denied':
        return 'Location access denied';
      default:
        return 'Unknown';
    }
  };

  const getLocationAccuracyColor = () => {
    switch (permission.accuracy) {
      case 'precise':
        return '#10B981';
      case 'approximate':
        return '#F59E0B';
      case 'denied':
        return '#EF4444';
      default:
        return colors.text.secondary;
    }
  };

  const getStyles = () => StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      margin: spacing.md,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    headerText: {
      flex: 1,
    },
    headerTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.xs / 2,
    },
    headerSubtitle: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    content: {
      padding: spacing.lg,
    },
    permissionCard: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    permissionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    permissionTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
    },
    permissionStatus: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: spacing.xs,
    },
    statusText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
    },
    permissionDescription: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      lineHeight: 20,
    },
    enableButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      alignItems: 'center',
      marginTop: spacing.md,
    },
    enableButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.surface,
    },
    settingsList: {
      marginBottom: spacing.lg,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingInfo: {
      flex: 1,
      marginRight: spacing.md,
    },
    settingTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
      marginBottom: spacing.xs / 2,
    },
    settingDescription: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      lineHeight: 18,
    },
    currentLocationCard: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.lg,
    },
    locationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    locationTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
    },
    refreshButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      backgroundColor: colors.primary + '15',
      borderRadius: borderRadius.sm,
    },
    refreshButtonText: {
      fontSize: fontSize.xs,
      color: colors.primary,
      fontWeight: fontWeight.medium,
      marginLeft: spacing.xs / 2,
    },
    locationInfo: {
      marginBottom: spacing.sm,
    },
    coordinatesText: {
      fontSize: fontSize.sm,
      color: colors.text.primary,
      fontWeight: fontWeight.medium,
      marginBottom: spacing.xs / 2,
    },
    addressText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      lineHeight: 18,
      marginBottom: spacing.sm,
    },
    locationMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    metaItem: {
      flex: 1,
    },
    metaLabel: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      marginBottom: spacing.xs / 2,
    },
    metaValue: {
      fontSize: fontSize.sm,
      color: colors.text.primary,
      fontWeight: fontWeight.medium,
    },
    noLocationText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      flex: 1,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      marginHorizontal: spacing.xs,
    },
    dangerButton: {
      borderColor: '#EF4444',
    },
    actionButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
    },
    dangerButtonText: {
      color: '#EF4444',
    },
    loadingContainer: {
      alignItems: 'center',
      paddingVertical: spacing.lg,
    },
    loadingText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.sm,
    },
  });

  const styles = getStyles();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="location" size={20} color={colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Location Services</Text>
          <Text style={styles.headerSubtitle}>Manage location access and preferences</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Permission Status */}
        <View style={styles.permissionCard}>
          <View style={styles.permissionHeader}>
            <Text style={styles.permissionTitle}>Location Permission</Text>
            <View style={styles.permissionStatus}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getLocationAccuracyColor() },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: getLocationAccuracyColor() },
                ]}
              >
                {getLocationAccuracyText()}
              </Text>
            </View>
          </View>
          <Text style={styles.permissionDescription}>
            Location access is used to provide accurate weather data, field mapping, and
            location-based farming recommendations.
          </Text>
          {!permission.granted && (
            <TouchableOpacity style={styles.enableButton} onPress={requestLocationPermission}>
              <Text style={styles.enableButtonText}>Enable Location Access</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Location Settings */}
        {permission.granted && (
          <>
            <View style={styles.settingsList}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Automatic Location Updates</Text>
                  <Text style={styles.settingDescription}>
                    Automatically update your location for weather and field data
                  </Text>
                </View>
                <Switch
                  value={automaticLocation}
                  onValueChange={setAutomaticLocation}
                  trackColor={{ false: colors.border, true: colors.primary + '30' }}
                  thumbColor={automaticLocation ? colors.primary : colors.text.secondary}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Weather Location</Text>
                  <Text style={styles.settingDescription}>
                    Use your location to get local weather forecasts
                  </Text>
                </View>
                <Switch
                  value={weatherLocation}
                  onValueChange={setWeatherLocation}
                  trackColor={{ false: colors.border, true: colors.primary + '30' }}
                  thumbColor={weatherLocation ? colors.primary : colors.text.secondary}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Field Mapping</Text>
                  <Text style={styles.settingDescription}>
                    Enable GPS tracking for accurate field boundary mapping
                  </Text>
                </View>
                <Switch
                  value={fieldMapping}
                  onValueChange={setFieldMapping}
                  trackColor={{ false: colors.border, true: colors.primary + '30' }}
                  thumbColor={fieldMapping ? colors.primary : colors.text.secondary}
                />
              </View>
            </View>

            {/* Current Location */}
            <View style={styles.currentLocationCard}>
              <View style={styles.locationHeader}>
                <Text style={styles.locationTitle}>Current Location</Text>
                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={getCurrentLocation}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Ionicons name="refresh" size={14} color={colors.primary} />
                  )}
                  <Text style={styles.refreshButtonText}>
                    {isLoading ? 'Getting...' : 'Update'}
                  </Text>
                </TouchableOpacity>
              </View>

              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={styles.loadingText}>Getting your location...</Text>
                </View>
              ) : currentLocation ? (
                <>
                  <View style={styles.locationInfo}>
                    <Text style={styles.coordinatesText}>
                      {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                    </Text>
                    <Text style={styles.addressText}>{currentLocation.address}</Text>
                  </View>
                  <View style={styles.locationMeta}>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>Accuracy</Text>
                      <Text style={styles.metaValue}>{currentLocation.accuracy}m</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>Last Updated</Text>
                      <Text style={styles.metaValue}>
                        {new Date(currentLocation.timestamp).toLocaleTimeString()}
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                <Text style={styles.noLocationText}>
                  No location data available. Tap "Update" to get your current location.
                </Text>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={getCurrentLocation}>
                <Text style={styles.actionButtonText}>Update Location</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.dangerButton]}
                onPress={clearLocationData}
              >
                <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
                  Clear Data
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default LocationServices;
