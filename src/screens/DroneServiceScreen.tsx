import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import CustomButton from '../components/CustomButton';

interface DroneServiceScreenProps {
  navigation: any;
}

interface Field {
  id: string;
  name: string;
  crop: string;
  area: number; // in square meters
  sectors: number;
  location: string;
}

interface DroneService {
  id: string;
  name: string;
  description: string;
  pricePerSqm: number; // price per square meter
  icon: string;
  category: 'fertilizer' | 'pesticide' | 'nutrient' | 'other';
}

const DroneServiceScreen: React.FC<DroneServiceScreenProps> = ({ navigation }) => {
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [selectedService, setSelectedService] = useState<DroneService | null>(null);
  const [selectedSectors, setSelectedSectors] = useState<number[]>([]);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showSectorModal, setShowSectorModal] = useState(false);

  const fields: Field[] = [
    {
      id: '1',
      name: 'Field A',
      crop: 'Wheat',
      area: 10000,
      sectors: 9,
      location: 'North Block'
    },
    {
      id: '2',
      name: 'Field B',
      crop: 'Corn',
      area: 15000,
      sectors: 12,
      location: 'South Block'
    },
    {
      id: '3',
      name: 'Field C',
      crop: 'Tomatoes',
      area: 8000,
      sectors: 6,
      location: 'East Block'
    },
  ];

  const droneServices: DroneService[] = [
    {
      id: '1',
      name: 'NPK Fertilizer',
      description: 'Balanced nitrogen, phosphorus, and potassium application',
      pricePerSqm: 0.15,
      icon: 'leaf',
      category: 'fertilizer'
    },
    {
      id: '2',
      name: 'Urea Fertilizer',
      description: 'High nitrogen content for vegetative growth',
      pricePerSqm: 0.12,
      icon: 'nutrition',
      category: 'fertilizer'
    },
    {
      id: '3',
      name: 'Pesticide Spray',
      description: 'Targeted pest control application',
      pricePerSqm: 0.20,
      icon: 'bug',
      category: 'pesticide'
    },
    {
      id: '4',
      name: 'Micronutrients',
      description: 'Essential trace elements for plant health',
      pricePerSqm: 0.18,
      icon: 'flask',
      category: 'nutrient'
    },
    {
      id: '5',
      name: 'Foliar Spray',
      description: 'Direct leaf application for quick absorption',
      pricePerSqm: 0.16,
      icon: 'water',
      category: 'nutrient'
    },
  ];

  const calculateTotalCost = () => {
    if (!selectedField || !selectedService || selectedSectors.length === 0) return 0;
    
    const sectorArea = selectedField.area / selectedField.sectors;
    const totalArea = sectorArea * selectedSectors.length;
    return totalArea * selectedService.pricePerSqm;
  };

  const handleBookService = () => {
    if (!selectedField || !selectedService || selectedSectors.length === 0) {
      Alert.alert('Incomplete Selection', 'Please select field, service, and sectors');
      return;
    }

    const totalCost = calculateTotalCost();
    const sectorNames = selectedSectors.map(s => `Sector ${s}`).join(', ');
    
    Alert.alert(
      'Confirm Booking',
      `Field: ${selectedField.name}\nService: ${selectedService.name}\nSectors: ${sectorNames}\nTotal Cost: ₹${totalCost.toFixed(2)}\n\nProceed with booking?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Book Now', 
          onPress: () => {
            Alert.alert('Success', 'Drone service booked successfully! You will receive a confirmation shortly.');
            navigation.goBack();
          }
        }
      ]
    );
  };

  const renderFieldModal = () => (
    <Modal
      visible={showFieldModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFieldModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Field</Text>
            <TouchableOpacity onPress={() => setShowFieldModal(false)}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView>
            {fields.map((field) => (
              <TouchableOpacity
                key={field.id}
                style={[
                  styles.modalItem,
                  selectedField?.id === field.id && styles.selectedModalItem
                ]}
                onPress={() => {
                  setSelectedField(field);
                  setSelectedSectors([]);
                  setShowFieldModal(false);
                }}
              >
                <View style={styles.fieldInfo}>
                  <Text style={styles.fieldName}>{field.name} - {field.crop}</Text>
                  <Text style={styles.fieldDetails}>
                    Area: {(field.area / 1000).toFixed(1)}k sqm • {field.sectors} sectors • {field.location}
                  </Text>
                </View>
                {selectedField?.id === field.id && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderServiceModal = () => (
    <Modal
      visible={showServiceModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowServiceModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Service</Text>
            <TouchableOpacity onPress={() => setShowServiceModal(false)}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView>
            {droneServices.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.modalItem,
                  selectedService?.id === service.id && styles.selectedModalItem
                ]}
                onPress={() => {
                  setSelectedService(service);
                  setShowServiceModal(false);
                }}
              >
                <View style={styles.serviceIconContainer}>
                  <Ionicons 
                    name={service.icon as keyof typeof Ionicons.glyphMap} 
                    size={24} 
                    color={colors.primary} 
                  />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDescription}>{service.description}</Text>
                  <Text style={styles.servicePrice}>₹{service.pricePerSqm}/sqm</Text>
                </View>
                {selectedService?.id === service.id && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderSectorModal = () => (
    <Modal
      visible={showSectorModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowSectorModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Sectors</Text>
            <TouchableOpacity onPress={() => setShowSectorModal(false)}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          {selectedField && (
            <View style={styles.sectorGrid}>
              {Array.from({ length: selectedField.sectors }, (_, i) => i + 1).map((sector) => (
                <TouchableOpacity
                  key={sector}
                  style={[
                    styles.sectorButton,
                    selectedSectors.includes(sector) && styles.selectedSectorButton
                  ]}
                  onPress={() => {
                    if (selectedSectors.includes(sector)) {
                      setSelectedSectors(selectedSectors.filter(s => s !== sector));
                    } else {
                      setSelectedSectors([...selectedSectors, sector]);
                    }
                  }}
                >
                  <Text style={[
                    styles.sectorText,
                    selectedSectors.includes(sector) && styles.selectedSectorText
                  ]}>
                    {sector}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          <CustomButton
            title="Done"
            onPress={() => setShowSectorModal(false)}
            style={styles.doneButton}
          />
        </View>
      </View>
    </Modal>
  );

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
          <Text style={styles.headerTitle}>Drone Services</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Book Drone Service</Text>
          <Text style={styles.sectionSubtitle}>
            Professional drone spraying services for your fields
          </Text>
        </View>

        <View style={styles.selectionContainer}>
          <TouchableOpacity
            style={styles.selectionCard}
            onPress={() => setShowFieldModal(true)}
          >
            <Ionicons name="location" size={24} color={colors.primary} />
            <View style={styles.selectionInfo}>
              <Text style={styles.selectionLabel}>Field</Text>
              <Text style={styles.selectionValue}>
                {selectedField ? `${selectedField.name} - ${selectedField.crop}` : 'Select Field'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.hint} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.selectionCard}
            onPress={() => setShowServiceModal(true)}
          >
            <Ionicons name="airplane" size={24} color={colors.primary} />
            <View style={styles.selectionInfo}>
              <Text style={styles.selectionLabel}>Service</Text>
              <Text style={styles.selectionValue}>
                {selectedService ? selectedService.name : 'Select Service'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.hint} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.selectionCard, !selectedField && styles.disabledCard]}
            onPress={() => selectedField && setShowSectorModal(true)}
            disabled={!selectedField}
          >
            <Ionicons name="grid" size={24} color={selectedField ? colors.primary : colors.text.disabled} />
            <View style={styles.selectionInfo}>
              <Text style={[styles.selectionLabel, !selectedField && styles.disabledText]}>Sectors</Text>
              <Text style={[styles.selectionValue, !selectedField && styles.disabledText]}>
                {selectedSectors.length > 0 
                  ? `${selectedSectors.length} sector(s) selected` 
                  : 'Select Sectors'
                }
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.hint} />
          </TouchableOpacity>
        </View>

        {selectedField && selectedService && selectedSectors.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Service Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Field:</Text>
              <Text style={styles.summaryValue}>{selectedField.name} - {selectedField.crop}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service:</Text>
              <Text style={styles.summaryValue}>{selectedService.name}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sectors:</Text>
              <Text style={styles.summaryValue}>
                {selectedSectors.map(s => `Sector ${s}`).join(', ')}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Area:</Text>
              <Text style={styles.summaryValue}>
                {((selectedField.area / selectedField.sectors) * selectedSectors.length / 1000).toFixed(1)}k sqm
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total Cost:</Text>
              <Text style={styles.totalValue}>₹{calculateTotalCost().toFixed(2)}</Text>
            </View>
          </View>
        )}

        <CustomButton
          title="Book Drone Service"
          onPress={handleBookService}
          disabled={!selectedField || !selectedService || selectedSectors.length === 0}
          fullWidth
          style={styles.bookButton}
        />
      </ScrollView>

      {renderFieldModal()}
      {renderServiceModal()}
      {renderSectorModal()}
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
  placeholder: {
    width: spacing.xl + spacing.md,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  selectionContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  selectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disabledCard: {
    opacity: 0.6,
  },
  selectionInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  selectionLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs / 2,
  },
  selectionValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  disabledText: {
    color: colors.text.disabled,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    margin: spacing.lg,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  totalLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  totalValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  bookButton: {
    margin: spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedModalItem: {
    backgroundColor: colors.background,
  },
  fieldInfo: {
    flex: 1,
  },
  fieldName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  fieldDetails: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs / 2,
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  serviceDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs / 2,
  },
  servicePrice: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.primary,
    marginTop: spacing.xs / 2,
  },
  sectorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  sectorButton: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSectorButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sectorText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  selectedSectorText: {
    color: colors.surface,
  },
  doneButton: {
    margin: spacing.lg,
  },
});

export default DroneServiceScreen;
