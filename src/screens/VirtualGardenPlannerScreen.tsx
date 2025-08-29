import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  PanResponder,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Circle, Text as SvgText, G } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface VirtualGardenPlannerScreenProps {
  navigation: any;
}

interface PlantItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  size: 'small' | 'medium' | 'large';
  sunlight: 'full' | 'partial' | 'shade';
  water: 'low' | 'medium' | 'high';
  spacing: number;
  growthTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface PlacedPlant {
  id: string;
  plantId: string;
  x: number;
  y: number;
  planted: boolean;
  plantedDate?: string;
  growthStage: 'seed' | 'sprout' | 'young' | 'mature';
  health: number;
}

interface GardenLayout {
  id: string;
  name: string;
  description: string;
  size: 'small' | 'medium' | 'large';
  plants: PlacedPlant[];
  createdDate: string;
}

const { width, height } = Dimensions.get('window');
const GARDEN_WIDTH = width - 40;
const GARDEN_HEIGHT = 300;

const VirtualGardenPlannerScreen: React.FC<VirtualGardenPlannerScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { translations } = useLanguage();

  const [selectedTab, setSelectedTab] = useState<'design' | 'manage' | 'gallery'>('design');
  const [selectedTool, setSelectedTool] = useState<'plant' | 'water' | 'fertilizer' | 'remove'>('plant');
  const [selectedPlant, setSelectedPlant] = useState<PlantItem | null>(null);
  const [placedPlants, setPlacedPlants] = useState<PlacedPlant[]>([]);
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [gardenName, setGardenName] = useState('');
  const [gardenDescription, setGardenDescription] = useState('');
  const [savedLayouts, setSavedLayouts] = useState<GardenLayout[]>([]);

  const plantLibrary: PlantItem[] = [
    {
      id: '1',
      name: 'Rose',
      icon: 'rose',
      color: '#FF6B6B',
      size: 'medium',
      sunlight: 'full',
      water: 'medium',
      spacing: 30,
      growthTime: '2-3 months',
      difficulty: 'medium',
    },
    {
      id: '2',
      name: 'Marigold',
      icon: 'flower',
      color: '#FFD93D',
      size: 'small',
      sunlight: 'full',
      water: 'medium',
      spacing: 20,
      growthTime: '6-8 weeks',
      difficulty: 'easy',
    },
    {
      id: '3',
      name: 'Lavender',
      icon: 'flower',
      color: '#9B59B6',
      size: 'medium',
      sunlight: 'full',
      water: 'low',
      spacing: 25,
      growthTime: '3-4 months',
      difficulty: 'easy',
    },
    {
      id: '4',
      name: 'Basil',
      icon: 'leaf',
      color: '#2ECC71',
      size: 'small',
      sunlight: 'partial',
      water: 'medium',
      spacing: 15,
      growthTime: '4-6 weeks',
      difficulty: 'easy',
    },
    {
      id: '5',
      name: 'Tomato',
      icon: 'nutrition',
      color: '#E74C3C',
      size: 'large',
      sunlight: 'full',
      water: 'high',
      spacing: 40,
      growthTime: '3-4 months',
      difficulty: 'medium',
    },
    {
      id: '6',
      name: 'Sunflower',
      icon: 'sunny',
      color: '#F39C12',
      size: 'large',
      sunlight: 'full',
      water: 'medium',
      spacing: 50,
      growthTime: '3-4 months',
      difficulty: 'easy',
    },
    {
      id: '7',
      name: 'Mint',
      icon: 'leaf',
      color: '#27AE60',
      size: 'small',
      sunlight: 'partial',
      water: 'high',
      spacing: 20,
      growthTime: '6-8 weeks',
      difficulty: 'easy',
    },
    {
      id: '8',
      name: 'Dahlia',
      icon: 'flower',
      color: '#E91E63',
      size: 'medium',
      sunlight: 'full',
      water: 'medium',
      spacing: 35,
      growthTime: '3-4 months',
      difficulty: 'medium',
    },
  ];

  const tools = [
    { key: 'plant', label: 'Plant', icon: 'leaf' },
    { key: 'water', label: 'Water', icon: 'water' },
    { key: 'fertilizer', label: 'Fertilize', icon: 'nutrition' },
    { key: 'remove', label: 'Remove', icon: 'trash' },
  ];

  const tabs = [
    { key: 'design', label: 'Design', icon: 'create' },
    { key: 'manage', label: 'Manage', icon: 'list' },
    { key: 'gallery', label: 'Gallery', icon: 'images' },
  ];

  const getPlantSize = (size: string) => {
    switch (size) {
      case 'small': return 15;
      case 'medium': return 20;
      case 'large': return 25;
      default: return 20;
    }
  };

  const getGrowthStageColor = (stage: string, health: number) => {
    const opacity = Math.max(0.3, health / 100);
    switch (stage) {
      case 'seed': return `rgba(139, 69, 19, ${opacity})`;
      case 'sprout': return `rgba(50, 205, 50, ${opacity})`;
      case 'young': return `rgba(34, 139, 34, ${opacity})`;
      case 'mature': return `rgba(0, 100, 0, ${opacity})`;
      default: return `rgba(139, 69, 19, ${opacity})`;
    }
  };

  const handleGardenPress = (event: any) => {
    if (selectedTool === 'plant' && selectedPlant) {
      const { locationX, locationY } = event.nativeEvent;
      
      // Check spacing requirements
      const tooClose = placedPlants.some(plant => {
        const distance = Math.sqrt(
          Math.pow(locationX - plant.x, 2) + Math.pow(locationY - plant.y, 2)
        );
        return distance < selectedPlant.spacing;
      });

      if (tooClose) {
        Alert.alert('Spacing Warning', 'Plants are too close together. Please maintain proper spacing for healthy growth.');
        return;
      }

      const newPlant: PlacedPlant = {
        id: Date.now().toString(),
        plantId: selectedPlant.id,
        x: locationX,
        y: locationY,
        planted: false,
        growthStage: 'seed',
        health: 100,
      };

      setPlacedPlants([...placedPlants, newPlant]);
    }
  };

  const handlePlantAction = (plantId: string, action: string) => {
    setPlacedPlants(plants => 
      plants.map(plant => {
        if (plant.id === plantId) {
          switch (action) {
            case 'water':
              return { ...plant, health: Math.min(100, plant.health + 10) };
            case 'fertilizer':
              return { ...plant, health: Math.min(100, plant.health + 15) };
            case 'plant':
              return { 
                ...plant, 
                planted: true, 
                plantedDate: new Date().toISOString().split('T')[0],
                growthStage: 'sprout' as const
              };
            case 'remove':
              return plant;
            default:
              return plant;
          }
        }
        return plant;
      }).filter(plant => !(action === 'remove' && plant.id === plantId))
    );
  };

  const saveGardenLayout = () => {
    if (!gardenName.trim()) {
      Alert.alert('Error', 'Please enter a garden name');
      return;
    }

    const newLayout: GardenLayout = {
      id: Date.now().toString(),
      name: gardenName,
      description: gardenDescription,
      size: 'medium',
      plants: placedPlants,
      createdDate: new Date().toISOString().split('T')[0],
    };

    setSavedLayouts([...savedLayouts, newLayout]);
    setShowSaveModal(false);
    setGardenName('');
    setGardenDescription('');
    Alert.alert('Success', 'Garden layout saved successfully!');
  };

  const loadGardenLayout = (layout: GardenLayout) => {
    setPlacedPlants(layout.plants);
    setSelectedTab('design');
  };

  const getPlantInfo = (plantId: string) => {
    return plantLibrary.find(p => p.id === plantId);
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
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.lg,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    backButton: {
      padding: spacing.sm,
      marginRight: spacing.md,
    },
    headerTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.surface,
    },
    saveButton: {
      padding: spacing.sm,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      marginHorizontal: spacing.lg,
      marginTop: spacing.lg,
      borderRadius: borderRadius.lg,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      borderRadius: borderRadius.lg,
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    tabText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
    },
    activeTabText: {
      color: colors.surface,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
    },
    gardenContainer: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      marginBottom: spacing.lg,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    gardenCanvas: {
      width: GARDEN_WIDTH,
      height: GARDEN_HEIGHT,
      backgroundColor: '#8FBC8F',
      borderRadius: borderRadius.md,
    },
    toolContainer: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.sm,
      marginBottom: spacing.lg,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    tool: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.sm,
      marginHorizontal: spacing.xs,
    },
    activeTool: {
      backgroundColor: colors.primary,
    },
    toolText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.text.secondary,
      marginTop: spacing.xs / 2,
    },
    activeToolText: {
      color: colors.surface,
    },
    plantLibrary: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    libraryTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    plantGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    plantItem: {
      width: '48%',
      backgroundColor: colors.background,
      borderRadius: borderRadius.sm,
      padding: spacing.md,
      marginBottom: spacing.sm,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedPlantItem: {
      borderColor: colors.primary,
    },
    plantEmoji: {
      fontSize: 32,
      marginBottom: spacing.xs,
    },
    plantName: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.xs / 2,
    },
    plantDetails: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    managementContainer: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    managementTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    plantCard: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      borderRadius: borderRadius.sm,
      padding: spacing.md,
      marginBottom: spacing.sm,
      alignItems: 'center',
    },
    plantCardInfo: {
      flex: 1,
      marginLeft: spacing.md,
    },
    plantCardName: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
      marginBottom: spacing.xs / 2,
    },
    plantCardStatus: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
    },
    healthBar: {
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      marginTop: spacing.xs,
      overflow: 'hidden',
    },
    healthFill: {
      height: '100%',
      borderRadius: 2,
    },
    plantActions: {
      flexDirection: 'row',
    },
    actionButton: {
      padding: spacing.xs,
      marginLeft: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    galleryContainer: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    galleryTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    layoutCard: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.sm,
      padding: spacing.md,
      marginBottom: spacing.sm,
    },
    layoutName: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
      marginBottom: spacing.xs / 2,
    },
    layoutDescription: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    layoutDate: {
      fontSize: fontSize.xs,
      color: colors.text.hint,
    },
    layoutActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: spacing.sm,
    },
    loadButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    loadButtonText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.surface,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xl,
    },
    emptyStateText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      textAlign: 'center',
      marginTop: spacing.md,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      width: width * 0.9,
      maxHeight: height * 0.8,
    },
    modalTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    modalInput: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.sm,
      padding: spacing.md,
      marginBottom: spacing.md,
      fontSize: fontSize.sm,
      color: colors.text.primary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.md,
    },
    modalButton: {
      flex: 1,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.sm,
      alignItems: 'center',
      marginHorizontal: spacing.xs,
    },
    cancelButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    saveModalButton: {
      backgroundColor: colors.primary,
    },
    modalButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
    },
    cancelButtonText: {
      color: colors.text.primary,
    },
    saveButtonText: {
      color: colors.surface,
    },
  });

  const styles = getStyles();

  const renderDesignTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.gardenContainer}>
        <TouchableOpacity
          style={styles.gardenCanvas}
          onPress={handleGardenPress}
          activeOpacity={1}
        >
          <Svg width={GARDEN_WIDTH} height={GARDEN_HEIGHT}>
            {/* Garden grid */}
            <G>
              {Array.from({ length: 10 }, (_, i) => (
                <React.Fragment key={i}>
                  <Rect
                    x={i * (GARDEN_WIDTH / 10)}
                    y={0}
                    width={1}
                    height={GARDEN_HEIGHT}
                    fill="rgba(255, 255, 255, 0.1)"
                  />
                  <Rect
                    x={0}
                    y={i * (GARDEN_HEIGHT / 10)}
                    width={GARDEN_WIDTH}
                    height={1}
                    fill="rgba(255, 255, 255, 0.1)"
                  />
                </React.Fragment>
              ))}
            </G>
            
            {/* Placed plants */}
            {placedPlants.map((plant) => {
              const plantInfo = getPlantInfo(plant.plantId);
              if (!plantInfo) return null;
              
              const plantSize = getPlantSize(plantInfo.size);
              return (
                <G key={plant.id}>
                  <Circle
                    cx={plant.x}
                    cy={plant.y}
                    r={plantSize}
                    fill={getGrowthStageColor(plant.growthStage, plant.health)}
                    stroke={plantInfo.color}
                    strokeWidth={2}
                    onPress={() => {
                      if (selectedTool !== 'plant') {
                        handlePlantAction(plant.id, selectedTool);
                      }
                    }}
                  />
                  <SvgText
                    x={plant.x}
                    y={plant.y + 5}
                    fontSize={12}
                    textAnchor="middle"
                    fill={colors.text.primary}
                  >
                    {plantInfo.name.substring(0, 3)}
                  </SvgText>
                </G>
              );
            })}
          </Svg>
        </TouchableOpacity>
      </View>

      <View style={styles.toolContainer}>
        {tools.map((tool) => (
          <TouchableOpacity
            key={tool.key}
            style={[styles.tool, selectedTool === tool.key && styles.activeTool]}
            onPress={() => setSelectedTool(tool.key as any)}
          >
            <Ionicons
              name={tool.icon as any}
              size={20}
              color={selectedTool === tool.key ? colors.surface : colors.text.secondary}
            />
            <Text
              style={[
                styles.toolText,
                selectedTool === tool.key && styles.activeToolText,
              ]}
            >
              {tool.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedTool === 'plant' && (
        <View style={styles.plantLibrary}>
          <Text style={styles.libraryTitle}>Plant Library</Text>
          <View style={styles.plantGrid}>
            {plantLibrary.map((plant) => (
              <TouchableOpacity
                key={plant.id}
                style={[
                  styles.plantItem,
                  selectedPlant?.id === plant.id && styles.selectedPlantItem,
                ]}
                onPress={() => setSelectedPlant(plant)}
              >
                <Text style={styles.plantEmoji}>{plant.icon}</Text>
                <Text style={styles.plantName}>{plant.name}</Text>
                <Text style={styles.plantDetails}>
                  {plant.size} • {plant.difficulty}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );

  const renderManageTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.managementContainer}>
        <Text style={styles.managementTitle}>Plant Management</Text>
        {placedPlants.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="leaf" size={48} color={colors.text.secondary} />
            <Text style={styles.emptyStateText}>
              No plants in your garden yet.{'\n'}Go to Design tab to start planting!
            </Text>
          </View>
        ) : (
          placedPlants.map((plant) => {
            const plantInfo = getPlantInfo(plant.plantId);
            if (!plantInfo) return null;

            return (
              <View key={plant.id} style={styles.plantCard}>
                <Text style={styles.plantEmoji}>{plantInfo.icon}</Text>
                <View style={styles.plantCardInfo}>
                  <Text style={styles.plantCardName}>{plantInfo.name}</Text>
                  <Text style={styles.plantCardStatus}>
                    {plant.planted ? `${plant.growthStage} stage` : 'Not planted yet'}
                  </Text>
                  {plant.plantedDate && (
                    <Text style={styles.plantCardStatus}>
                      Planted: {plant.plantedDate}
                    </Text>
                  )}
                  <View style={styles.healthBar}>
                    <View
                      style={[
                        styles.healthFill,
                        {
                          width: `${plant.health}%`,
                          backgroundColor: plant.health > 70 ? '#2ECC71' : plant.health > 40 ? '#F39C12' : '#E74C3C',
                        },
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.plantActions}>
                  {!plant.planted && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.primary }]}
                      onPress={() => handlePlantAction(plant.id, 'plant')}
                    >
                      <Ionicons name="leaf" size={16} color={colors.surface} />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#3498DB' }]}
                    onPress={() => handlePlantAction(plant.id, 'water')}
                  >
                    <Ionicons name="water" size={16} color={colors.surface} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#9B59B6' }]}
                    onPress={() => handlePlantAction(plant.id, 'fertilizer')}
                  >
                    <Ionicons name="nutrition" size={16} color={colors.surface} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#E74C3C' }]}
                    onPress={() => handlePlantAction(plant.id, 'remove')}
                  >
                    <Ionicons name="trash" size={16} color={colors.surface} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );

  const renderGalleryTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.galleryContainer}>
        <Text style={styles.galleryTitle}>Saved Layouts</Text>
        {savedLayouts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="images" size={48} color={colors.text.secondary} />
            <Text style={styles.emptyStateText}>
              No saved layouts yet.{'\n'}Create and save your garden designs!
            </Text>
          </View>
        ) : (
          savedLayouts.map((layout) => (
            <View key={layout.id} style={styles.layoutCard}>
              <Text style={styles.layoutName}>{layout.name}</Text>
              <Text style={styles.layoutDescription}>{layout.description}</Text>
              <Text style={styles.layoutDate}>
                Created: {layout.createdDate} • {layout.plants.length} plants
              </Text>
              <View style={styles.layoutActions}>
                <TouchableOpacity
                  style={styles.loadButton}
                  onPress={() => loadGardenLayout(layout)}
                >
                  <Text style={styles.loadButtonText}>Load Layout</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primary + 'DD']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.surface} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Virtual Garden Planner</Text>
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => setShowSaveModal(true)}
          >
            <Ionicons name="save" size={24} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
            onPress={() => setSelectedTab(tab.key as any)}
          >
            <Ionicons
              name={tab.icon as any}
              size={18}
              color={selectedTab === tab.key ? colors.surface : colors.text.secondary}
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

      <View style={styles.content}>
        {selectedTab === 'design' && renderDesignTab()}
        {selectedTab === 'manage' && renderManageTab()}
        {selectedTab === 'gallery' && renderGalleryTab()}
      </View>

      {/* Save Layout Modal */}
      <Modal
        visible={showSaveModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSaveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save Garden Layout</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Garden name"
              placeholderTextColor={colors.text.hint}
              value={gardenName}
              onChangeText={setGardenName}
            />
            <TextInput
              style={[styles.modalInput, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Description (optional)"
              placeholderTextColor={colors.text.hint}
              value={gardenDescription}
              onChangeText={setGardenDescription}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowSaveModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveModalButton]}
                onPress={saveGardenLayout}
              >
                <Text style={[styles.modalButtonText, styles.saveButtonText]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default VirtualGardenPlannerScreen;
