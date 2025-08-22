import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import CustomButton from '../components/CustomButton';

interface ProductStoreProps {
  navigation: any;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  features: string[];
  image: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const ProductStore: React.FC<ProductStoreProps> = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const categories = [
    { id: 'all', name: 'All Products', icon: 'grid' },
    { id: 'fertilizers', name: 'Fertilizers', icon: 'leaf' },
    { id: 'pesticides', name: 'Pesticides', icon: 'shield' },
    { id: 'tools', name: 'Tools', icon: 'hammer' },
    { id: 'seeds', name: 'Seeds', icon: 'flower' },
    { id: 'soil', name: 'Soil & Compost', icon: 'earth' },
  ];

  const products: Product[] = [
    {
      id: '1',
      name: 'Organic NPK Fertilizer',
      price: 299,
      originalPrice: 399,
      description: 'Complete balanced fertilizer for all plants',
      category: 'fertilizers',
      rating: 4.5,
      reviews: 234,
      inStock: true,
      features: ['Organic certified', '5kg pack', 'Slow release', 'All plants'],
      image: 'leaf'
    },
    {
      id: '2',
      name: 'Neem Oil Spray',
      price: 199,
      description: 'Natural pest control and fungicide',
      category: 'pesticides',
      rating: 4.3,
      reviews: 189,
      inStock: true,
      features: ['100% natural', '500ml bottle', 'Pest control', 'Fungicide'],
      image: 'bug'
    },
    {
      id: '3',
      name: 'Garden Pruning Shears',
      price: 449,
      originalPrice: 599,
      description: 'Professional grade pruning tool',
      category: 'tools',
      rating: 4.7,
      reviews: 156,
      inStock: true,
      features: ['Stainless steel', 'Ergonomic grip', 'Sharp blades', 'Durable'],
      image: 'cut'
    },
    {
      id: '4',
      name: 'Tomato Seeds (Hybrid)',
      price: 89,
      description: 'High yield hybrid tomato seeds',
      category: 'seeds',
      rating: 4.4,
      reviews: 267,
      inStock: true,
      features: ['High yield', '50 seeds', 'Disease resistant', 'Early harvest'],
      image: 'nutrition'
    },
    {
      id: '5',
      name: 'Potting Mix Premium',
      price: 179,
      description: 'Ready to use potting soil mix',
      category: 'soil',
      rating: 4.6,
      reviews: 198,
      inStock: false,
      features: ['Ready to use', '10kg bag', 'Nutrient rich', 'Well draining'],
      image: 'earth'
    },
    {
      id: '6',
      name: 'Copper Fungicide',
      price: 249,
      description: 'Effective against plant diseases',
      category: 'pesticides',
      rating: 4.2,
      reviews: 143,
      inStock: true,
      features: ['Copper based', '250ml bottle', 'Disease control', 'Preventive'],
      image: 'shield'
    }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const renderCategory = (category: typeof categories[0]) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryChip,
        selectedCategory === category.id && styles.selectedCategoryChip
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Ionicons 
        name={category.icon as keyof typeof Ionicons.glyphMap} 
        size={16} 
        color={selectedCategory === category.id ? colors.surface : colors.primary} 
      />
      <Text style={[
        styles.categoryText,
        selectedCategory === category.id && styles.selectedCategoryText
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = (product: Product) => (
    <View key={product.id} style={styles.productCard}>
      <View style={styles.productHeader}>
        <View style={styles.productImage}>
          <Ionicons name={product.image as keyof typeof Ionicons.glyphMap} size={32} color={colors.primary} />
        </View>
        {product.originalPrice && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </Text>
          </View>
        )}
      </View>
      
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>
      
      <View style={styles.productRating}>
        <Ionicons name="star" size={14} color={colors.warning} />
        <Text style={styles.ratingText}>{product.rating}</Text>
        <Text style={styles.reviewsText}>({product.reviews})</Text>
      </View>
      
      <View style={styles.productFeatures}>
        {product.features.slice(0, 2).map((feature, index) => (
          <Text key={index} style={styles.featureText}>• {feature}</Text>
        ))}
      </View>
      
      <View style={styles.productFooter}>
        <View style={styles.priceSection}>
          <Text style={styles.price}>₹{product.price}</Text>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
          )}
        </View>
        
        {product.inStock ? (
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={() => addToCart(product)}
          >
            <Ionicons name="bag-add" size={18} color={colors.surface} />
            <Text style={styles.addToCartText}>Add</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.outOfStockBtn}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderCartItem = (item: CartItem) => (
    <View key={item.product.id} style={styles.cartItem}>
      <View style={styles.cartItemImage}>
        <Ionicons name={item.product.image as keyof typeof Ionicons.glyphMap} size={24} color={colors.primary} />
      </View>
      
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>{item.product.name}</Text>
        <Text style={styles.cartItemPrice}>₹{item.product.price}</Text>
      </View>
      
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={styles.quantityBtn}
          onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
        >
          <Ionicons name="remove" size={16} color={colors.primary} />
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{item.quantity}</Text>
        
        <TouchableOpacity
          style={styles.quantityBtn}
          onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
        >
          <Ionicons name="add" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => removeFromCart(item.product.id)}
      >
        <Ionicons name="trash" size={16} color={colors.error} />
      </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Plant Store</Text>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => setShowCart(true)}
          >
            <Ionicons name="bag" size={24} color={colors.surface} />
            {getTotalItems() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop Garden Essentials</Text>
          <Text style={styles.sectionSubtitle}>
            Everything you need for healthy plants and garden
          </Text>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => renderCategory(category))}
        </ScrollView>

        <View style={styles.productsGrid}>
          {filteredProducts.map((product) => renderProduct(product))}
        </View>
      </ScrollView>

      <Modal
        visible={showCart}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCart(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cartModal}>
            <View style={styles.cartHeader}>
              <Text style={styles.cartTitle}>Shopping Cart</Text>
              <TouchableOpacity onPress={() => setShowCart(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            {cart.length === 0 ? (
              <View style={styles.emptyCart}>
                <Ionicons name="bag-outline" size={64} color={colors.text.hint} />
                <Text style={styles.emptyCartText}>Your cart is empty</Text>
                <Text style={styles.emptyCartSubtext}>Add some products to get started</Text>
              </View>
            ) : (
              <>
                <ScrollView style={styles.cartItems}>
                  {cart.map((item) => renderCartItem(item))}
                </ScrollView>

                <View style={styles.cartFooter}>
                  <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>Total Amount:</Text>
                    <Text style={styles.totalAmount}>₹{getTotalAmount()}</Text>
                  </View>
                  
                  <CustomButton
                    title="Proceed to Checkout"
                    onPress={() => {
                      setShowCart(false);
                      navigation.navigate('Checkout', { items: cart, total: getTotalAmount() });
                    }}
                    fullWidth
                    style={styles.checkoutButton}
                  />
                </View>
              </>
            )}
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
  cartButton: {
    padding: spacing.sm,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  categoriesContainer: {
    paddingLeft: spacing.lg,
  },
  categoriesContent: {
    paddingRight: spacing.lg,
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  selectedCategoryChip: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    marginLeft: spacing.xs,
    fontWeight: fontWeight.medium,
  },
  selectedCategoryText: {
    color: colors.surface,
  },
  productsGrid: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  productCard: {
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
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountBadge: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
  discountText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  productName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  productDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ratingText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    marginLeft: spacing.xs / 2,
    fontWeight: fontWeight.medium,
  },
  reviewsText: {
    fontSize: fontSize.sm,
    color: colors.text.hint,
    marginLeft: spacing.xs,
  },
  productFeatures: {
    marginBottom: spacing.md,
  },
  featureText: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    marginBottom: spacing.xs / 2,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  originalPrice: {
    fontSize: fontSize.sm,
    color: colors.text.hint,
    textDecorationLine: 'line-through',
    marginLeft: spacing.sm,
  },
  addToCartBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
    marginLeft: spacing.xs,
  },
  outOfStockBtn: {
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  outOfStockText: {
    fontSize: fontSize.sm,
    color: colors.text.disabled,
    fontWeight: fontWeight.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  cartModal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    maxHeight: '80%',
    paddingBottom: spacing.lg,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cartTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyCartText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  emptyCartSubtext: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  cartItems: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cartItemImage: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  cartItemPrice: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.xs / 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  quantityBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quantityText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginHorizontal: spacing.md,
    minWidth: 20,
    textAlign: 'center',
  },
  removeBtn: {
    padding: spacing.sm,
  },
  cartFooter: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  totalLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  totalAmount: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  checkoutButton: {
    marginTop: spacing.sm,
  },
});

export default ProductStore;
