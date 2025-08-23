import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface PaymentMethodsScreenProps {
  navigation: any;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'digital';
  provider: string;
  details: string;
  isDefault: boolean;
  icon: string;
  lastUsed?: string;
  expiryDate?: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
}

const PaymentMethodsScreen: React.FC<PaymentMethodsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const [showAddModal, setShowAddModal] = useState(false);

  // Dummy payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      provider: 'Visa',
      details: '**** **** **** 4242',
      isDefault: true,
      icon: 'card',
      lastUsed: '2 days ago',
      expiryDate: '12/25',
    },
    {
      id: '2',
      type: 'card',
      provider: 'Mastercard',
      details: '**** **** **** 8888',
      isDefault: false,
      icon: 'card',
      lastUsed: '1 week ago',
      expiryDate: '08/26',
    },
    {
      id: '3',
      type: 'bank',
      provider: 'Bank Transfer',
      details: 'Wells Fargo ****1234',
      isDefault: false,
      icon: 'business',
      lastUsed: '3 weeks ago',
    },
    {
      id: '4',
      type: 'digital',
      provider: 'PayPal',
      details: 'john.smith@email.com',
      isDefault: false,
      icon: 'wallet',
      lastUsed: '1 month ago',
    },
  ]);

  // Dummy transaction history
  const recentTransactions: Transaction[] = [
    {
      id: '1',
      description: 'Drone Spraying Service',
      amount: 145.50,
      date: '2024-08-20',
      status: 'completed',
      paymentMethod: 'Visa ****4242',
    },
    {
      id: '2',
      description: 'Premium Subscription',
      amount: 29.99,
      date: '2024-08-15',
      status: 'completed',
      paymentMethod: 'Visa ****4242',
    },
    {
      id: '3',
      description: 'Weather Alert Service',
      amount: 12.99,
      date: '2024-08-10',
      status: 'pending',
      paymentMethod: 'PayPal',
    },
    {
      id: '4',
      description: 'Soil Analysis Report',
      amount: 75.00,
      date: '2024-08-05',
      status: 'completed',
      paymentMethod: 'Mastercard ****8888',
    },
    {
      id: '5',
      description: 'Equipment Rental',
      amount: 250.00,
      date: '2024-07-28',
      status: 'failed',
      paymentMethod: 'Bank Transfer',
    },
  ];

  const setDefaultPayment = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
    Alert.alert('Success', 'Default payment method updated');
  };

  const removePaymentMethod = (id: string) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(methods => methods.filter(method => method.id !== id));
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'failed':
        return colors.error;
      default:
        return colors.text.secondary;
    }
  };

  const getCardIcon = (type: string, provider: string) => {
    if (type === 'card') {
      return provider.toLowerCase().includes('visa') ? 'card' : 'card';
    } else if (type === 'bank') {
      return 'business';
    } else {
      return 'wallet';
    }
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
    content: {
      flex: 1,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
    },
    paymentCard: {
      backgroundColor: colors.surface,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    defaultCard: {
      borderWidth: 2,
      borderColor: colors.primary,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    cardIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    cardInfo: {
      flex: 1,
    },
    cardProvider: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    cardDetails: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.xs / 2,
    },
    defaultBadge: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
      borderRadius: borderRadius.sm,
    },
    defaultText: {
      fontSize: fontSize.xs,
      color: colors.surface,
      fontWeight: fontWeight.bold,
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardMeta: {
      flex: 1,
    },
    lastUsed: {
      fontSize: fontSize.xs,
      color: colors.text.hint,
    },
    expiry: {
      fontSize: fontSize.xs,
      color: colors.text.hint,
      marginTop: spacing.xs / 2,
    },
    cardActions: {
      flexDirection: 'row',
    },
    actionButton: {
      padding: spacing.sm,
      marginLeft: spacing.xs,
    },
    addCardButton: {
      backgroundColor: colors.surface,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addCardContent: {
      alignItems: 'center',
    },
    addCardIcon: {
      marginBottom: spacing.sm,
    },
    addCardText: {
      fontSize: fontSize.md,
      color: colors.text.secondary,
      fontWeight: fontWeight.medium,
    },
    transactionItem: {
      backgroundColor: colors.surface,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.sm,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      elevation: 1,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    transactionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    transactionDescription: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
      flex: 1,
    },
    transactionAmount: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    transactionFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    transactionMeta: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    transactionStatus: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.bold,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    modalContainer: {
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
      width: '90%',
    },
    modalTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    paymentOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderRadius: borderRadius.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    paymentOptionIcon: {
      marginRight: spacing.md,
    },
    paymentOptionText: {
      fontSize: fontSize.md,
      color: colors.text.primary,
      flex: 1,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.lg,
    },
    modalButton: {
      flex: 1,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      marginHorizontal: spacing.xs,
    },
    cancelButton: {
      backgroundColor: colors.border,
    },
    confirmButton: {
      backgroundColor: colors.primary,
    },
    buttonText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      textAlign: 'center',
    },
    cancelButtonText: {
      color: colors.text.secondary,
    },
    confirmButtonText: {
      color: colors.surface,
    },
    summaryCard: {
      backgroundColor: colors.primaryLight + '20',
      marginHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
    },
    summaryTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.primary,
      marginBottom: spacing.md,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    summaryLabel: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    summaryValue: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
  });

  const styles = getStyles();

  const paymentOptions = [
    { icon: 'card', label: 'Credit/Debit Card', type: 'card' },
    { icon: 'business', label: 'Bank Account', type: 'bank' },
    { icon: 'wallet', label: 'Digital Wallet', type: 'digital' },
  ];

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
          <Text style={styles.headerTitle}>Payment Methods</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={24} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Payment Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Spent This Month</Text>
            <Text style={styles.summaryValue}>$513.48</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Active Payment Methods</Text>
            <Text style={styles.summaryValue}>{paymentMethods.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Next Billing Date</Text>
            <Text style={styles.summaryValue}>Aug 30, 2024</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          
          {paymentMethods.map((method) => (
            <View key={method.id} style={[styles.paymentCard, method.isDefault && styles.defaultCard]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIcon}>
                  <Ionicons
                    name={getCardIcon(method.type, method.provider) as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={colors.surface}
                  />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardProvider}>{method.provider}</Text>
                  <Text style={styles.cardDetails}>{method.details}</Text>
                </View>
                {method.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>DEFAULT</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.cardFooter}>
                <View style={styles.cardMeta}>
                  <Text style={styles.lastUsed}>Last used: {method.lastUsed}</Text>
                  {method.expiryDate && (
                    <Text style={styles.expiry}>Expires: {method.expiryDate}</Text>
                  )}
                </View>
                <View style={styles.cardActions}>
                  {!method.isDefault && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => setDefaultPayment(method.id)}
                    >
                      <Ionicons name="star-outline" size={20} color={colors.text.secondary} />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => Alert.alert('Edit', 'Edit payment method functionality')}
                  >
                    <Ionicons name="create-outline" size={20} color={colors.text.secondary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => removePaymentMethod(method.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addCardButton} onPress={() => setShowAddModal(true)}>
            <View style={styles.addCardContent}>
              <Ionicons name="add-circle-outline" size={32} color={colors.text.secondary} style={styles.addCardIcon} />
              <Text style={styles.addCardText}>Add New Payment Method</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionHeader}>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionAmount}>
                  ${transaction.amount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.transactionFooter}>
                <Text style={styles.transactionMeta}>
                  {transaction.date} • {transaction.paymentMethod}
                </Text>
                <Text style={[styles.transactionStatus, { color: getStatusColor(transaction.status) }]}>
                  {transaction.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Payment Method</Text>
            
            {paymentOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.paymentOption}
                onPress={() => {
                  setShowAddModal(false);
                  Alert.alert('Add Payment Method', `${option.label} form would open here`);
                }}
              >
                <Ionicons
                  name={option.icon as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color={colors.primary}
                  style={styles.paymentOptionIcon}
                />
                <Text style={styles.paymentOptionText}>{option.label}</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.text.hint} />
              </TouchableOpacity>
            ))}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PaymentMethodsScreen;
