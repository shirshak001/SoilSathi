import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput,
  FlatList,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface DataExportScreenProps {
  navigation: any;
}

type ExportFormat = 'csv' | 'pdf' | 'json' | 'excel';

interface DataItem {
  id: string;
  name: string;
  type: string;
  icon: string;
  size: string;
  lastModified: string;
  description: string;
}

const DataExportScreen: React.FC<DataExportScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { translations } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const [exportFileName, setExportFileName] = useState('');
  const [dateRange, setDateRange] = useState<'all' | '1week' | '1month' | '3months' | 'custom'>('all');

  // Mock data for export
  const DATA: DataItem[] = [
    {
      id: '1',
      name: 'Soil Moisture Readings',
      type: 'sensor-data',
      icon: 'water',
      size: '2.4 MB',
      lastModified: '2 days ago',
      description: 'High-resolution soil moisture readings collected from field sensors over the past month',
    },
    {
      id: '2',
      name: 'Crop Yield History',
      type: 'analytics',
      icon: 'analytics',
      size: '1.8 MB',
      lastModified: '1 week ago',
      description: 'Historical crop yield data with seasonal trends and comparative analysis',
    },
    {
      id: '3',
      name: 'Fertilizer Application Log',
      type: 'activity',
      icon: 'leaf',
      size: '3.1 MB',
      lastModified: '3 days ago',
      description: 'Detailed logs of fertilizer applications including types, rates, and application dates',
    },
    {
      id: '4',
      name: 'Weather Station Recordings',
      type: 'sensor-data',
      icon: 'cloudy',
      size: '5.7 MB',
      lastModified: '12 hours ago',
      description: 'Hourly weather data including temperature, humidity, wind speed, and precipitation',
    },
    {
      id: '5',
      name: 'Pest Monitoring Records',
      type: 'activity',
      icon: 'bug',
      size: '1.2 MB',
      lastModified: '5 days ago',
      description: 'Pest monitoring records with identified species, population counts, and treatment responses',
    },
    {
      id: '6',
      name: 'Irrigation Schedules',
      type: 'schedule',
      icon: 'timer',
      size: '0.8 MB',
      lastModified: '1 day ago',
      description: 'Automated and manual irrigation events with water usage metrics and efficiency analysis',
    },
    {
      id: '7',
      name: 'Soil Health Analysis',
      type: 'report',
      icon: 'flask',
      size: '4.2 MB',
      lastModified: '2 weeks ago',
      description: 'Comprehensive soil health reports including pH, nutrient levels, organic matter, and microbial activity',
    },
    {
      id: '8',
      name: 'Field Boundaries',
      type: 'geo-data',
      icon: 'map',
      size: '3.5 MB',
      lastModified: '1 month ago',
      description: 'Geospatial data defining field boundaries, zones, and management areas with GPS coordinates',
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sensor-data':
        return 'hardware-chip';
      case 'analytics':
        return 'analytics';
      case 'activity':
        return 'clipboard';
      case 'schedule':
        return 'calendar';
      case 'report':
        return 'document-text';
      case 'geo-data':
        return 'globe';
      default:
        return 'document';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sensor-data':
        return '#0288D1';
      case 'analytics':
        return '#7B1FA2';
      case 'activity':
        return '#388E3C';
      case 'schedule':
        return '#FFA000';
      case 'report':
        return '#E64A19';
      case 'geo-data':
        return '#5D4037';
      default:
        return colors.primary;
    }
  };

  const handleSelect = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredData.map(item => item.id));
    }
  };

  const handleExport = () => {
    if (selectedItems.length === 0) {
      Alert.alert('No Selection', 'Please select at least one data item to export');
      return;
    }

    setExportFileName(
      selectedItems.length === 1
        ? DATA.find(item => item.id === selectedItems[0])?.name || 'Export'
        : `Soil_Data_Export_${new Date().toISOString().split('T')[0]}`
    );
    setExportModalVisible(true);
  };

  const confirmExport = () => {
    if (!exportFileName.trim()) {
      Alert.alert('Missing Information', 'Please enter a file name for your export');
      return;
    }

    setExportModalVisible(false);
    
    // Simulate export process
    Alert.alert(
      'Export Successful',
      `${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} exported as ${exportFileName}.${exportFormat}`,
      [{ text: 'OK', onPress: () => setSelectedItems([]) }]
    );
  };

  // Filter data based on search query
  const filteredData = DATA.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    content: {
      flex: 1,
      padding: spacing.lg,
    },
    sectionTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    searchContainer: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.lg,
      alignItems: 'center',
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    searchInput: {
      flex: 1,
      paddingVertical: spacing.md,
      fontSize: fontSize.sm,
      color: colors.text.primary,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.sm,
      marginRight: spacing.sm,
      elevation: 1,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
    },
    actionButtonText: {
      fontSize: fontSize.sm,
      color: colors.text.primary,
      marginLeft: spacing.xs,
    },
    exportButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.sm,
      elevation: 1,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
    },
    exportButtonText: {
      fontSize: fontSize.sm,
      color: colors.surface,
      fontWeight: fontWeight.medium,
      marginLeft: spacing.xs,
    },
    itemCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      marginBottom: spacing.md,
      flexDirection: 'row',
      padding: spacing.md,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    itemCheckbox: {
      marginRight: spacing.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemTypeIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    itemContent: {
      flex: 1,
    },
    itemName: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    itemDescription: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.sm,
    },
    itemMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    itemMetaText: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      marginRight: spacing.md,
      marginLeft: spacing.xs,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.xl,
    },
    emptyText: {
      fontSize: fontSize.md,
      color: colors.text.secondary,
      textAlign: 'center',
      marginTop: spacing.md,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: spacing.lg,
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      width: '100%',
      maxWidth: 500,
      elevation: 5,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    modalTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.lg,
      textAlign: 'center',
    },
    modalInputLabel: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    modalInput: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.sm,
      padding: spacing.md,
      fontSize: fontSize.sm,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    formatGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: spacing.lg,
    },
    formatOption: {
      width: '48%',
      backgroundColor: colors.background,
      borderRadius: borderRadius.sm,
      padding: spacing.md,
      margin: '1%',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    formatOptionSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    formatIcon: {
      marginBottom: spacing.sm,
    },
    formatName: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
    },
    dateRangeOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: spacing.lg,
    },
    dateOption: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.sm,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      margin: spacing.xs,
      borderWidth: 1,
      borderColor: colors.border,
    },
    dateOptionSelected: {
      backgroundColor: colors.primary + '10',
      borderColor: colors.primary,
    },
    dateOptionText: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
    },
    dateOptionTextSelected: {
      color: colors.primary,
      fontWeight: fontWeight.medium,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    cancelButton: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: borderRadius.sm,
      padding: spacing.md,
      alignItems: 'center',
      marginRight: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cancelButtonText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    confirmButton: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: borderRadius.sm,
      padding: spacing.md,
      alignItems: 'center',
      marginLeft: spacing.sm,
    },
    confirmButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.surface,
    },
    summaryContainer: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.sm,
      padding: spacing.md,
      marginBottom: spacing.lg,
    },
    summaryText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    summaryValue: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
    },
  });

  const styles = getStyles();

  const renderItem = ({ item }: { item: DataItem }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => handleSelect(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.itemCheckbox}>
        <Ionicons
          name={selectedItems.includes(item.id) ? 'checkbox' : 'square-outline'}
          size={24}
          color={selectedItems.includes(item.id) ? colors.primary : colors.text.secondary}
        />
      </View>
      <View style={[styles.itemTypeIcon, { backgroundColor: getTypeColor(item.type) + '20' }]}>
        <Ionicons name={getTypeIcon(item.type)} size={20} color={getTypeColor(item.type)} />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.itemMeta}>
          <Ionicons name="document" size={12} color={colors.text.secondary} />
          <Text style={styles.itemMetaText}>{item.size}</Text>
          <Ionicons name="time" size={12} color={colors.text.secondary} />
          <Text style={styles.itemMetaText}>{item.lastModified}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primary + '80']}
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
            <Text style={styles.headerTitle}>Data Export</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>
          Select data to export as CSV, PDF, or other formats
        </Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search data files..."
            placeholderTextColor={colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.actionsContainer}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.actionButton} onPress={handleSelectAll}>
              <Ionicons
                name={
                  selectedItems.length === filteredData.length && filteredData.length > 0
                    ? 'checkbox'
                    : 'square-outline'
                }
                size={18}
                color={
                  selectedItems.length === filteredData.length && filteredData.length > 0
                    ? colors.primary
                    : colors.text.secondary
                }
              />
              <Text style={styles.actionButtonText}>
                {selectedItems.length === filteredData.length && filteredData.length > 0
                  ? 'Deselect All'
                  : 'Select All'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.exportButton,
              { opacity: selectedItems.length > 0 ? 1 : 0.5 },
            ]}
            onPress={handleExport}
            disabled={selectedItems.length === 0}
          >
            <Ionicons name="download" size={18} color={colors.surface} />
            <Text style={styles.exportButtonText}>
              Export ({selectedItems.length})
            </Text>
          </TouchableOpacity>
        </View>

        {filteredData.length > 0 ? (
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={48} color={colors.text.secondary} />
            <Text style={styles.emptyText}>
              No data files match your search criteria.
            </Text>
          </View>
        )}
      </View>

      {/* Export Modal */}
      <Modal
        visible={exportModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setExportModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Export Options</Text>

            <Text style={styles.modalInputLabel}>File Name</Text>
            <TextInput
              style={styles.modalInput}
              value={exportFileName}
              onChangeText={setExportFileName}
              placeholder="Enter file name"
              placeholderTextColor={colors.text.secondary}
            />

            <Text style={styles.modalInputLabel}>Format</Text>
            <View style={styles.formatGrid}>
              <TouchableOpacity
                style={[
                  styles.formatOption,
                  exportFormat === 'csv' && styles.formatOptionSelected,
                ]}
                onPress={() => setExportFormat('csv')}
              >
                <Ionicons
                  name="document-text"
                  size={28}
                  color={exportFormat === 'csv' ? colors.primary : colors.text.secondary}
                  style={styles.formatIcon}
                />
                <Text
                  style={[
                    styles.formatName,
                    { color: exportFormat === 'csv' ? colors.primary : colors.text.primary },
                  ]}
                >
                  CSV
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.formatOption,
                  exportFormat === 'pdf' && styles.formatOptionSelected,
                ]}
                onPress={() => setExportFormat('pdf')}
              >
                <Ionicons
                  name="document"
                  size={28}
                  color={exportFormat === 'pdf' ? colors.primary : colors.text.secondary}
                  style={styles.formatIcon}
                />
                <Text
                  style={[
                    styles.formatName,
                    { color: exportFormat === 'pdf' ? colors.primary : colors.text.primary },
                  ]}
                >
                  PDF
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.formatOption,
                  exportFormat === 'excel' && styles.formatOptionSelected,
                ]}
                onPress={() => setExportFormat('excel')}
              >
                <Ionicons
                  name="grid"
                  size={28}
                  color={exportFormat === 'excel' ? colors.primary : colors.text.secondary}
                  style={styles.formatIcon}
                />
                <Text
                  style={[
                    styles.formatName,
                    { color: exportFormat === 'excel' ? colors.primary : colors.text.primary },
                  ]}
                >
                  Excel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.formatOption,
                  exportFormat === 'json' && styles.formatOptionSelected,
                ]}
                onPress={() => setExportFormat('json')}
              >
                <Ionicons
                  name="code-slash"
                  size={28}
                  color={exportFormat === 'json' ? colors.primary : colors.text.secondary}
                  style={styles.formatIcon}
                />
                <Text
                  style={[
                    styles.formatName,
                    { color: exportFormat === 'json' ? colors.primary : colors.text.primary },
                  ]}
                >
                  JSON
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalInputLabel}>Data Range</Text>
            <View style={styles.dateRangeOptions}>
              <TouchableOpacity
                style={[
                  styles.dateOption,
                  dateRange === 'all' && styles.dateOptionSelected,
                ]}
                onPress={() => setDateRange('all')}
              >
                <Text
                  style={[
                    styles.dateOptionText,
                    dateRange === 'all' && styles.dateOptionTextSelected,
                  ]}
                >
                  All Data
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.dateOption,
                  dateRange === '1week' && styles.dateOptionSelected,
                ]}
                onPress={() => setDateRange('1week')}
              >
                <Text
                  style={[
                    styles.dateOptionText,
                    dateRange === '1week' && styles.dateOptionTextSelected,
                  ]}
                >
                  Last Week
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.dateOption,
                  dateRange === '1month' && styles.dateOptionSelected,
                ]}
                onPress={() => setDateRange('1month')}
              >
                <Text
                  style={[
                    styles.dateOptionText,
                    dateRange === '1month' && styles.dateOptionTextSelected,
                  ]}
                >
                  Last Month
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.dateOption,
                  dateRange === '3months' && styles.dateOptionSelected,
                ]}
                onPress={() => setDateRange('3months')}
              >
                <Text
                  style={[
                    styles.dateOptionText,
                    dateRange === '3months' && styles.dateOptionTextSelected,
                  ]}
                >
                  Last 3 Months
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.dateOption,
                  dateRange === 'custom' && styles.dateOptionSelected,
                ]}
                onPress={() => setDateRange('custom')}
              >
                <Text
                  style={[
                    styles.dateOptionText,
                    dateRange === 'custom' && styles.dateOptionTextSelected,
                  ]}
                >
                  Custom Range
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>
                Items to export: <Text style={styles.summaryValue}>{selectedItems.length}</Text>
              </Text>
              <Text style={styles.summaryText}>
                Format: <Text style={styles.summaryValue}>{exportFormat.toUpperCase()}</Text>
              </Text>
              <Text style={styles.summaryText}>
                Filename: <Text style={styles.summaryValue}>{exportFileName || '(Not specified)'}</Text>
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setExportModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmExport}
              >
                <Text style={styles.confirmButtonText}>Export Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DataExportScreen;