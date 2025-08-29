import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, borderRadius } from '../constants/theme';

interface FloatingPlantScannerProps {
  navigation: any;
}

const FloatingPlantScanner: React.FC<FloatingPlantScannerProps> = ({ navigation }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    const toValue = isExpanded ? 0 : 1;
    
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      tension: 80,
      friction: 8,
    }).start();
    
    setIsExpanded(!isExpanded);
  };

  const handleQuickScan = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required to scan plants.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // Navigate to PlantDiseaseDetection with the captured image
        navigation.navigate('PlantDiseaseDetection', { 
          capturedImage: result.assets[0].uri 
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
    
    setIsExpanded(false);
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const handleSelectFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Gallery permission is required to select photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        navigation.navigate('PlantDiseaseDetection', { 
          capturedImage: result.assets[0].uri 
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
    
    setIsExpanded(false);
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const handleFullScanner = () => {
    navigation.navigate('PlantDiseaseDetection');
    setIsExpanded(false);
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const cameraButtonStyle = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -80],
        }),
      },
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
    opacity: animation,
  };

  const galleryButtonStyle = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -140],
        }),
      },
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
    opacity: animation,
  };

  const fullScannerButtonStyle = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -200],
        }),
      },
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
    opacity: animation,
  };

  const mainButtonRotation = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Full Scanner Button */}
      <Animated.View style={[styles.subButton, fullScannerButtonStyle]}>
        <TouchableOpacity
          style={[styles.actionButton, styles.fullScannerButton]}
          onPress={handleFullScanner}
        >
          <Ionicons name="scan" size={24} color={colors.surface} />
        </TouchableOpacity>
      </Animated.View>

      {/* Gallery Button */}
      <Animated.View style={[styles.subButton, galleryButtonStyle]}>
        <TouchableOpacity
          style={[styles.actionButton, styles.galleryButton]}
          onPress={handleSelectFromGallery}
        >
          <Ionicons name="images" size={24} color={colors.surface} />
        </TouchableOpacity>
      </Animated.View>

      {/* Camera Button */}
      <Animated.View style={[styles.subButton, cameraButtonStyle]}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cameraButton]}
          onPress={handleQuickScan}
        >
          <Ionicons name="camera" size={24} color={colors.surface} />
        </TouchableOpacity>
      </Animated.View>

      {/* Main Button */}
      <Animated.View style={mainButtonRotation}>
        <TouchableOpacity
          style={[styles.mainButton, isExpanded && styles.mainButtonExpanded]}
          onPress={toggleMenu}
        >
          <Ionicons 
            name={isExpanded ? "close" : "leaf"} 
            size={28} 
            color={colors.surface} 
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    alignItems: 'center',
  },
  mainButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  mainButtonExpanded: {
    backgroundColor: colors.accent,
  },
  subButton: {
    position: 'absolute',
    bottom: 0,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  cameraButton: {
    backgroundColor: colors.success,
  },
  galleryButton: {
    backgroundColor: colors.warning,
  },
  fullScannerButton: {
    backgroundColor: colors.secondary,
  },
});

export default FloatingPlantScanner;
