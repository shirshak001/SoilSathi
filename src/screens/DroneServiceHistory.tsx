import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface DroneServiceHistoryProps {
  navigation: any;
}

interface ServiceBooking {
  id: string;
  date: string;
  field: string;
  service: string;
  sectors: string;
  area: string;
  cost: number;
  status: 'completed' | 'scheduled' | 'in-progress' | 'cancelled';
}

const DroneServiceHistory: React.FC<DroneServiceHistoryProps> = ({ navigation }) => {
  const bookings: ServiceBooking[] = [
    {
      id: '1',
      date: '2024-08-20',
      field: 'Field A - Wheat',
      service: 'NPK Fertilizer',
      sectors: 'Sectors 1, 2, 3',
      area: '3.3k sqm',
      cost: 495.00,
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-08-22',
      field: 'Field B - Corn',
      service: 'Pesticide Spray',
      sectors: 'Sectors 4, 5',
      area: '2.5k sqm',
      cost: 500.00,
      status: 'scheduled'
    },
    {
      id: '3',
      date: '2024-08-18',
      field: 'Field C - Tomatoes',
      service: 'Micronutrients',
      sectors: 'Sectors 1, 2, 3, 4',
      area: '5.3k sqm',
      cost: 954.00,
      status: 'completed'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return colors.success;
      case 'scheduled': return colors.warning;
      case 'in-progress': return colors.primary;
      case 'cancelled': return colors.error;
      default: return colors.text.secondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'scheduled': return 'time';
      case 'in-progress': return 'sync';
      case 'cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const renderBookingCard = (booking: ServiceBooking) => (
    <View key={booking.id} style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingDate}>{booking.date}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
            <Ionicons 
              name={getStatusIcon(booking.status) as keyof typeof Ionicons.glyphMap} 
              size={12} 
              color={colors.surface} 
            />
            <Text style={styles.statusText}>{booking.status.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.bookingCost}>₹{booking.cost.toFixed(2)}</Text>
      </View>
      
      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text style={styles.detailText}>{booking.field}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="leaf" size={16} color={colors.primary} />
          <Text style={styles.detailText}>{booking.service}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="grid" size={16} color={colors.primary} />
          <Text style={styles.detailText}>{booking.sectors} • {booking.area}</Text>
        </View>
      </View>
      
      <View style={styles.bookingActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
        {booking.status === 'scheduled' && (
          <TouchableOpacity style={[styles.actionButton, styles.cancelButton]}>
            <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Cancel</Text>
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
          <Text style={styles.headerTitle}>Service History</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Drone Service Bookings</Text>
          <Text style={styles.sectionSubtitle}>
            Track all your drone service requests and their status
          </Text>
        </View>

        <View style={styles.bookingsContainer}>
          {bookings.map(renderBookingCard)}
        </View>

        <TouchableOpacity
          style={styles.newBookingButton}
          onPress={() => navigation.navigate('DroneService')}
        >
          <Ionicons name="add-circle" size={24} color={colors.primary} />
          <Text style={styles.newBookingText}>Book New Service</Text>
        </TouchableOpacity>
      </ScrollView>
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
  bookingsContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  bookingCard: {
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
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingDate: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
    marginLeft: spacing.xs / 2,
  },
  bookingCost: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  bookingDetails: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  bookingActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  cancelButton: {
    borderColor: colors.error,
  },
  actionButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },
  cancelButtonText: {
    color: colors.error,
  },
  newBookingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xl,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  newBookingText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
});

export default DroneServiceHistory;
