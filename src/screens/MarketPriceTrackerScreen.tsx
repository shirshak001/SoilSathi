import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface MarketPriceTrackerScreenProps {
  navigation: any;
}

interface CommodityPrice {
  id: string;
  name: string;
  market: string;
  price: number;
  unit: string;
  change: number;
  lastUpdated: string;
  state: string;
}

interface Market {
  id: string;
  name: string;
  state: string;
  district: string;
  commodities: number;
}

const { width } = Dimensions.get('window');

const MarketPriceTrackerScreen: React.FC<MarketPriceTrackerScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { translations } = useLanguage();

  const [activeTab, setActiveTab] = useState<'prices' | 'markets'>('prices');
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCommodity, setSelectedCommodity] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  // Mock data for commodity prices
  const mockCommodityPrices: CommodityPrice[] = [
    {
      id: '1',
      name: 'Rice (Basmati)',
      market: 'Azadpur Mandi, Delhi',
      price: 3250,
      unit: 'Quintal',
      change: 2.5,
      lastUpdated: '1 hour ago',
      state: 'Delhi',
    },
    {
      id: '2',
      name: 'Wheat',
      market: 'Khanna Mandi, Punjab',
      price: 2100,
      unit: 'Quintal',
      change: -1.2,
      lastUpdated: '2 hours ago',
      state: 'Punjab',
    },
    {
      id: '3',
      name: 'Tomato',
      market: 'Vashi APMC, Maharashtra',
      price: 2800,
      unit: 'Quintal',
      change: 5.7,
      lastUpdated: '30 minutes ago',
      state: 'Maharashtra',
    },
    {
      id: '4',
      name: 'Potato',
      market: 'Mahadev Mandi, Uttar Pradesh',
      price: 1850,
      unit: 'Quintal',
      change: 0.5,
      lastUpdated: '45 minutes ago',
      state: 'Uttar Pradesh',
    },
    {
      id: '5',
      name: 'Onion',
      market: 'Lasalgaon APMC, Maharashtra',
      price: 2200,
      unit: 'Quintal',
      change: -3.8,
      lastUpdated: '1 hour ago',
      state: 'Maharashtra',
    },
    {
      id: '6',
      name: 'Soybean',
      market: 'Indore Mandi, Madhya Pradesh',
      price: 4100,
      unit: 'Quintal',
      change: 1.3,
      lastUpdated: '3 hours ago',
      state: 'Madhya Pradesh',
    },
    {
      id: '7',
      name: 'Maize',
      market: 'Gulbarga APMC, Karnataka',
      price: 1950,
      unit: 'Quintal',
      change: -0.7,
      lastUpdated: '2 hours ago',
      state: 'Karnataka',
    },
    {
      id: '8',
      name: 'Cotton',
      market: 'Rajkot Mandi, Gujarat',
      price: 6200,
      unit: 'Quintal',
      change: 2.1,
      lastUpdated: '4 hours ago',
      state: 'Gujarat',
    },
  ];

  // Mock data for markets
  const mockMarkets: Market[] = [
    {
      id: '1',
      name: 'Azadpur Mandi',
      state: 'Delhi',
      district: 'North Delhi',
      commodities: 32,
    },
    {
      id: '2',
      name: 'Khanna Mandi',
      state: 'Punjab',
      district: 'Ludhiana',
      commodities: 28,
    },
    {
      id: '3',
      name: 'Vashi APMC',
      state: 'Maharashtra',
      district: 'Navi Mumbai',
      commodities: 47,
    },
    {
      id: '4',
      name: 'Mahadev Mandi',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      commodities: 24,
    },
    {
      id: '5',
      name: 'Lasalgaon APMC',
      state: 'Maharashtra',
      district: 'Nashik',
      commodities: 15,
    },
    {
      id: '6',
      name: 'Indore Mandi',
      state: 'Madhya Pradesh',
      district: 'Indore',
      commodities: 35,
    },
    {
      id: '7',
      name: 'Gulbarga APMC',
      state: 'Karnataka',
      district: 'Gulbarga',
      commodities: 19,
    },
    {
      id: '8',
      name: 'Rajkot Mandi',
      state: 'Gujarat',
      district: 'Rajkot',
      commodities: 26,
    },
  ];

  // Filter commodities based on search query and selected state
  const filteredCommodities = mockCommodityPrices.filter((commodity) => {
    const matchesQuery = searchQuery
      ? commodity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        commodity.market.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesState = selectedState ? commodity.state === selectedState : true;
    
    return matchesQuery && matchesState;
  });

  // Filter markets based on search query and selected state
  const filteredMarkets = mockMarkets.filter((market) => {
    const matchesQuery = searchQuery
      ? market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        market.district.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesState = selectedState ? market.state === selectedState : true;
    
    return matchesQuery && matchesState;
  });

  // Get unique states for filter
  const states = Array.from(new Set(mockCommodityPrices.map((commodity) => commodity.state)));

  const handleRefresh = () => {
    setRefreshing(true);
    
    // Simulate API refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleStateFilter = (state: string) => {
    setSelectedState(selectedState === state ? null : state);
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return '#10B981';
    if (change < 0) return '#EF4444';
    return colors.text.secondary;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return 'arrow-up';
    if (change < 0) return 'arrow-down';
    return 'remove';
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
    searchContainer: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      marginBottom: spacing.md,
      padding: spacing.sm,
      alignItems: 'center',
    },
    searchIcon: {
      marginHorizontal: spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: fontSize.sm,
      color: colors.text.primary,
      padding: spacing.xs,
    },
    clearButton: {
      padding: spacing.xs,
    },
    tabsContainer: {
      flexDirection: 'row',
      marginBottom: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.surface,
      padding: spacing.xs,
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      borderRadius: borderRadius.sm,
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    tabText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.secondary,
    },
    activeTabText: {
      color: colors.surface,
    },
    filtersContainer: {
      flexDirection: 'row',
      marginBottom: spacing.md,
    },
    filterButton: {
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.sm,
      marginRight: spacing.sm,
    },
    filterButtonActive: {
      backgroundColor: colors.primary + '20',
    },
    filterButtonText: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
    },
    filterButtonTextActive: {
      color: colors.primary,
      fontWeight: fontWeight.medium,
    },
    commodityItem: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      marginBottom: spacing.md,
      padding: spacing.md,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    commodityHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    commodityName: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      flex: 1,
    },
    priceContainer: {
      alignItems: 'flex-end',
    },
    price: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    unit: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
    },
    marketName: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.xs,
    },
    commodityFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.md,
      alignItems: 'center',
    },
    lastUpdated: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
    },
    priceChange: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    priceChangeText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      marginLeft: spacing.xs,
    },
    marketItem: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      marginBottom: spacing.md,
      padding: spacing.md,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    marketHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    marketItemName: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    marketLocation: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.xs,
    },
    commodityCount: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    commodityCountText: {
      fontSize: fontSize.xs,
      color: colors.primary,
      fontWeight: fontWeight.medium,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
    },
    emptyStateText: {
      fontSize: fontSize.md,
      color: colors.text.secondary,
      textAlign: 'center',
      marginTop: spacing.md,
    },
    updateButton: {
      position: 'absolute',
      bottom: spacing.lg,
      right: spacing.lg,
      backgroundColor: colors.primary,
      borderRadius: 50,
      padding: spacing.md,
      elevation: 4,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      zIndex: 10,
    },
  });

  const styles = getStyles();

  const renderPriceItem = (item: CommodityPrice) => (
    <View style={styles.commodityItem}>
      <View style={styles.commodityHeader}>
        <Text style={styles.commodityName}>{item.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{item.price.toLocaleString()}</Text>
          <Text style={styles.unit}>per {item.unit}</Text>
        </View>
      </View>
      <Text style={styles.marketName}>{item.market}</Text>
      <View style={styles.commodityFooter}>
        <Text style={styles.lastUpdated}>Updated {item.lastUpdated}</Text>
        <View
          style={[
            styles.priceChange,
            {
              backgroundColor: getChangeColor(item.change) + '20',
            },
          ]}
        >
          <Ionicons
            name={getChangeIcon(item.change) as any}
            size={12}
            color={getChangeColor(item.change)}
          />
          <Text
            style={[
              styles.priceChangeText,
              { color: getChangeColor(item.change) },
            ]}
          >
            {Math.abs(item.change).toFixed(1)}%
          </Text>
        </View>
      </View>
    </View>
  );

  const renderMarketItem = (item: Market) => (
    <View style={styles.marketItem}>
      <View style={styles.marketHeader}>
        <Text style={styles.marketItemName}>{item.name}</Text>
        <View style={styles.commodityCount}>
          <Text style={styles.commodityCountText}>
            {item.commodities} Commodities
          </Text>
        </View>
      </View>
      <Text style={styles.marketLocation}>
        {item.district}, {item.state}
      </Text>
    </View>
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
            <Text style={styles.headerTitle}>Market Price Tracker</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={colors.text.secondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search commodities or markets..."
            placeholderTextColor={colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'prices' && styles.activeTab]}
            onPress={() => setActiveTab('prices')}
          >
            <Text style={[styles.tabText, activeTab === 'prices' && styles.activeTabText]}>
              Commodity Prices
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'markets' && styles.activeTab]}
            onPress={() => setActiveTab('markets')}
          >
            <Text style={[styles.tabText, activeTab === 'markets' && styles.activeTabText]}>
              Markets
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          {states.map((state) => (
            <TouchableOpacity
              key={state}
              style={[
                styles.filterButton,
                selectedState === state && styles.filterButtonActive,
              ]}
              onPress={() => handleStateFilter(state)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedState === state && styles.filterButtonTextActive,
                ]}
              >
                {state}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            {activeTab === 'prices' ? (
              <FlatList
                data={filteredCommodities}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => renderPriceItem(item)}
                ListEmptyComponent={
                  <View style={styles.emptyState}>
                    <Ionicons
                      name="basket"
                      size={48}
                      color={colors.text.secondary}
                    />
                    <Text style={styles.emptyStateText}>
                      No commodity prices found for your search
                    </Text>
                  </View>
                }
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={[colors.primary]}
                    tintColor={colors.primary}
                  />
                }
              />
            ) : (
              <FlatList
                data={filteredMarkets}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => renderMarketItem(item)}
                ListEmptyComponent={
                  <View style={styles.emptyState}>
                    <Ionicons
                      name="storefront"
                      size={48}
                      color={colors.text.secondary}
                    />
                    <Text style={styles.emptyStateText}>
                      No markets found for your search
                    </Text>
                  </View>
                }
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={[colors.primary]}
                    tintColor={colors.primary}
                  />
                }
              />
            )}
          </>
        )}

        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleRefresh}
        >
          <Ionicons name="refresh" size={24} color={colors.surface} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MarketPriceTrackerScreen;