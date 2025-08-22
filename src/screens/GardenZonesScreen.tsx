import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface GardenZonesScreenProps {
  navigation: any;
}

interface GardenZone {
  id: string;
  name: string;
  type: 'vegetable' | 'flower' | 'herb' | 'fruit' | 'mixed';
  size: string;
  plants: Plant[];
  soilType: string;
  sunlight: 'full' | 'partial' | 'shade';
  wateringSchedule: string;
  lastWatered: string;
  health: 'excellent' | 'good' | 'fair' | 'poor';
  notes?: string;
}

interface Plant {
  id: string;
  name: string;
  variety?: string;
  plantedDate: string;
  expectedHarvest?: string;
  status: 'planted' | 'growing' | 'flowering' | 'fruiting' | 'harvesting' | 'dormant';
}

const { width } = Dimensions.get('window');
const cardWidth = (width - spacing.lg * 3) / 2;

const GardenZonesScreen: React.FC<GardenZonesScreenProps> = ({ navigation }) => {
  const [zones, setZones] = useState<GardenZone[]>([
    {
      id: '1',
      name: 'Vegetable Patch',
      type: 'vegetable',
      size: '4m x 3m',
      soilType: 'Loamy',
      sunlight: 'full',
      wateringSchedule: 'Daily',
      lastWatered: '2 hours ago',
      health: 'excellent',
      plants: [
        { id: '1', name: 'Tomatoes', variety: 'Cherry', plantedDate: '2024-08-01', expectedHarvest: '2024-10-15', status: 'growing' },
        { id: '2', name: 'Lettuce', plantedDate: '2024-08-10', expectedHarvest: '2024-09-20', status: 'growing' },
        { id: '3', name: 'Carrots', plantedDate: '2024-07-25', expectedHarvest: '2024-10-01', status: 'growing' }
      ],
      notes: 'Soil amended with compost in spring'
    },
    {
      id: '2',
      name: 'Herb Garden',
      type: 'herb',
      size: '2m x 2m',
      soilType: 'Sandy',
      sunlight: 'partial',
      wateringSchedule: 'Every 2 days',
      lastWatered: '1 day ago',
      health: 'good',
      plants: [
        { id: '4', name: 'Basil', variety: 'Sweet', plantedDate: '2024-07-15', status: 'growing' },
        { id: '5', name: 'Rosemary', plantedDate: '2024-06-01', status: 'growing' },
        { id: '6', name: 'Mint', plantedDate: '2024-07-20', status: 'growing' }
      ],
      notes: 'Add drainage gravel for better water management'
    },
    {
      id: '3',
      name: 'Flower Bed',
      type: 'flower',
      size: '5m x 1.5m',
      soilType: 'Clay',
      sunlight: 'full',
      wateringSchedule: 'Every 3 days',
      lastWatered: '3 days ago',
      health: 'fair',
      plants: [
        { id: '7', name: 'Roses', variety: 'Hybrid Tea', plantedDate: '2024-06-15', status: 'flowering' },
        { id: '8', name: 'Marigolds', plantedDate: '2024-07-01', status: 'flowering' },
        { id: '9', name: 'Lavender', plantedDate: '2024-06-10', status: 'flowering' }
      ],
      notes: 'Needs better drainage, consider raised bed'
    },
    {
      id: '4',
      name: 'Fruit Corner',
      type: 'fruit',
      size: '3m x 3m',
      soilType: 'Loamy',
      sunlight: 'full',
      wateringSchedule: 'Weekly',
      lastWatered: '5 days ago',
      health: 'good',
      plants: [
        { id: '10', name: 'Strawberries', plantedDate: '2024-05-01', expectedHarvest: '2024-09-30', status: 'fruiting' },
        { id: '11', name: 'Blueberry Bush', plantedDate: '2024-04-15', expectedHarvest: '2024-12-01', status: 'growing' }
      ],
      notes: 'Mulch with straw for better moisture retention'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState<GardenZone | null>(null);
  const [showZoneDetails, setShowZoneDetails] = useState(false);
  
  const [newZone, setNewZone] = useState({
    name: '',
    type: 'vegetable' as GardenZone['type'],
    size: '',
    soilType: '',
    sunlight: 'full' as GardenZone['sunlight'],
    wateringSchedule: '',
    notes: ''
  });

  const zoneTypes = [
    { key: 'vegetable', label: 'Vegetable', icon: 'nutrition', color: colors.success },
    { key: 'flower', label: 'Flower', icon: 'flower', color: colors.accent },
    { key: 'herb', label: 'Herb', icon: 'leaf', color: colors.primary },
    { key: 'fruit', label: 'Fruit', icon: 'basket', color: colors.warning },
    { key: 'mixed', label: 'Mixed', icon: 'grid', color: colors.secondary }
  ];

  const getZoneTypeInfo = (type: string) => {
    return zoneTypes.find(t => t.key === type) || zoneTypes[0];
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return colors.success;
      case 'good': return colors.primary;
      case 'fair': return colors.warning;
      case 'poor': return colors.error;
      default: return colors.text.secondary;
    }
  };

  const getSunlightIcon = (sunlight: string) => {
    switch (sunlight) {
      case 'full': return 'sunny';
      case 'partial': return 'partly-sunny';
      case 'shade': return 'cloudy';
      default: return 'sunny';
    }
  };

  const getPlantStatusColor = (status: string) => {
    switch (status) {
      case 'planted': return colors.text.secondary;
      case 'growing': return colors.success;
      case 'flowering': return colors.accent;
      case 'fruiting': return colors.warning;
      case 'harvesting': return colors.primary;
      case 'dormant': return colors.text.hint;
      default: return colors.text.secondary;
    }
  };

  const addNewZone = () => {
    if (!newZone.name || !newZone.size) {
      Alert.alert('Error', 'Please fill in zone name and size');
      return;
    }

    const zone: GardenZone = {
      id: Date.now().toString(),
      name: newZone.name,
      type: newZone.type,
      size: newZone.size,
      soilType: newZone.soilType || 'Unknown',
      sunlight: newZone.sunlight,
      wateringSchedule: newZone.wateringSchedule || 'As needed',
      lastWatered: 'Never',
      health: 'good',
      plants: [],
      notes: newZone.notes
    };

    setZones([...zones, zone]);
    setNewZone({ name: '', type: 'vegetable', size: '', soilType: '', sunlight: 'full', wateringSchedule: '', notes: '' });
    setShowAddModal(false);
  };

  const deleteZone = (zoneId: string) => {
    Alert.alert(
      'Delete Zone',
      'Are you sure you want to delete this garden zone?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setZones(zones.filter(z => z.id !== zoneId))
        }
      ]
    );
  };

  const renderZoneCard = (zone: GardenZone) => {
    const typeInfo = getZoneTypeInfo(zone.type);
    
    return (
      <TouchableOpacity 
        key={zone.id} 
        style={styles.zoneCard}
        onPress={() => {
          setSelectedZone(zone);
          setShowZoneDetails(true);
        }}
      >
        <View style={styles.zoneHeader}>
          <View style={[styles.zoneTypeIcon, { backgroundColor: typeInfo.color }]}>
            <Ionicons name={typeInfo.icon as any} size={24} color={colors.surface} />
          </View>
          <View style={styles.zoneInfo}>
            <Text style={styles.zoneName}>{zone.name}</Text>
            <Text style={styles.zoneType}>{typeInfo.label} • {zone.size}</Text>
          </View>
          <View style={[styles.healthIndicator, { backgroundColor: getHealthColor(zone.health) }]} />
        </View>

        <View style={styles.zoneStats}>
          <View style={styles.zoneStat}>
            <Ionicons name={getSunlightIcon(zone.sunlight) as any} size={16} color={colors.text.secondary} />
            <Text style={styles.zoneStatText}>{zone.sunlight} sun</Text>
          </View>
          <View style={styles.zoneStat}>
            <Ionicons name="water" size={16} color={colors.text.secondary} />
            <Text style={styles.zoneStatText}>{zone.lastWatered}</Text>
          </View>
        </View>

        <View style={styles.plantsPreview}>
          <Text style={styles.plantsCount}>{zone.plants.length} plants</Text>
          <View style={styles.plantsList}>
            {zone.plants.slice(0, 3).map((plant, index) => (
              <View key={plant.id} style={styles.plantTag}>
                <View style={[styles.plantStatus, { backgroundColor: getPlantStatusColor(plant.status) }]} />
                <Text style={styles.plantName}>{plant.name}</Text>
              </View>
            ))}
            {zone.plants.length > 3 && (
              <Text style={styles.morePlants}>+{zone.plants.length - 3} more</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderZoneDetails = () => {
    if (!selectedZone) return null;

    return (
      <Modal
        visible={showZoneDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowZoneDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailsModal}>
            <View style={styles.detailsHeader}>
              <Text style={styles.detailsTitle}>{selectedZone.name}</Text>
              <TouchableOpacity onPress={() => setShowZoneDetails(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.detailsContent}>
              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Zone Information</Text>
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Type</Text>
                    <Text style={styles.detailValue}>{getZoneTypeInfo(selectedZone.type).label}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Size</Text>
                    <Text style={styles.detailValue}>{selectedZone.size}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Soil Type</Text>
                    <Text style={styles.detailValue}>{selectedZone.soilType}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Sunlight</Text>
                    <Text style={styles.detailValue}>{selectedZone.sunlight}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Health</Text>
                    <View style={styles.healthContainer}>
                      <View style={[styles.healthDot, { backgroundColor: getHealthColor(selectedZone.health) }]} />
                      <Text style={[styles.detailValue, { color: getHealthColor(selectedZone.health) }]}>
                        {selectedZone.health}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Last Watered</Text>
                    <Text style={styles.detailValue}>{selectedZone.lastWatered}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Plants ({selectedZone.plants.length})</Text>
                {selectedZone.plants.map((plant) => (
                  <View key={plant.id} style={styles.plantCard}>
                    <View style={styles.plantHeader}>
                      <Text style={styles.plantNameDetail}>{plant.name}</Text>
                      {plant.variety && (
                        <Text style={styles.plantVariety}>{plant.variety}</Text>
                      )}
                      <View style={[styles.plantStatusBadge, { backgroundColor: getPlantStatusColor(plant.status) }]}>
                        <Text style={styles.plantStatusText}>{plant.status}</Text>
                      </View>
                    </View>
                    <View style={styles.plantDetails}>
                      <Text style={styles.plantDetail}>Planted: {plant.plantedDate}</Text>
                      {plant.expectedHarvest && (
                        <Text style={styles.plantDetail}>Expected Harvest: {plant.expectedHarvest}</Text>
                      )}
                    </View>
                  </View>
                ))}
                {selectedZone.plants.length === 0 && (
                  <Text style={styles.emptyPlants}>No plants in this zone yet</Text>
                )}
              </View>

              {selectedZone.notes && (
                <View style={styles.detailsSection}>
                  <Text style={styles.sectionTitle}>Notes</Text>
                  <Text style={styles.notesText}>{selectedZone.notes}</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.detailsActions}>
              <TouchableOpacity
                style={styles.deleteZoneButton}
                onPress={() => {
                  setShowZoneDetails(false);
                  deleteZone(selectedZone.id);
                }}
              >
                <Ionicons name="trash-outline" size={20} color={colors.error} />
                <Text style={styles.deleteZoneText}>Delete Zone</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Garden Zones</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={24} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{zones.length}</Text>
            <Text style={styles.summaryLabel}>Active Zones</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{zones.reduce((total, zone) => total + zone.plants.length, 0)}</Text>
            <Text style={styles.summaryLabel}>Total Plants</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{zones.filter(z => z.health === 'excellent' || z.health === 'good').length}</Text>
            <Text style={styles.summaryLabel}>Healthy Zones</Text>
          </View>
        </View>

        <View style={styles.zonesContainer}>
          {zones.map(renderZoneCard)}
        </View>
      </ScrollView>

      {/* Add Zone Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Zone</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Zone Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={newZone.name}
                  onChangeText={(text) => setNewZone({...newZone, name: text})}
                  placeholder="e.g., Vegetable Patch, Rose Garden"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Zone Type</Text>
                <View style={styles.typeButtons}>
                  {zoneTypes.map((type) => (
                    <TouchableOpacity
                      key={type.key}
                      style={[
                        styles.typeButton,
                        newZone.type === type.key && styles.activeTypeButton,
                        { borderColor: type.color }
                      ]}
                      onPress={() => setNewZone({...newZone, type: type.key as any})}
                    >
                      <Ionicons 
                        name={type.icon as any} 
                        size={20} 
                        color={newZone.type === type.key ? type.color : colors.text.secondary} 
                      />
                      <Text style={[
                        styles.typeButtonText,
                        newZone.type === type.key && { color: type.color }
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Size</Text>
                <TextInput
                  style={styles.textInput}
                  value={newZone.size}
                  onChangeText={(text) => setNewZone({...newZone, size: text})}
                  placeholder="e.g., 3m x 2m, 5 sq ft"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Soil Type (Optional)</Text>
                <TextInput
                  style={styles.textInput}
                  value={newZone.soilType}
                  onChangeText={(text) => setNewZone({...newZone, soilType: text})}
                  placeholder="e.g., Loamy, Sandy, Clay"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Sunlight</Text>
                <View style={styles.sunlightButtons}>
                  {['full', 'partial', 'shade'].map((sunlight) => (
                    <TouchableOpacity
                      key={sunlight}
                      style={[
                        styles.sunlightButton,
                        newZone.sunlight === sunlight && styles.activeSunlightButton
                      ]}
                      onPress={() => setNewZone({...newZone, sunlight: sunlight as any})}
                    >
                      <Ionicons 
                        name={getSunlightIcon(sunlight) as any} 
                        size={20} 
                        color={newZone.sunlight === sunlight ? colors.surface : colors.text.secondary} 
                      />
                      <Text style={[
                        styles.sunlightButtonText,
                        newZone.sunlight === sunlight && styles.activeSunlightButtonText
                      ]}>
                        {sunlight.charAt(0).toUpperCase() + sunlight.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Notes (Optional)</Text>
                <TextInput
                  style={[styles.textInput, styles.notesInput]}
                  value={newZone.notes}
                  onChangeText={(text) => setNewZone({...newZone, notes: text})}
                  placeholder="Additional notes about this zone"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={addNewZone}
              >
                <Text style={styles.saveButtonText}>Add Zone</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {renderZoneDetails()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.surface,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.md,
  },
  addButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryNumber: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  summaryLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  zonesContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  zoneCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  zoneTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  zoneType: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  healthIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  zoneStats: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.lg,
  },
  zoneStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  zoneStatText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  plantsPreview: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  plantsCount: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  plantsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  plantTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  plantStatus: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  plantName: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
  },
  morePlants: {
    fontSize: fontSize.xs,
    color: colors.text.hint,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  modalForm: {
    padding: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text.primary,
    backgroundColor: colors.background,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing.xs,
    minWidth: '30%',
  },
  activeTypeButton: {
    backgroundColor: colors.background,
  },
  typeButtonText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  sunlightButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sunlightButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  activeSunlightButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sunlightButtonText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  activeSunlightButtonText: {
    color: colors.surface,
    fontWeight: fontWeight.medium,
  },
  modalActions: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.secondary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.surface,
  },
  detailsModal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '90%',
    height: '90%',
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailsTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  detailsContent: {
    flex: 1,
    padding: spacing.lg,
  },
  detailsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  detailsGrid: {
    gap: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  detailLabel: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  detailValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  healthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  healthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  plantCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  plantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  plantNameDetail: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
    flex: 1,
  },
  plantVariety: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginRight: spacing.sm,
  },
  plantStatusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  plantStatusText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.surface,
    textTransform: 'capitalize',
  },
  plantDetails: {
    gap: 2,
  },
  plantDetail: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  emptyPlants: {
    fontSize: fontSize.md,
    color: colors.text.hint,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: spacing.lg,
  },
  notesText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  detailsActions: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  deleteZoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.error,
    gap: spacing.sm,
  },
  deleteZoneText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.error,
  },
});

export default GardenZonesScreen;
