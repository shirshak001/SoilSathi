import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  Linking,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface GovernmentSchemesScreenProps {
  navigation: any;
}

interface Scheme {
  id: string;
  title: string;
  description: string;
  category: 'subsidy' | 'loan' | 'insurance' | 'training' | 'equipment';
  eligibility: string[];
  benefits: string;
  applicationDeadline: string;
  applicationLink: string;
  documentsRequired: string[];
  status: 'active' | 'upcoming' | 'expired';
  applicableFor: string[];
  state: string;
  subsidyAmount?: string;
}

interface UserProfile {
  cropType: string;
  farmSize: string;
  region: string;
  category: 'small' | 'marginal' | 'medium' | 'large';
}

const { width } = Dimensions.get('window');

const GovernmentSchemesScreen: React.FC<GovernmentSchemesScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { translations } = useLanguage();

  const [selectedTab, setSelectedTab] = useState<'eligible' | 'all' | 'applied'>('eligible');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const tabs = [
    { key: 'eligible', label: 'For You', icon: 'person' },
    { key: 'all', label: 'All Schemes', icon: 'list' },
    { key: 'applied', label: 'Applied', icon: 'checkmark-circle' },
  ];

  const categories = [
    { key: 'all', label: 'All Categories' },
    { key: 'subsidy', label: 'Subsidies' },
    { key: 'loan', label: 'Loans' },
    { key: 'insurance', label: 'Insurance' },
    { key: 'training', label: 'Training' },
    { key: 'equipment', label: 'Equipment' },
  ];

  // Mock user profile
  const userProfile: UserProfile = {
    cropType: 'wheat',
    farmSize: '5 acres',
    region: 'Punjab',
    category: 'small',
  };

  const schemes: Scheme[] = [
    {
      id: '1',
      title: 'PM-KISAN Direct Income Support',
      description: 'Financial assistance of ₹6,000 per year to small and marginal farmers',
      category: 'subsidy',
      eligibility: ['Small and marginal farmers', 'Land ownership documents', 'Aadhaar card'],
      benefits: '₹2,000 per installment (3 times a year)',
      applicationDeadline: '2024-12-31',
      applicationLink: 'https://www.pmkisan.gov.in/',
      documentsRequired: ['Aadhaar Card', 'Land Records', 'Bank Account Details'],
      status: 'active',
      applicableFor: ['wheat', 'rice', 'corn'],
      state: 'All India',
      subsidyAmount: '₹6,000/year',
    },
    {
      id: '2',
      title: 'Pradhan Mantri Fasal Bima Yojana',
      description: 'Crop insurance scheme providing financial support to farmers',
      category: 'insurance',
      eligibility: ['All farmers', 'Sharecroppers and tenant farmers', 'Must have Aadhaar'],
      benefits: 'Up to 100% sum insured for crop losses',
      applicationDeadline: '2024-10-15',
      applicationLink: 'https://pmfby.gov.in/',
      documentsRequired: ['Aadhaar Card', 'Land Records', 'Sowing Certificate', 'Bank Account'],
      status: 'active',
      applicableFor: ['wheat', 'rice', 'cotton', 'sugarcane'],
      state: 'All India',
    },
    {
      id: '3',
      title: 'Agriculture Infrastructure Fund',
      description: 'Financial assistance for creating agriculture infrastructure',
      category: 'loan',
      eligibility: ['Farmers', 'FPOs', 'Cooperatives', 'Start-ups'],
      benefits: '3% interest subvention, Credit guarantee coverage',
      applicationDeadline: '2024-11-30',
      applicationLink: 'https://agriinfra.dac.gov.in/',
      documentsRequired: ['Project Report', 'Land Documents', 'Registration Certificate'],
      status: 'active',
      applicableFor: ['storage', 'processing', 'logistics'],
      state: 'All India',
      subsidyAmount: 'Up to ₹2 Crore',
    },
    {
      id: '4',
      title: 'Sub-Mission on Agricultural Mechanization',
      description: 'Financial assistance for purchasing agricultural machinery',
      category: 'equipment',
      eligibility: ['Small and marginal farmers', 'Women farmers get priority'],
      benefits: '40-50% subsidy on agricultural equipment',
      applicationDeadline: '2024-09-30',
      applicationLink: 'https://agrimachinery.nic.in/',
      documentsRequired: ['Aadhaar Card', 'Land Records', 'Category Certificate'],
      status: 'active',
      applicableFor: ['tractors', 'harvesters', 'sprayers'],
      state: 'Punjab',
      subsidyAmount: '40-50% of equipment cost',
    },
    {
      id: '5',
      title: 'Kisan Credit Card Scheme',
      description: 'Flexible credit facility for farmers at concessional rates',
      category: 'loan',
      eligibility: ['All farmers', 'Tenant farmers', 'Sharecroppers'],
      benefits: '4% annual interest rate for prompt repayment',
      applicationDeadline: 'Ongoing',
      applicationLink: 'https://www.nabard.org/kcc.aspx',
      documentsRequired: ['Land Records', 'Identity Proof', 'Address Proof'],
      status: 'active',
      applicableFor: ['crop production', 'post-harvest expenses'],
      state: 'All India',
    },
    {
      id: '6',
      title: 'National Mission on Sustainable Agriculture',
      description: 'Training and capacity building for sustainable farming practices',
      category: 'training',
      eligibility: ['All farmers', 'Extension workers', 'Self-help groups'],
      benefits: 'Free training, certification, and technical support',
      applicationDeadline: '2024-10-31',
      applicationLink: 'https://nmsa.dac.gov.in/',
      documentsRequired: ['Identity Proof', 'Address Proof', 'Educational Qualification'],
      status: 'active',
      applicableFor: ['organic farming', 'water conservation', 'soil health'],
      state: 'All India',
    },
  ];

  const appliedSchemes = [
    { ...schemes[0], applicationDate: '2024-08-15', applicationStatus: 'approved' },
    { ...schemes[1], applicationDate: '2024-08-10', applicationStatus: 'pending' },
  ];

  const getEligibleSchemes = () => {
    return schemes.filter(scheme => {
      const isRegionMatch = scheme.state === 'All India' || scheme.state === userProfile.region;
      const isCropMatch = scheme.applicableFor.some(crop => 
        crop === userProfile.cropType || 
        crop === 'storage' || 
        crop === 'processing' || 
        crop === 'logistics' ||
        crop === 'organic farming' ||
        crop === 'water conservation' ||
        crop === 'soil health' ||
        crop === 'crop production' ||
        crop === 'post-harvest expenses' ||
        crop === 'tractors' ||
        crop === 'harvesters' ||
        crop === 'sprayers'
      );
      const isCategoryMatch = userProfile.category === 'small' || userProfile.category === 'marginal';
      
      return isRegionMatch && (isCropMatch || isCategoryMatch);
    });
  };

  const getFilteredSchemes = () => {
    let filteredSchemes = selectedTab === 'eligible' ? getEligibleSchemes() : 
                         selectedTab === 'applied' ? appliedSchemes : schemes;

    if (selectedCategory !== 'all') {
      filteredSchemes = filteredSchemes.filter(scheme => scheme.category === selectedCategory);
    }

    if (searchQuery) {
      filteredSchemes = filteredSchemes.filter(scheme =>
        scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredSchemes;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'subsidy':
        return 'cash';
      case 'loan':
        return 'card';
      case 'insurance':
        return 'shield-checkmark';
      case 'training':
        return 'school';
      case 'equipment':
        return 'construct';
      default:
        return 'document';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'subsidy':
        return '#10B981';
      case 'loan':
        return '#3B82F6';
      case 'insurance':
        return '#8B5CF6';
      case 'training':
        return '#F59E0B';
      case 'equipment':
        return '#EF4444';
      default:
        return colors.primary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10B981';
      case 'upcoming':
        return '#F59E0B';
      case 'expired':
        return '#EF4444';
      default:
        return colors.text.secondary;
    }
  };

  const handleApplyScheme = (scheme: Scheme) => {
    Alert.alert(
      'Apply for Scheme',
      `Do you want to apply for "${scheme.title}"? You will be redirected to the official application portal.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply',
          onPress: () => Linking.openURL(scheme.applicationLink),
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
    searchContainer: {
      backgroundColor: colors.surface,
      marginHorizontal: spacing.lg,
      marginTop: spacing.lg,
      borderRadius: borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    searchInput: {
      flex: 1,
      paddingVertical: spacing.md,
      fontSize: fontSize.sm,
      color: colors.text.primary,
      marginLeft: spacing.sm,
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
    categoryScroll: {
      marginHorizontal: spacing.lg,
      marginTop: spacing.lg,
    },
    categoryButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      marginRight: spacing.sm,
      elevation: 1,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 1,
    },
    activeCategoryButton: {
      backgroundColor: colors.primary,
    },
    categoryButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
    },
    activeCategoryButtonText: {
      color: colors.surface,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
    },
    userProfileCard: {
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
    profileTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    profileInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    profileItem: {
      width: '48%',
      marginBottom: spacing.xs,
    },
    profileLabel: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
    },
    profileValue: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
    },
    schemeCard: {
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
    schemeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    schemeLeft: {
      flex: 1,
      marginRight: spacing.md,
    },
    schemeTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.xs / 2,
    },
    schemeDescription: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      lineHeight: 20,
    },
    schemeRight: {
      alignItems: 'flex-end',
    },
    categoryBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
      borderRadius: borderRadius.sm,
      marginBottom: spacing.xs,
    },
    categoryBadgeText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.surface,
      marginLeft: spacing.xs / 2,
      textTransform: 'uppercase',
    },
    statusBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
      borderRadius: borderRadius.sm,
    },
    statusText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.surface,
      textTransform: 'uppercase',
    },
    schemeDetails: {
      marginTop: spacing.sm,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    detailLabel: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      flex: 1,
    },
    detailValue: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
      flex: 2,
      textAlign: 'right',
    },
    benefitText: {
      fontSize: fontSize.sm,
      color: colors.primary,
      fontWeight: fontWeight.medium,
      marginTop: spacing.xs,
    },
    actionButtons: {
      flexDirection: 'row',
      marginTop: spacing.md,
    },
    actionButton: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
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
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xl * 2,
    },
    emptyStateIcon: {
      marginBottom: spacing.lg,
    },
    emptyStateText: {
      fontSize: fontSize.md,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    appliedSchemeCard: {
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    applicationInfo: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.sm,
      padding: spacing.sm,
      marginTop: spacing.sm,
    },
    applicationDate: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      marginBottom: spacing.xs / 2,
    },
    applicationStatus: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
    },
    approvedStatus: {
      color: '#10B981',
    },
    pendingStatus: {
      color: '#F59E0B',
    },
    rejectedStatus: {
      color: '#EF4444',
    },
  });

  const styles = getStyles();

  const renderSchemeCard = (scheme: Scheme, isApplied: boolean = false) => (
    <View key={scheme.id} style={[styles.schemeCard, isApplied && styles.appliedSchemeCard]}>
      <View style={styles.schemeHeader}>
        <View style={styles.schemeLeft}>
          <Text style={styles.schemeTitle}>{scheme.title}</Text>
          <Text style={styles.schemeDescription}>{scheme.description}</Text>
        </View>
        <View style={styles.schemeRight}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(scheme.category) }]}>
            <Ionicons
              name={getCategoryIcon(scheme.category) as any}
              size={12}
              color={colors.surface}
            />
            <Text style={styles.categoryBadgeText}>{scheme.category}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(scheme.status) }]}>
            <Text style={styles.statusText}>{scheme.status}</Text>
          </View>
        </View>
      </View>

      <View style={styles.schemeDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Benefits:</Text>
          <Text style={styles.detailValue}>{scheme.benefits}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Deadline:</Text>
          <Text style={styles.detailValue}>{scheme.applicationDeadline}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>State:</Text>
          <Text style={styles.detailValue}>{scheme.state}</Text>
        </View>
        {scheme.subsidyAmount && (
          <Text style={styles.benefitText}>Subsidy: {scheme.subsidyAmount}</Text>
        )}
      </View>

      {isApplied && 'applicationDate' in scheme && (
        <View style={styles.applicationInfo}>
          <Text style={styles.applicationDate}>
            Applied on: {(scheme as any).applicationDate}
          </Text>
          <Text style={[
            styles.applicationStatus,
            (scheme as any).applicationStatus === 'approved' && styles.approvedStatus,
            (scheme as any).applicationStatus === 'pending' && styles.pendingStatus,
            (scheme as any).applicationStatus === 'rejected' && styles.rejectedStatus,
          ]}>
            Status: {(scheme as any).applicationStatus.toUpperCase()}
          </Text>
        </View>
      )}

      {!isApplied && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
            <Text style={styles.secondaryButtonText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => handleApplyScheme(scheme)}
          >
            <Text style={styles.primaryButtonText}>Apply Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderTabContent = () => {
    const filteredSchemes = getFilteredSchemes();

    if (filteredSchemes.length === 0) {
      return (
        <View style={styles.emptyState}>
          <View style={styles.emptyStateIcon}>
            <Ionicons name="document-text" size={64} color={colors.text.secondary} />
          </View>
          <Text style={styles.emptyStateText}>
            {selectedTab === 'eligible'
              ? 'No eligible schemes found for your profile'
              : selectedTab === 'applied'
              ? 'You haven\'t applied to any schemes yet'
              : 'No schemes found matching your criteria'}
          </Text>
        </View>
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedTab === 'eligible' && (
          <View style={styles.userProfileCard}>
            <Text style={styles.profileTitle}>Your Profile</Text>
            <View style={styles.profileInfo}>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Crop Type</Text>
                <Text style={styles.profileValue}>{userProfile.cropType}</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Farm Size</Text>
                <Text style={styles.profileValue}>{userProfile.farmSize}</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Region</Text>
                <Text style={styles.profileValue}>{userProfile.region}</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Category</Text>
                <Text style={styles.profileValue}>{userProfile.category} farmer</Text>
              </View>
            </View>
          </View>
        )}

        {filteredSchemes.map((scheme) =>
          renderSchemeCard(scheme, selectedTab === 'applied')
        )}
      </ScrollView>
    );
  };

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
            <Text style={styles.headerTitle}>Government Schemes</Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={24} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.text.secondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search schemes..."
          placeholderTextColor={colors.text.hint}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryButton,
              selectedCategory === category.key && styles.activeCategoryButton,
            ]}
            onPress={() => setSelectedCategory(category.key)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category.key && styles.activeCategoryButtonText,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.content}>{renderTabContent()}</View>
    </View>
  );
};

export default GovernmentSchemesScreen;
