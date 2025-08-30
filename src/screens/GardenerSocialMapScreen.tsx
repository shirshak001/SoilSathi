import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Modal,
  TextInput,
  Dimensions,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface GardenerSocialMapScreenProps {
  navigation: any;
}

interface NearbyGardener {
  id: string;
  name: string;
  avatar: string;
  distance: number;
  specialties: string[];
  rating: number;
  plantsShared: number;
  joinedDate: string;
  location: {
    latitude: number;
    longitude: number;
  };
  availableExchanges: PlantExchange[];
  gardenType: 'indoor' | 'outdoor' | 'both';
  experience: 'beginner' | 'intermediate' | 'expert';
}

interface PlantExchange {
  id: string;
  plantName: string;
  plantType: 'cutting' | 'seedling' | 'mature' | 'seeds';
  image: string;
  description: string;
  isOffering: boolean;
  isLookingFor: boolean;
}

interface CommunityEvent {
  id: string;
  title: string;
  type: 'workshop' | 'exchange' | 'garden_tour' | 'planting_day';
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendees: number;
  maxAttendees: number;
  description: string;
  requirements: string[];
}

const { width, height } = Dimensions.get('window');

const GardenerSocialMapScreen: React.FC<GardenerSocialMapScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { translations } = useLanguage();

  const [selectedTab, setSelectedTab] = useState<'map' | 'gardeners' | 'exchange' | 'events'>('gardeners');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedGardener, setSelectedGardener] = useState<NearbyGardener | null>(null);
  const [showGardenerModal, setShowGardenerModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [searchRadius, setSearchRadius] = useState(5); // km
  const [filterExperience, setFilterExperience] = useState<string>('all');
  const [filterGardenType, setFilterGardenType] = useState<string>('all');

  const tabs = [
    { key: 'gardeners', label: 'Gardeners', icon: 'people' },
    { key: 'exchange', label: 'Exchange', icon: 'swap-horizontal' },
    { key: 'events', label: 'Events', icon: 'calendar' },
    { key: 'map', label: 'Map', icon: 'map' },
  ];

  const nearbyGardeners: NearbyGardener[] = [
    {
      id: '1',
      name: 'Priya Sharma',
      avatar: 'person-circle',
      distance: 0.8,
      specialties: ['Roses', 'Herbs', 'Organic farming'],
      rating: 4.8,
      plantsShared: 23,
      joinedDate: '2023-05-15',
      location: { latitude: 28.6139, longitude: 77.2090 },
      gardenType: 'both',
      experience: 'expert',
      availableExchanges: [
        {
          id: '1',
          plantName: 'Rose Cuttings',
          plantType: 'cutting',
          image: 'rose',
          description: 'Healthy pink rose cuttings from my garden',
          isOffering: true,
          isLookingFor: false,
        },
        {
          id: '2',
          plantName: 'Basil Seeds',
          plantType: 'seeds',
          image: 'leaf',
          description: 'Organic Thai basil seeds',
          isOffering: true,
          isLookingFor: false,
        },
      ],
    },
    {
      id: '2',
      name: 'Raj Patel',
      avatar: 'person-circle',
      distance: 1.2,
      specialties: ['Succulents', 'Indoor plants', 'Hydroponics'],
      rating: 4.6,
      plantsShared: 15,
      joinedDate: '2023-08-20',
      location: { latitude: 28.6129, longitude: 77.2085 },
      gardenType: 'indoor',
      experience: 'intermediate',
      availableExchanges: [
        {
          id: '3',
          plantName: 'Monstera Cutting',
          plantType: 'cutting',
          image: 'leaf',
          description: 'Monstera deliciosa cutting with aerial roots',
          isOffering: true,
          isLookingFor: false,
        },
      ],
    },
    {
      id: '3',
      name: 'Anita Singh',
      avatar: 'person-circle',
      distance: 2.1,
      specialties: ['Vegetables', 'Medicinal plants', 'Composting'],
      rating: 4.9,
      plantsShared: 34,
      joinedDate: '2022-11-10',
      location: { latitude: 28.6149, longitude: 77.2095 },
      gardenType: 'outdoor',
      experience: 'expert',
      availableExchanges: [
        {
          id: '4',
          plantName: 'Tomato Seedlings',
          plantType: 'seedling',
          image: 'nutrition',
          description: 'Cherry tomato seedlings, 4 weeks old',
          isOffering: true,
          isLookingFor: false,
        },
        {
          id: '5',
          plantName: 'Tulsi Plant',
          plantType: 'mature',
          image: 'leaf',
          description: 'Looking for healthy tulsi plant',
          isOffering: false,
          isLookingFor: true,
        },
      ],
    },
    {
      id: '4',
      name: 'Vikram Kumar',
      avatar: 'school',
      distance: 3.5,
      specialties: ['Flowering plants', 'Landscaping', 'Native plants'],
      rating: 4.4,
      plantsShared: 12,
      joinedDate: '2024-01-05',
      location: { latitude: 28.6159, longitude: 77.2100 },
      gardenType: 'outdoor',
      experience: 'beginner',
      availableExchanges: [
        {
          id: '6',
          plantName: 'Marigold Seeds',
          plantType: 'seeds',
          image: 'flower',
          description: 'Fresh marigold seeds from my garden',
          isOffering: true,
          isLookingFor: false,
        },
      ],
    },
  ];

  const communityEvents: CommunityEvent[] = [
    {
      id: '1',
      title: 'Rose Propagation Workshop',
      type: 'workshop',
      date: '2024-09-15',
      time: '10:00 AM',
      location: 'Lodhi Gardens, New Delhi',
      organizer: 'Priya Sharma',
      attendees: 8,
      maxAttendees: 15,
      description: 'Learn how to propagate roses from cuttings. Hands-on workshop with take-home cuttings.',
      requirements: ['Bring gardening gloves', 'Small pots (optional)'],
    },
    {
      id: '2',
      title: 'Community Plant Exchange',
      type: 'exchange',
      date: '2024-09-20',
      time: '4:00 PM',
      location: 'Central Park, Connaught Place',
      organizer: 'Delhi Gardeners Society',
      attendees: 25,
      maxAttendees: 50,
      description: 'Bring plants, cuttings, or seeds to exchange with fellow gardeners.',
      requirements: ['Bring plants to exchange', 'Carry bags for new plants'],
    },
    {
      id: '3',
      title: 'Terrace Garden Tour',
      type: 'garden_tour',
      date: '2024-09-25',
      time: '5:30 PM',
      location: 'Vasant Kunj Residential Area',
      organizer: 'Anita Singh',
      attendees: 12,
      maxAttendees: 20,
      description: 'Visit beautifully maintained terrace gardens and learn space-efficient techniques.',
      requirements: ['Comfortable walking shoes', 'Notebook for tips'],
    },
    {
      id: '4',
      title: 'Monsoon Planting Day',
      type: 'planting_day',
      date: '2024-09-30',
      time: '7:00 AM',
      location: 'Ridge Forest, Delhi',
      organizer: 'Green Delhi Initiative',
      attendees: 45,
      maxAttendees: 100,
      description: 'Community tree planting drive to restore green cover.',
      requirements: ['Comfortable clothes', 'Water bottle', 'Registration required'],
    },
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Allow location access to find nearby gardeners');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const getFilteredGardeners = () => {
    return nearbyGardeners.filter(gardener => {
      const withinRadius = gardener.distance <= searchRadius;
      const experienceMatch = filterExperience === 'all' || gardener.experience === filterExperience;
      const gardenTypeMatch = filterGardenType === 'all' || 
                             gardener.gardenType === filterGardenType || 
                             gardener.gardenType === 'both';
      
      return withinRadius && experienceMatch && gardenTypeMatch;
    });
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'workshop': return 'school';
      case 'exchange': return 'swap-horizontal';
      case 'garden_tour': return 'walk';
      case 'planting_day': return 'leaf';
      default: return 'calendar';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return '#3498DB';
      case 'exchange': return '#2ECC71';
      case 'garden_tour': return '#9B59B6';
      case 'planting_day': return '#27AE60';
      default: return colors.primary;
    }
  };

  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case 'beginner': return '#3498DB';
      case 'intermediate': return '#F39C12';
      case 'expert': return '#27AE60';
      default: return colors.text.secondary;
    }
  };

  const handleConnectGardener = (gardener: NearbyGardener) => {
    Alert.alert(
      'Connect with Gardener',
      `Send a connection request to ${gardener.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Connect',
          onPress: () => {
            Alert.alert('Success', 'Connection request sent!');
          },
        },
      ]
    );
  };

  const handleRequestExchange = (exchange: PlantExchange, gardener: NearbyGardener) => {
    Alert.alert(
      'Request Plant Exchange',
      `Request ${exchange.plantName} from ${gardener.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request',
          onPress: () => {
            Alert.alert('Success', 'Exchange request sent!');
          },
        },
      ]
    );
  };

  const handleJoinEvent = (event: CommunityEvent) => {
    if (event.attendees >= event.maxAttendees) {
      Alert.alert('Event Full', 'This event is already at maximum capacity.');
      return;
    }

    Alert.alert(
      'Join Event',
      `Join "${event.title}" on ${event.date}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Join',
          onPress: () => {
            Alert.alert('Success', 'You have successfully joined the event!');
          },
        },
      ]
    );
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
    filterButton: {
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
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      borderRadius: borderRadius.lg,
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    tabText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.text.secondary,
      marginTop: spacing.xs / 2,
    },
    activeTabText: {
      color: colors.surface,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
    },
    filterContainer: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
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
    filterRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    filterLabel: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
    },
    filterPicker: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      minWidth: 120,
    },
    filterPickerText: {
      fontSize: fontSize.sm,
      color: colors.text.primary,
      textAlign: 'center',
    },
    gardenerCard: {
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
    gardenerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    avatar: {
      fontSize: 32,
      marginRight: spacing.md,
    },
    avatarContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    gardenerInfo: {
      flex: 1,
    },
    gardenerName: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    gardenerDistance: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.xs / 2,
    },
    gardenerBadges: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.xs,
    },
    experienceBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
      borderRadius: borderRadius.sm,
      marginRight: spacing.xs,
    },
    badgeText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.surface,
      textTransform: 'uppercase',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
    },
    gardenerStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.sm,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.primary,
    },
    statLabel: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      marginTop: spacing.xs / 2,
    },
    specialtiesContainer: {
      marginTop: spacing.sm,
    },
    specialtiesLabel: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    specialtyTag: {
      backgroundColor: colors.background,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
      borderRadius: borderRadius.sm,
      marginRight: spacing.xs,
      marginBottom: spacing.xs,
    },
    specialtyText: {
      fontSize: fontSize.xs,
      color: colors.text.primary,
    },
    gardenerActions: {
      flexDirection: 'row',
      marginTop: spacing.md,
    },
    actionButton: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.sm,
      alignItems: 'center',
      marginHorizontal: spacing.xs,
    },
    primaryButton: {
      backgroundColor: colors.primary,
    },
    secondaryButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    primaryButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.surface,
    },
    secondaryButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
    },
    exchangeCard: {
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
    exchangeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    exchangeLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    plantEmoji: {
      fontSize: 24,
      marginRight: spacing.md,
    },
    exchangeInfo: {
      flex: 1,
    },
    plantName: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    plantType: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      textTransform: 'capitalize',
    },
    exchangeType: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
      borderRadius: borderRadius.sm,
    },
    offeringType: {
      backgroundColor: '#2ECC71',
    },
    lookingForType: {
      backgroundColor: '#3498DB',
    },
    exchangeTypeText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.surface,
      textTransform: 'uppercase',
    },
    exchangeDescription: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.sm,
      lineHeight: 18,
    },
    exchangeOwner: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.sm,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    ownerName: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
      marginLeft: spacing.sm,
    },
    exchangeActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: spacing.sm,
    },
    eventCard: {
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
    eventHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    eventLeft: {
      flex: 1,
    },
    eventTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.xs / 2,
    },
    eventDateTime: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    eventTypeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
      borderRadius: borderRadius.sm,
    },
    eventTypeText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.surface,
      marginLeft: spacing.xs / 2,
      textTransform: 'uppercase',
    },
    eventDetails: {
      marginTop: spacing.sm,
    },
    eventLocation: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    eventOrganizer: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    eventDescription: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      lineHeight: 18,
      marginTop: spacing.sm,
    },
    attendanceInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.sm,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    attendanceText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    joinButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.sm,
    },
    joinButtonDisabled: {
      backgroundColor: colors.text.hint,
    },
    joinButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.surface,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xl * 2,
    },
    emptyStateText: {
      fontSize: fontSize.md,
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
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
      justifyContent: 'center',
    },
    closeButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      alignItems: 'center',
      marginTop: spacing.lg,
    },
    closeButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.surface,
    },
  });

  const styles = getStyles();

  const renderGardenersTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Search Radius:</Text>
          <TouchableOpacity style={styles.filterPicker}>
            <Text style={styles.filterPickerText}>{searchRadius} km</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Experience:</Text>
          <TouchableOpacity style={styles.filterPicker}>
            <Text style={styles.filterPickerText}>
              {filterExperience === 'all' ? 'All Levels' : filterExperience}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Garden Type:</Text>
          <TouchableOpacity style={styles.filterPicker}>
            <Text style={styles.filterPickerText}>
              {filterGardenType === 'all' ? 'All Types' : filterGardenType}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {getFilteredGardeners().map((gardener) => (
        <View key={gardener.id} style={styles.gardenerCard}>
          <View style={styles.gardenerHeader}>
            <View style={styles.avatarContainer}>
              <Ionicons name={gardener.avatar as any} size={24} color={colors.primary} />
            </View>
            <View style={styles.gardenerInfo}>
              <Text style={styles.gardenerName}>{gardener.name}</Text>
              <Text style={styles.gardenerDistance}>{gardener.distance} km away</Text>
              <View style={styles.gardenerBadges}>
                <View style={[styles.experienceBadge, { backgroundColor: getExperienceColor(gardener.experience) }]}>
                  <Text style={styles.badgeText}>{gardener.experience}</Text>
                </View>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#F39C12" />
                  <Text style={styles.ratingText}>{gardener.rating}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.gardenerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{gardener.plantsShared}</Text>
              <Text style={styles.statLabel}>Plants Shared</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{gardener.availableExchanges.length}</Text>
              <Text style={styles.statLabel}>Available</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{gardener.gardenType}</Text>
              <Text style={styles.statLabel}>Garden Type</Text>
            </View>
          </View>

          <View style={styles.specialtiesContainer}>
            <Text style={styles.specialtiesLabel}>Specialties:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {gardener.specialties.map((specialty, index) => (
                <View key={index} style={styles.specialtyTag}>
                  <Text style={styles.specialtyText}>{specialty}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.gardenerActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => {
                setSelectedGardener(gardener);
                setShowGardenerModal(true);
              }}
            >
              <Text style={styles.secondaryButtonText}>View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => handleConnectGardener(gardener)}
            >
              <Text style={styles.primaryButtonText}>Connect</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderExchangeTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {nearbyGardeners.flatMap(gardener => 
        gardener.availableExchanges.map(exchange => (
          <View key={`${gardener.id}-${exchange.id}`} style={styles.exchangeCard}>
            <View style={styles.exchangeHeader}>
              <View style={styles.exchangeLeft}>
                <Ionicons name={exchange.image as any} size={24} color={colors.primary} />
                <View style={styles.exchangeInfo}>
                  <Text style={styles.plantName}>{exchange.plantName}</Text>
                  <Text style={styles.plantType}>{exchange.plantType}</Text>
                </View>
              </View>
              <View style={[
                styles.exchangeType,
                exchange.isOffering ? styles.offeringType : styles.lookingForType
              ]}>
                <Text style={styles.exchangeTypeText}>
                  {exchange.isOffering ? 'Offering' : 'Looking For'}
                </Text>
              </View>
            </View>

            <Text style={styles.exchangeDescription}>{exchange.description}</Text>

            <View style={styles.exchangeOwner}>
              <View style={styles.avatarContainer}>
                <Ionicons name={gardener.avatar as any} size={20} color={colors.primary} />
              </View>
              <Text style={styles.ownerName}>{gardener.name}</Text>
              <Text style={styles.gardenerDistance}> • {gardener.distance} km away</Text>
            </View>

            <View style={styles.exchangeActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={() => handleRequestExchange(exchange, gardener)}
              >
                <Text style={styles.primaryButtonText}>
                  {exchange.isOffering ? 'Request' : 'Offer'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );

  const renderEventsTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {communityEvents.map((event) => (
        <View key={event.id} style={styles.eventCard}>
          <View style={styles.eventHeader}>
            <View style={styles.eventLeft}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDateTime}>
                {event.date} at {event.time}
              </Text>
            </View>
            <View style={[styles.eventTypeBadge, { backgroundColor: getEventTypeColor(event.type) }]}>
              <Ionicons
                name={getEventTypeIcon(event.type) as any}
                size={12}
                color={colors.surface}
              />
              <Text style={styles.eventTypeText}>{event.type.replace('_', ' ')}</Text>
            </View>
          </View>

          <View style={styles.eventDetails}>
            <Text style={styles.eventLocation}>📍 {event.location}</Text>
            <Text style={styles.eventOrganizer}>👤 Organized by {event.organizer}</Text>
            <Text style={styles.eventDescription}>{event.description}</Text>
          </View>

          <View style={styles.attendanceInfo}>
            <Text style={styles.attendanceText}>
              {event.attendees}/{event.maxAttendees} attendees
            </Text>
            <TouchableOpacity
              style={[
                styles.joinButton,
                event.attendees >= event.maxAttendees && styles.joinButtonDisabled
              ]}
              onPress={() => handleJoinEvent(event)}
              disabled={event.attendees >= event.maxAttendees}
            >
              <Text style={styles.joinButtonText}>
                {event.attendees >= event.maxAttendees ? 'Full' : 'Join'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderMapTab = () => (
    <View style={styles.emptyState}>
      <Ionicons name="map" size={64} color={colors.text.secondary} />
      <Text style={styles.emptyStateText}>
        Interactive map feature coming soon!{'\n'}
        Use the Gardeners tab to find nearby gardening enthusiasts.
      </Text>
    </View>
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
            <Text style={styles.headerTitle}>Gardener Social Map</Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options" size={24} color={colors.surface} />
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
        {selectedTab === 'gardeners' && renderGardenersTab()}
        {selectedTab === 'exchange' && renderExchangeTab()}
        {selectedTab === 'events' && renderEventsTab()}
        {selectedTab === 'map' && renderMapTab()}
      </View>

      {/* Gardener Profile Modal */}
      <Modal
        visible={showGardenerModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGardenerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedGardener && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.avatarContainer}>
                    <Ionicons name={selectedGardener.avatar as any} size={24} color={colors.primary} />
                  </View>
                  <Text style={styles.modalTitle}>
                    {selectedGardener.name}
                  </Text>
                </View>
                
                <ScrollView style={{ maxHeight: height * 0.6 }}>
                  <Text style={styles.eventDescription}>
                    {selectedGardener.experience.charAt(0).toUpperCase() + selectedGardener.experience.slice(1)} gardener specializing in {selectedGardener.specialties.join(', ')}.
                  </Text>
                  
                  <Text style={styles.eventDescription}>
                    Active member since {selectedGardener.joinedDate}, with {selectedGardener.plantsShared} plants shared in the community.
                  </Text>
                  
                  <Text style={styles.eventDescription}>
                    Garden Type: {selectedGardener.gardenType}
                  </Text>
                  
                  <Text style={styles.eventDescription}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.gardenerInfo}>Rating: {selectedGardener.rating}/5</Text>
                      <Ionicons name="star" size={16} color={colors.warning} style={{ marginLeft: spacing.xs }} />
                    </View>
                  </Text>
                </ScrollView>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowGardenerModal(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GardenerSocialMapScreen;
