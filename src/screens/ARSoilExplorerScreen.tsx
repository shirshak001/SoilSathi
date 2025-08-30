import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface ARSoilExplorerScreenProps {
  navigation: any;
}

interface SoilOrganism {
  id: string;
  name: string;
  type: 'bacteria' | 'fungi' | 'worm' | 'insect' | 'roots';
  icon: string;
  size: 'microscopic' | 'small' | 'medium' | 'large';
  description: string;
  funFact: string;
  benefits: string[];
  x: number;
  y: number;
  discovered: boolean;
  animationValue: Animated.Value;
}

const { width, height } = Dimensions.get('window');

const ARSoilExplorerScreen: React.FC<ARSoilExplorerScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { translations } = useLanguage();

  const [selectedTab, setSelectedTab] = useState('explore');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isARActive, setIsARActive] = useState(false);
  const [discoveredOrganisms, setDiscoveredOrganisms] = useState<string[]>([]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedOrganism, setSelectedOrganism] = useState<SoilOrganism | null>(null);

  const soilOrganisms: SoilOrganism[] = [
    {
      id: 'earthworm',
      name: 'Earthworm',
      type: 'worm',
      icon: 'bug',
      size: 'large',
      description: 'These amazing creatures eat soil and create nutrient-rich castings!',
      funFact: 'An earthworm can eat its own weight in soil every single day!',
      benefits: ['Improves soil structure', 'Creates nutrient-rich castings', 'Helps water penetration'],
      x: 0.3,
      y: 0.4,
      discovered: false,
      animationValue: new Animated.Value(0),
    },
    {
      id: 'bacteria',
      name: 'Beneficial Bacteria',
      type: 'bacteria',
      icon: 'ellipse',
      size: 'microscopic',
      description: 'Tiny helpers that break down organic matter and fix nitrogen!',
      funFact: 'There are more bacteria in a teaspoon of soil than people on Earth!',
      benefits: ['Breaks down organic matter', 'Fixes nitrogen', 'Fights harmful pathogens'],
      x: 0.7,
      y: 0.2,
      discovered: false,
      animationValue: new Animated.Value(0),
    },
    {
      id: 'mycorrhizae',
      name: 'Mycorrhizal Fungi',
      type: 'fungi',
      icon: 'git-network',
      size: 'small',
      description: 'Magical fungi that form partnerships with plant roots!',
      funFact: 'These fungi create underground networks that help plants share nutrients!',
      benefits: ['Increases nutrient uptake', 'Improves water absorption', 'Connects plant roots'],
      x: 0.5,
      y: 0.6,
      discovered: false,
      animationValue: new Animated.Value(0),
    },
  ];

  const soilLayers = [
    {
      id: 'organic',
      name: 'Organic Layer',
      depth: '0-2 inches',
      color: '#8B4513',
      description: 'Rich in decomposing leaves and organic matter',
      organisms: ['bacteria', 'fungi'],
      nutrients: ['Carbon', 'Nitrogen', 'Phosphorus'],
      icon: 'leaf',
    },
    {
      id: 'topsoil',
      name: 'Topsoil (A Horizon)',
      depth: '2-8 inches',
      color: '#654321',
      description: 'Dark, nutrient-rich soil where most plants grow',
      organisms: ['earthworm', 'bacteria', 'mycorrhizae'],
      nutrients: ['Nitrogen', 'Phosphorus', 'Potassium', 'Organic matter'],
      icon: 'layers',
    },
  ];

  const [organisms, setOrganisms] = useState(soilOrganisms);

  const tabs = [
    { key: 'explore', label: 'AR Explore', icon: 'camera' },
    { key: 'layers', label: 'Soil Layers', icon: 'layers' },
    { key: 'collection', label: 'My Finds', icon: 'albums' },
  ];

  useEffect(() => {
    organisms.forEach(organism => {
      if (organism.discovered) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(organism.animationValue, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(organism.animationValue, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    });
  }, [organisms]);

  const discoverOrganism = (organismId: string) => {
    setOrganisms(prev => prev.map(org => 
      org.id === organismId ? { ...org, discovered: true } : org
    ));
    setDiscoveredOrganisms(prev => [...prev, organismId]);
  };

  const startARExploration = async () => {
    if (cameraPermission?.granted) {
      setIsARActive(true);
    } else {
      await requestCameraPermission();
    }
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.lg,
    },
    headerTitle: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.surface,
      flex: 1,
      textAlign: 'center',
    },
    backButton: {
      padding: spacing.sm,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.xs,
      marginVertical: spacing.lg,
      elevation: 2,
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    tabIcon: {
      marginRight: spacing.sm,
    },
    tabText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.secondary,
    },
    activeTabText: {
      color: colors.surface,
    },
    cameraContainer: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      marginBottom: spacing.lg,
    },
    camera: {
      flex: 1,
    },
    arOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    arControls: {
      position: 'absolute',
      bottom: spacing.lg,
      left: spacing.lg,
      right: spacing.lg,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    controlButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      alignItems: 'center',
      minWidth: 80,
    },
    controlButtonText: {
      color: colors.surface,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      marginTop: spacing.xs,
    },
    permissionContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    permissionText: {
      fontSize: fontSize.lg,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    permissionButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.lg,
    },
    permissionButtonText: {
      color: colors.surface,
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
    },
    instructionText: {
      fontSize: fontSize.md,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.lg,
      backgroundColor: colors.surface,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      elevation: 2,
    },
    discoveryButton: {
      backgroundColor: colors.secondary,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    discoveryButtonText: {
      color: colors.surface,
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
    },
    layerCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      elevation: 3,
    },
    layerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    layerIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    layerInfo: {
      flex: 1,
    },
    layerName: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    layerDepth: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.xs,
    },
    layerDescription: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.md,
      lineHeight: 20,
    },
    contentTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    contentList: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    collectionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    collectionItem: {
      width: (width - spacing.lg * 3) / 2,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.lg,
      alignItems: 'center',
      elevation: 2,
    },
    collectionIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    collectionName: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      textAlign: 'center',
    },
    collectionStatus: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.xs,
    },
    discoveredItem: {
      opacity: 1,
    },
    undiscoveredItem: {
      opacity: 0.3,
    },
  });

  const renderAROverlay = () => (
    <View style={styles.arOverlay}>
      <View style={styles.instructionText}>
        <Text style={{ color: colors.text.primary, textAlign: 'center' }}>
          Point your camera at soil and tap "Discover" to find hidden organisms!
        </Text>
      </View>
      
      <View style={styles.arControls}>
        <TouchableOpacity
          style={styles.discoveryButton}
          onPress={() => {
            const undiscoveredOrganisms = organisms.filter(org => !org.discovered);
            if (undiscoveredOrganisms.length > 0) {
              const randomOrganism = undiscoveredOrganisms[Math.floor(Math.random() * undiscoveredOrganisms.length)];
              discoverOrganism(randomOrganism.id);
              Alert.alert('Amazing Discovery!', `You found a ${randomOrganism.name}! 🎉\n\n${randomOrganism.funFact}`);
            } else {
              Alert.alert('Wow!', 'You\'ve discovered all the soil organisms! You\'re a true soil explorer!');
            }
          }}
        >
          <Ionicons name="search" size={24} color={colors.surface} />
          <Text style={styles.discoveryButtonText}>Discover</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setIsARActive(false)}
        >
          <Ionicons name="close" size={24} color={colors.surface} />
          <Text style={styles.controlButtonText}>Exit AR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderExploreTab = () => {
    if (!cameraPermission) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Checking camera permission...</Text>
        </View>
      );
    }

    if (!cameraPermission.granted) {
      return (
        <View style={styles.permissionContainer}>
          <Ionicons name="camera" size={80} color={colors.text.secondary} />
          <Text style={styles.permissionText}>
            Camera permission is needed to explore soil with AR!
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (isARActive) {
      return (
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} facing="back">
            {renderAROverlay()}
          </CameraView>
        </View>
      );
    }

    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera" size={80} color={colors.primary} />
        <Text style={styles.permissionText}>
          Point your camera at soil to discover the amazing world underground!
        </Text>
        <Text style={[styles.permissionText, { fontSize: fontSize.sm, marginBottom: spacing.xl }]}>
          Learn about earthworms, bacteria, fungi, and other amazing creatures that make soil healthy!
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={startARExploration}>
          <Text style={styles.permissionButtonText}>Start AR Exploration</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderLayersTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {soilLayers.map(layer => (
        <View key={layer.id} style={styles.layerCard}>
          <View style={styles.layerHeader}>
            <View style={[styles.layerIcon, { backgroundColor: layer.color }]}>
              <Ionicons name={layer.icon as any} size={24} color={colors.surface} />
            </View>
            <View style={styles.layerInfo}>
              <Text style={styles.layerName}>{layer.name}</Text>
              <Text style={styles.layerDepth}>{layer.depth}</Text>
            </View>
          </View>
          <Text style={styles.layerDescription}>{layer.description}</Text>
          <View>
            <Text style={styles.contentTitle}>Lives Here:</Text>
            {layer.organisms.map(orgId => {
              const organism = organisms.find(o => o.id === orgId);
              return organism ? (
                <Text key={orgId} style={styles.contentList}>• {organism.name}</Text>
              ) : null;
            })}
            <Text style={styles.contentTitle}>Nutrients:</Text>
            {layer.nutrients.map(nutrient => (
              <Text key={nutrient} style={styles.contentList}>• {nutrient}</Text>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderCollectionTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.collectionGrid}>
        {organisms.map(organism => (
          <TouchableOpacity
            key={organism.id}
            style={[
              styles.collectionItem,
              organism.discovered ? styles.discoveredItem : styles.undiscoveredItem,
            ]}
            onPress={() => {
              if (organism.discovered) {
                Alert.alert(organism.name, `${organism.description}\n\nFun Fact: ${organism.funFact}`);
              }
            }}
          >
            <View style={styles.collectionIcon}>
              <Ionicons
                name={organism.discovered ? organism.icon as any : 'lock-closed'}
                size={30}
                color={colors.surface}
              />
            </View>
            <Text style={styles.collectionName}>
              {organism.discovered ? organism.name : '???'}
            </Text>
            <Text style={styles.collectionStatus}>
              {organism.discovered ? 'Discovered!' : 'Use AR to find me!'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'explore':
        return renderExploreTab();
      case 'layers':
        return renderLayersTab();
      case 'collection':
        return renderCollectionTab();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      
      <LinearGradient
        colors={[colors.primaryLight, colors.primary]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AR Soil Explorer</Text>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="help-circle" size={24} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.tabContainer}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
              onPress={() => setSelectedTab(tab.key)}
            >
              <Ionicons
                name={tab.icon as any}
                size={18}
                color={selectedTab === tab.key ? colors.surface : colors.text.secondary}
                style={styles.tabIcon}
              />
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab.key && styles.activeTabText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderTabContent()}
      </View>
    </View>
  );
};

export default ARSoilExplorerScreen;
