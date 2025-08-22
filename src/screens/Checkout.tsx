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
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

interface CheckoutProps {
  navigation: any;
  route: {
    params: {
      items: Array<{
        product: {
          id: string;
          name: string;
          price: number;
          image: string;
        };
        quantity: number;
      }>;
      total: number;
    };
  };
}

interface Address {
  id: string;
  type: string;
  name: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: string;
  name: string;
  details: string;
  icon: string;
}

const Checkout: React.FC<CheckoutProps> = ({ navigation, route }) => {
  const { items, total } = route.params;
  const [selectedAddress, setSelectedAddress] = useState<string>('1');
  const [selectedPayment, setSelectedPayment] = useState<string>('upi');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states for new address
  const [newAddress, setNewAddress] = useState({
    name: '',
    address: '',
    city: '',
    pincode: '',
    phone: '',
  });

  const deliveryFee = 49;
  const platformFee = 25;
  const finalTotal = total + deliveryFee + platformFee;

  const addresses: Address[] = [
    {
      id: '1',
      type: 'Home',
      name: 'John Doe',
      address: '123 Green Street, Apartment 4B',
      city: 'Mumbai',
      pincode: '400001',
      phone: '+91 9876543210',
      isDefault: true,
    },
    {
      id: '2',
      type: 'Office',
      name: 'John Doe',
      address: '456 Business Park, Floor 8',
      city: 'Mumbai',
      pincode: '400002',
      phone: '+91 9876543210',
      isDefault: false,
    },
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'upi',
      type: 'UPI',
      name: 'UPI Payment',
      details: 'Pay using any UPI app',
      icon: 'phone-portrait'
    },
    {
      id: 'card',
      type: 'Card',
      name: 'Debit/Credit Card',
      details: 'Visa, Mastercard, RuPay',
      icon: 'card'
    },
    {
      id: 'wallet',
      type: 'Wallet',
      name: 'Digital Wallet',
      details: 'Paytm, PhonePe, Google Pay',
      icon: 'wallet'
    },
    {
      id: 'cod',
      type: 'COD',
      name: 'Cash on Delivery',
      details: 'Pay when product is delivered',
      icon: 'cash'
    },
  ];

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false);
      setOrderPlaced(true);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  const renderOrderItem = (item: typeof items[0]) => (
    <View key={item.product.id} style={styles.orderItem}>
      <View style={styles.itemImage}>
        <Ionicons name={item.product.image as keyof typeof Ionicons.glyphMap} size={24} color={colors.primary} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.product.name}</Text>
        <Text style={styles.itemPrice}>₹{item.product.price} × {item.quantity}</Text>
      </View>
      <Text style={styles.itemTotal}>₹{item.product.price * item.quantity}</Text>
    </View>
  );

  const renderAddress = (address: Address) => (
    <TouchableOpacity
      key={address.id}
      style={[
        styles.addressCard,
        selectedAddress === address.id && styles.selectedCard
      ]}
      onPress={() => setSelectedAddress(address.id)}
    >
      <View style={styles.addressHeader}>
        <View style={styles.addressType}>
          <Ionicons 
            name={address.type === 'Home' ? 'home' : 'business'} 
            size={16} 
            color={colors.primary} 
          />
          <Text style={styles.addressTypeText}>{address.type}</Text>
          {address.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>DEFAULT</Text>
            </View>
          )}
        </View>
        <View style={[
          styles.radioButton,
          selectedAddress === address.id && styles.radioButtonSelected
        ]}>
          {selectedAddress === address.id && (
            <View style={styles.radioButtonInner} />
          )}
        </View>
      </View>
      <Text style={styles.addressName}>{address.name}</Text>
      <Text style={styles.addressText}>{address.address}</Text>
      <Text style={styles.addressText}>{address.city} - {address.pincode}</Text>
      <Text style={styles.addressPhone}>{address.phone}</Text>
    </TouchableOpacity>
  );

  const renderPaymentMethod = (method: PaymentMethod) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.paymentCard,
        selectedPayment === method.id && styles.selectedCard
      ]}
      onPress={() => setSelectedPayment(method.id)}
    >
      <View style={styles.paymentHeader}>
        <View style={styles.paymentInfo}>
          <Ionicons name={method.icon as keyof typeof Ionicons.glyphMap} size={24} color={colors.primary} />
          <View style={styles.paymentText}>
            <Text style={styles.paymentName}>{method.name}</Text>
            <Text style={styles.paymentDetails}>{method.details}</Text>
          </View>
        </View>
        <View style={[
          styles.radioButton,
          selectedPayment === method.id && styles.radioButtonSelected
        ]}>
          {selectedPayment === method.id && (
            <View style={styles.radioButtonInner} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (orderPlaced) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color={colors.success} />
          </View>
          <Text style={styles.successTitle}>Order Placed Successfully!</Text>
          <Text style={styles.successMessage}>
            Thank you for your order. You will receive a confirmation message shortly.
          </Text>
          <View style={styles.orderSummary}>
            <Text style={styles.orderNumber}>Order #12345</Text>
            <Text style={styles.orderAmount}>₹{finalTotal}</Text>
          </View>
          <CustomButton
            title="Continue Shopping"
            onPress={() => navigation.navigate('ProductStore')}
            style={styles.continueButton}
          />
          <TouchableOpacity
            style={styles.trackOrderButton}
            onPress={() => navigation.navigate('OrderTracking')}
          >
            <Text style={styles.trackOrderText}>Track Your Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.orderSummaryCard}>
            {items.map(renderOrderItem)}
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity onPress={() => setShowAddressModal(true)}>
              <Text style={styles.addNewText}>Add New</Text>
            </TouchableOpacity>
          </View>
          {addresses.map(renderAddress)}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map(renderPaymentMethod)}
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Items Total</Text>
              <Text style={styles.priceValue}>₹{total}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Delivery Fee</Text>
              <Text style={styles.priceValue}>₹{deliveryFee}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Platform Fee</Text>
              <Text style={styles.priceValue}>₹{platformFee}</Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{finalTotal}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalSection}>
          <Text style={styles.footerTotal}>₹{finalTotal}</Text>
          <Text style={styles.footerSavings}>You saved ₹50</Text>
        </View>
        <CustomButton
          title={loading ? "Placing Order..." : "Place Order"}
          onPress={handlePlaceOrder}
          disabled={loading}
          style={styles.placeOrderButton}
        />
      </View>

      {/* Add Address Modal */}
      <Modal
        visible={showAddressModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Address</Text>
              <TouchableOpacity onPress={() => setShowAddressModal(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <CustomInput
                label="Full Name"
                placeholder="Enter your full name"
                value={newAddress.name}
                onChangeText={(text) => setNewAddress({...newAddress, name: text})}
              />
              <CustomInput
                label="Address"
                placeholder="Enter your complete address"
                value={newAddress.address}
                onChangeText={(text) => setNewAddress({...newAddress, address: text})}
                multiline
              />
              <CustomInput
                label="City"
                placeholder="Enter your city"
                value={newAddress.city}
                onChangeText={(text) => setNewAddress({...newAddress, city: text})}
              />
              <CustomInput
                label="Pincode"
                placeholder="Enter pincode"
                value={newAddress.pincode}
                onChangeText={(text) => setNewAddress({...newAddress, pincode: text})}
                keyboardType="numeric"
              />
              <CustomInput
                label="Phone Number"
                placeholder="Enter phone number"
                value={newAddress.phone}
                onChangeText={(text) => setNewAddress({...newAddress, phone: text})}
                keyboardType="phone-pad"
              />
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <CustomButton
                title="Save Address"
                onPress={() => setShowAddressModal(false)}
                fullWidth
              />
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
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  addNewText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  orderSummaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  itemPrice: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs / 2,
  },
  itemTotal: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  addressCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
  },
  selectedCard: {
    borderColor: colors.primary,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  addressType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressTypeText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  defaultBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  defaultText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  addressName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  addressText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs / 2,
  },
  addressPhone: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  paymentCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentText: {
    marginLeft: spacing.md,
  },
  paymentName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  paymentDetails: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs / 2,
  },
  priceCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  priceLabel: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  priceValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.sm,
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
  footer: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalSection: {
    flex: 1,
  },
  footerTotal: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  footerSavings: {
    fontSize: fontSize.sm,
    color: colors.success,
    marginTop: spacing.xs / 2,
  },
  placeOrderButton: {
    flex: 1,
    marginLeft: spacing.md,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  successIcon: {
    marginBottom: spacing.xl,
  },
  successTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  successMessage: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  orderSummary: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  orderAmount: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  continueButton: {
    marginBottom: spacing.md,
    width: '100%',
  },
  trackOrderButton: {
    paddingVertical: spacing.md,
  },
  trackOrderText: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
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
  modalContent: {
    padding: spacing.lg,
    maxHeight: 400,
  },
  modalFooter: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default Checkout;
