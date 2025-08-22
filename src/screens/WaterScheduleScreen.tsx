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

interface WaterScheduleScreenProps {
  navigation: any;
}

interface WaterSchedule {
  id: string;
  plantName: string;
  location: string;
  wateringTime: string;
  frequency: string;
  amount: string;
  lastWatered: string;
  nextWatering: string;
  isActive: boolean;
  priority: 'low' | 'medium' | 'high';
}

const WaterScheduleScreen: React.FC<WaterScheduleScreenProps> = ({ navigation }) => {
  const [schedules, setSchedules] = useState<WaterSchedule[]>([
    {
      id: '1',
      plantName: 'Tomatoes (Field A)',
      location: 'North Field',
      wateringTime: '06:00 AM',
      frequency: 'Daily',
      amount: '15L per plant',
      lastWatered: '2025-08-22',
      nextWatering: '2025-08-23',
      isActive: true,
      priority: 'high'
    },
    {
      id: '2',
      plantName: 'Rose Garden',
      location: 'Front Yard',
      wateringTime: '07:30 AM',
      frequency: 'Every 2 days',
      amount: '5L per bush',
      lastWatered: '2025-08-21',
      nextWatering: '2025-08-23',
      isActive: true,
      priority: 'medium'
    },
    {
      id: '3',
      plantName: 'Herb Garden',
      location: 'Kitchen Garden',
      wateringTime: '06:30 AM',
      frequency: 'Daily',
      amount: '2L total',
      lastWatered: '2025-08-22',
      nextWatering: '2025-08-23',
      isActive: true,
      priority: 'medium'
    },
    {
      id: '4',
      plantName: 'Corn Field',
      location: 'South Field',
      wateringTime: '05:30 AM',
      frequency: 'Every 3 days',
      amount: '20L per section',
      lastWatered: '2025-08-20',
      nextWatering: '2025-08-23',
      isActive: false,
      priority: 'low'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const todaySchedules = schedules.filter(schedule => 
    schedule.nextWatering === '2025-08-23' && schedule.isActive
  );

  const upcomingSchedules = schedules.filter(schedule => 
    schedule.nextWatering > '2025-08-23' && schedule.isActive
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.text.secondary;
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? colors.success : colors.text.hint;
  };

  const toggleSchedule = (id: string) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === id 
        ? { ...schedule, isActive: !schedule.isActive }
        : schedule
    ));
  };

  const markAsWatered = (id: string) => {
    const schedule = schedules.find(s => s.id === id);
    if (schedule) {
      const today = new Date();
      const nextDate = new Date(today);
      
      // Calculate next watering date based on frequency
      switch (schedule.frequency) {
        case 'Daily':
          nextDate.setDate(today.getDate() + 1);
          break;
        case 'Every 2 days':
          nextDate.setDate(today.getDate() + 2);
          break;
        case 'Every 3 days':
          nextDate.setDate(today.getDate() + 3);
          break;
        case 'Weekly':
          nextDate.setDate(today.getDate() + 7);
          break;
      }

      setSchedules(schedules.map(s => 
        s.id === id 
          ? { 
              ...s, 
              lastWatered: today.toISOString().split('T')[0],
              nextWatering: nextDate.toISOString().split('T')[0]
            }
          : s
      ));

      Alert.alert('Success', `${schedule.plantName} marked as watered!`);
    }
  };

  const renderScheduleCard = (schedule: WaterSchedule) => (
    <View key={schedule.id} style={styles.scheduleCard}>
      <View style={styles.scheduleHeader}>
        <View style={styles.plantInfo}>
          <Text style={styles.plantName}>{schedule.plantName}</Text>
          <Text style={styles.location}>{schedule.location}</Text>
        </View>
        <View style={styles.scheduleControls}>
          <View style={[
            styles.priorityDot,
            { backgroundColor: getPriorityColor(schedule.priority) }
          ]} />
          <TouchableOpacity
            onPress={() => toggleSchedule(schedule.id)}
            style={styles.toggleButton}
          >
            <Ionicons 
              name={schedule.isActive ? "checkmark-circle" : "ellipse-outline"} 
              size={24} 
              color={getStatusColor(schedule.isActive)} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.scheduleDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="time" size={16} color={colors.primary} />
          <Text style={styles.detailText}>{schedule.wateringTime}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="repeat" size={16} color={colors.primary} />
          <Text style={styles.detailText}>{schedule.frequency}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="water" size={16} color={colors.primary} />
          <Text style={styles.detailText}>{schedule.amount}</Text>
        </View>
      </View>

      <View style={styles.scheduleFooter}>
        <View style={styles.dateInfo}>
          <Text style={styles.dateLabel}>Last: {schedule.lastWatered}</Text>
          <Text style={styles.dateLabel}>Next: {schedule.nextWatering}</Text>
        </View>
        {schedule.nextWatering === '2025-08-23' && schedule.isActive && (
          <TouchableOpacity
            style={styles.waterButton}
            onPress={() => markAsWatered(schedule.id)}
          >
            <Ionicons name="checkmark" size={16} color={colors.surface} />
            <Text style={styles.waterButtonText}>Mark Watered</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
          <Text style={styles.headerTitle}>Water Schedule</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={24} color={colors.surface} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{todaySchedules.length}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{schedules.filter(s => s.isActive).length}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{upcomingSchedules.length}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {todaySchedules.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Watering</Text>
            {todaySchedules.map(renderScheduleCard)}
          </View>
        )}

        {upcomingSchedules.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Schedule</Text>
            {upcomingSchedules.map(renderScheduleCard)}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Schedules</Text>
          {schedules.map(renderScheduleCard)}
        </View>
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Schedule</Text>
            <Text style={styles.modalSubtitle}>
              This feature is coming soon! You'll be able to add custom watering schedules.
            </Text>
            <CustomButton
              title="Close"
              onPress={() => setShowAddModal(false)}
              style={styles.closeButton}
            />
          </View>
        </View>
      </Modal>
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
  addButton: {
    padding: spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.surface,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  scheduleCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  plantInfo: {
    flex: 1,
  },
  plantName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  location: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs / 2,
  },
  scheduleControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  toggleButton: {
    padding: spacing.xs,
  },
  scheduleDetails: {
    marginBottom: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  detailText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  scheduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: fontSize.xs,
    color: colors.text.hint,
  },
  waterButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  waterButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
    marginLeft: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    margin: spacing.lg,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  modalSubtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  closeButton: {
    minWidth: 120,
  },
});

export default WaterScheduleScreen;
