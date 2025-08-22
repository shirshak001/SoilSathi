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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface PlantCareRemindersScreenProps {
  navigation: any;
}

interface Reminder {
  id: string;
  plant: string;
  task: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate: string;
  notes?: string;
}

const PlantCareRemindersScreen: React.FC<PlantCareRemindersScreenProps> = ({ navigation }) => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      plant: 'Tomatoes',
      task: 'Watering needed',
      time: 'Now',
      priority: 'high',
      completed: false,
      dueDate: 'Today',
      notes: 'Check soil moisture before watering'
    },
    {
      id: '2',
      plant: 'Roses',
      task: 'Fertilizer application',
      time: '2 hours',
      priority: 'medium',
      completed: false,
      dueDate: 'Today',
      notes: 'Use organic fertilizer'
    },
    {
      id: '3',
      plant: 'Basil',
      task: 'Pruning required',
      time: '1 day',
      priority: 'low',
      completed: false,
      dueDate: 'Tomorrow',
      notes: 'Remove flower buds to encourage leaf growth'
    },
    {
      id: '4',
      plant: 'Lavender',
      task: 'Pest inspection',
      time: '3 days',
      priority: 'medium',
      completed: true,
      dueDate: 'This week',
      notes: 'Check for aphids and spider mites'
    },
    {
      id: '5',
      plant: 'Mint',
      task: 'Repotting needed',
      time: '1 week',
      priority: 'low',
      completed: false,
      dueDate: 'Next week',
      notes: 'Use larger pot with drainage holes'
    },
    {
      id: '6',
      plant: 'Sunflowers',
      task: 'Support installation',
      time: '2 weeks',
      priority: 'medium',
      completed: false,
      dueDate: 'This month',
      notes: 'Install stakes before plants get too tall'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [showCompleted, setShowCompleted] = useState(false);

  const [newReminder, setNewReminder] = useState({
    plant: '',
    task: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDate: 'Today',
    notes: ''
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.text.secondary;
    }
  };

  const toggleReminderComplete = (id: string) => {
    setReminders(reminders.map(reminder =>
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    ));
  };

  const deleteReminder = (id: string) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setReminders(reminders.filter(r => r.id !== id))
        }
      ]
    );
  };

  const addNewReminder = () => {
    if (!newReminder.plant || !newReminder.task) {
      Alert.alert('Error', 'Please fill in plant name and task');
      return;
    }

    const reminder: Reminder = {
      id: Date.now().toString(),
      plant: newReminder.plant,
      task: newReminder.task,
      time: 'Now',
      priority: newReminder.priority,
      completed: false,
      dueDate: newReminder.dueDate,
      notes: newReminder.notes
    };

    setReminders([reminder, ...reminders]);
    setNewReminder({ plant: '', task: '', priority: 'medium', dueDate: 'Today', notes: '' });
    setShowAddModal(false);
  };

  const filteredReminders = reminders.filter(reminder => {
    const priorityMatch = filterPriority === 'all' || reminder.priority === filterPriority;
    const completedMatch = showCompleted || !reminder.completed;
    return priorityMatch && completedMatch;
  });

  const renderReminder = (reminder: Reminder) => (
    <View key={reminder.id} style={[styles.reminderCard, reminder.completed && styles.completedCard]}>
      <View style={styles.reminderHeader}>
        <View style={styles.reminderInfo}>
          <View style={styles.reminderTitleRow}>
            <Text style={[styles.plantName, reminder.completed && styles.completedText]}>
              {reminder.plant}
            </Text>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(reminder.priority) }]}>
              <Text style={styles.priorityText}>{reminder.priority.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={[styles.taskText, reminder.completed && styles.completedText]}>
            {reminder.task}
          </Text>
          <Text style={styles.dueDateText}>{reminder.dueDate} • {reminder.time}</Text>
          {reminder.notes && (
            <Text style={styles.notesText}>{reminder.notes}</Text>
          )}
        </View>
      </View>
      <View style={styles.reminderActions}>
        <TouchableOpacity
          style={[styles.actionButton, reminder.completed && styles.completedButton]}
          onPress={() => toggleReminderComplete(reminder.id)}
        >
          <Ionicons 
            name={reminder.completed ? "checkmark-circle" : "ellipse-outline"} 
            size={24} 
            color={reminder.completed ? colors.success : colors.text.secondary} 
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteReminder(reminder.id)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Plant Care Reminders</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={24} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Filter Controls */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {['all', 'high', 'medium', 'low'].map((priority) => (
            <TouchableOpacity
              key={priority}
              style={[
                styles.filterButton,
                filterPriority === priority && styles.activeFilterButton
              ]}
              onPress={() => setFilterPriority(priority as any)}
            >
              <Text style={[
                styles.filterButtonText,
                filterPriority === priority && styles.activeFilterButtonText
              ]}>
                {priority === 'all' ? 'All' : priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={[styles.toggleButton, showCompleted && styles.activeToggleButton]}
          onPress={() => setShowCompleted(!showCompleted)}
        >
          <Text style={[
            styles.toggleButtonText,
            showCompleted && styles.activeToggleButtonText
          ]}>
            Show Completed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{reminders.filter(r => !r.completed).length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{reminders.filter(r => r.completed).length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{reminders.filter(r => r.priority === 'high' && !r.completed).length}</Text>
            <Text style={styles.statLabel}>Urgent</Text>
          </View>
        </View>

        <View style={styles.remindersContainer}>
          {filteredReminders.length > 0 ? (
            filteredReminders.map(renderReminder)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="leaf-outline" size={64} color={colors.text.hint} />
              <Text style={styles.emptyStateText}>No reminders found</Text>
              <Text style={styles.emptyStateSubtext}>
                {filterPriority !== 'all' || showCompleted 
                  ? 'Try adjusting your filters' 
                  : 'Add your first plant care reminder'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Reminder Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Reminder</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Plant Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={newReminder.plant}
                  onChangeText={(text) => setNewReminder({...newReminder, plant: text})}
                  placeholder="e.g., Tomatoes, Roses"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Task Description</Text>
                <TextInput
                  style={styles.textInput}
                  value={newReminder.task}
                  onChangeText={(text) => setNewReminder({...newReminder, task: text})}
                  placeholder="e.g., Watering, Fertilizing, Pruning"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Priority</Text>
                <View style={styles.priorityButtons}>
                  {['high', 'medium', 'low'].map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.priorityButton,
                        newReminder.priority === priority && styles.activePriorityButton,
                        { borderColor: getPriorityColor(priority) }
                      ]}
                      onPress={() => setNewReminder({...newReminder, priority: priority as any})}
                    >
                      <Text style={[
                        styles.priorityButtonText,
                        newReminder.priority === priority && { color: getPriorityColor(priority) }
                      ]}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Notes (Optional)</Text>
                <TextInput
                  style={[styles.textInput, styles.notesInput]}
                  value={newReminder.notes}
                  onChangeText={(text) => setNewReminder({...newReminder, notes: text})}
                  placeholder="Additional notes or instructions"
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
                onPress={addNewReminder}
              >
                <Text style={styles.saveButtonText}>Add Reminder</Text>
              </TouchableOpacity>
            </View>
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
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterScroll: {
    flex: 1,
    marginRight: spacing.md,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  activeFilterButtonText: {
    color: colors.surface,
    fontWeight: fontWeight.medium,
  },
  toggleButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeToggleButton: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  toggleButtonText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  activeToggleButtonText: {
    color: colors.surface,
    fontWeight: fontWeight.medium,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  statCard: {
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
  remindersContainer: {
    padding: spacing.lg,
  },
  reminderCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  completedCard: {
    opacity: 0.6,
    backgroundColor: colors.background,
  },
  reminderHeader: {
    marginBottom: spacing.md,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  plantName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.text.secondary,
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  priorityText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  taskText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  dueDateText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  notesText: {
    fontSize: fontSize.sm,
    color: colors.text.hint,
    fontStyle: 'italic',
  },
  reminderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    padding: spacing.sm,
  },
  completedButton: {
    opacity: 0.8,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyStateText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    color: colors.text.secondary,
    marginTop: spacing.lg,
  },
  emptyStateSubtext: {
    fontSize: fontSize.md,
    color: colors.text.hint,
    marginTop: spacing.sm,
    textAlign: 'center',
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
  priorityButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  activePriorityButton: {
    backgroundColor: colors.background,
  },
  priorityButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.secondary,
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
});

export default PlantCareRemindersScreen;
