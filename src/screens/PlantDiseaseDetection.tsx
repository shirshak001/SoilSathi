import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import CustomButton from '../components/CustomButton';

interface PlantDiseaseDetectionProps {
  navigation: any;
  route?: any;
}

interface PlantAnalysis {
  plantType: string;
  confidence: number;
  healthStatus: 'healthy' | 'diseased' | 'pest' | 'nutrient_deficiency';
  issues: PlantIssue[];
  recommendations: string[];
}

interface PlantIssue {
  type: 'disease' | 'pest' | 'nutrient' | 'watering';
  name: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  treatment: string;
  products?: Product[];
  organicRemedies?: OrganicRemedy[];
}

interface OrganicRemedy {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: string;
  ingredients: string[];
  instructions: string[];
  effectiveness: number;
  tips: string[];
  category: 'homemade' | 'kitchen' | 'garden';
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  category: string;
  features: string[];
  image: string;
}

const PlantDiseaseDetection: React.FC<PlantDiseaseDetectionProps> = ({ navigation, route }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PlantAnalysis | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'organic'>('products');

  // Handle captured image from floating scanner
  useEffect(() => {
    if (route?.params?.capturedImage) {
      setSelectedImage(route.params.capturedImage);
      // Auto-analyze the image
      setTimeout(() => {
        analyzeImage();
      }, 500);
    }
  }, [route?.params?.capturedImage]);

  // Simulated plant analysis result
  const mockAnalysis: PlantAnalysis = {
    plantType: 'Tomato Plant',
    confidence: 92,
    healthStatus: 'diseased',
    issues: [
      {
        type: 'disease',
        name: 'Early Blight',
        severity: 'medium',
        description: 'Dark spots with concentric rings on leaves, typically starting from lower leaves.',
        treatment: 'Remove affected leaves and apply fungicide spray. Improve air circulation.',
        products: [
          {
            id: '1',
            name: 'Copper Fungicide Spray',
            price: 249,
            originalPrice: 299,
            description: 'Organic copper-based fungicide for tomato blight',
            rating: 4.5,
            reviews: 156,
            inStock: true,
            category: 'pesticides',
            features: ['Organic certified', 'Disease control', 'Safe for food crops', '250ml bottle'],
            image: 'https://example.com/fungicide.jpg'
          },
          {
            id: '2',
            name: 'Neem Oil Concentrate',
            price: 199,
            description: 'Natural fungicide and pest control solution',
            rating: 4.3,
            reviews: 89,
            inStock: true,
            category: 'pesticides',
            features: ['100% natural', 'Fungicide', 'Pest control', '500ml bottle'],
            image: 'https://example.com/neem.jpg'
          }
        ],
        organicRemedies: [
          {
            id: 'or1',
            name: 'Baking Soda Fungicide Spray',
            difficulty: 'easy',
            prepTime: '5 minutes',
            ingredients: [
              '1 teaspoon baking soda',
              '1 quart water',
              '2-3 drops liquid soap',
              '1 tablespoon vegetable oil (optional)'
            ],
            instructions: [
              'Mix baking soda with water until completely dissolved',
              'Add liquid soap to help mixture stick to leaves',
              'Add vegetable oil for better coverage (optional)',
              'Pour into spray bottle and shake well',
              'Spray on affected leaves in early morning or evening',
              'Repeat every 3-4 days until improvement'
            ],
            effectiveness: 85,
            tips: [
              'Test on small area first to check plant tolerance',
              'Don\'t spray in direct sunlight to avoid leaf burn',
              'Apply when no rain expected for 24 hours'
            ],
            category: 'kitchen'
          },
          {
            id: 'or2',
            name: 'Milk Spray Treatment',
            difficulty: 'easy',
            prepTime: '3 minutes',
            ingredients: [
              '1 part whole milk',
              '9 parts water',
              'Spray bottle'
            ],
            instructions: [
              'Mix milk and water in 1:9 ratio',
              'Pour mixture into clean spray bottle',
              'Spray on both sides of affected leaves',
              'Apply early morning when leaves are dry',
              'Repeat weekly for prevention'
            ],
            effectiveness: 75,
            tips: [
              'Use whole milk for best results',
              'Don\'t use in hot weather to prevent spoilage',
              'Clean spray bottle thoroughly after use'
            ],
            category: 'kitchen'
          },
          {
            id: 'or3',
            name: 'Cinnamon Powder Treatment',
            difficulty: 'easy',
            prepTime: '2 minutes',
            ingredients: [
              '2 tablespoons cinnamon powder',
              '1 liter warm water',
              'Fine mesh strainer'
            ],
            instructions: [
              'Mix cinnamon powder with warm water',
              'Let steep for 30 minutes',
              'Strain through fine mesh to remove particles',
              'Apply to soil around plant base',
              'Can also be sprayed on leaves lightly'
            ],
            effectiveness: 70,
            tips: [
              'Use Ceylon cinnamon for better results',
              'Reapply after heavy rain',
              'Safe for edible plants'
            ],
            category: 'kitchen'
          }
        ]
      },
      {
        type: 'nutrient',
        name: 'Nitrogen Deficiency',
        severity: 'low',
        description: 'Yellowing of lower leaves indicates possible nitrogen deficiency.',
        treatment: 'Apply nitrogen-rich fertilizer and ensure proper watering.',
        products: [
          {
            id: '3',
            name: 'Liquid Nitrogen Fertilizer',
            price: 179,
            originalPrice: 219,
            description: 'Fast-acting liquid fertilizer for quick nitrogen boost',
            rating: 4.4,
            reviews: 234,
            inStock: true,
            category: 'fertilizers',
            features: ['Quick acting', 'Liquid formula', 'Nitrogen boost', '1L bottle'],
            image: 'https://example.com/fertilizer.jpg'
          }
        ],
        organicRemedies: [
          {
            id: 'or4',
            name: 'Compost Tea Fertilizer',
            difficulty: 'medium',
            prepTime: '24-48 hours',
            ingredients: [
              '2 cups good quality compost',
              '1 gallon water',
              '1 tablespoon molasses (optional)',
              'Large bucket or container',
              'Old cloth or mesh bag'
            ],
            instructions: [
              'Place compost in cloth bag or directly in bucket',
              'Add water and molasses to feed beneficial microbes',
              'Let steep for 24-48 hours, stirring occasionally',
              'Strain liquid through cloth or remove bag',
              'Dilute 1:1 with water before applying',
              'Apply to soil around plant base, not on leaves'
            ],
            effectiveness: 90,
            tips: [
              'Use within 24 hours of straining for best results',
              'Apply in early morning or evening',
              'Can be stored in refrigerator for up to 1 week'
            ],
            category: 'garden'
          },
          {
            id: 'or5',
            name: 'Banana Peel Fertilizer',
            difficulty: 'easy',
            prepTime: '10 minutes',
            ingredients: [
              '3-4 banana peels',
              '1 liter water',
              'Large jar or container'
            ],
            instructions: [
              'Chop banana peels into small pieces',
              'Place in jar and cover with water',
              'Let soak for 2-3 days',
              'Strain the liquid',
              'Dilute 1:5 with water',
              'Water plants with the solution'
            ],
            effectiveness: 75,
            tips: [
              'Rich in potassium and phosphorus',
              'Great for flowering plants',
              'Use fresh peels for best nutrients'
            ],
            category: 'kitchen'
          }
        ]
      }
    ],
    recommendations: [
      'Remove affected leaves immediately to prevent spread',
      'Improve air circulation around the plant',
      'Water at soil level, avoid wetting leaves',
      'Apply organic mulch to retain soil moisture',
      'Monitor plant weekly for new symptoms'
    ]
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setShowImagePicker(false);
        setSelectedImage(result.assets[0].uri);
        analyzeImage();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleSelectFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Gallery permission is required to select photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setShowImagePicker(false);
        setSelectedImage(result.assets[0].uri);
        analyzeImage();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select photo. Please try again.');
    }
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(mockAnalysis);
    }, 3000);
  };

  const addToCart = (product: Product) => {
    if (!cart.find(item => item.id === product.id)) {
      setCart([...cart, product]);
      Alert.alert('Added to Cart', `${product.name} has been added to your cart.`);
    } else {
      Alert.alert('Already in Cart', 'This product is already in your cart.');
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handleBuyNow = (product: Product) => {
    navigation.navigate('Checkout', { 
      items: [{ product, quantity: 1 }], 
      total: product.price 
    });
  };

  const handleProceedToPayment = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add some products to cart first.');
      return;
    }
    
    const cartItems = cart.map(item => ({ product: item, quantity: 1 }));
    navigation.navigate('Checkout', { 
      items: cartItems, 
      total: getTotalAmount() 
    });
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return colors.success;
      case 'diseased': return colors.error;
      case 'pest': return colors.warning;
      case 'nutrient_deficiency': return colors.accent;
      default: return colors.text.secondary;
    }
  };

  const getHealthStatusText = (status: string) => {
    switch (status) {
      case 'healthy': return 'Healthy Plant';
      case 'diseased': return 'Disease Detected';
      case 'pest': return 'Pest Issue';
      case 'nutrient_deficiency': return 'Nutrient Deficiency';
      default: return 'Unknown';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return colors.success;
      case 'medium': return colors.warning;
      case 'high': return colors.error;
      default: return colors.text.secondary;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return colors.success;
      case 'medium': return colors.warning;
      case 'hard': return colors.error;
      default: return colors.text.secondary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'kitchen': return 'restaurant';
      case 'garden': return 'leaf';
      case 'homemade': return 'home';
      default: return 'beaker';
    }
  };

  const renderOrganicRemedy = (remedy: OrganicRemedy) => (
    <View key={remedy.id} style={styles.remedyCard}>
      <View style={styles.remedyHeader}>
        <View style={styles.remedyIcon}>
          <Ionicons 
            name={getCategoryIcon(remedy.category)} 
            size={24} 
            color={colors.primary} 
          />
        </View>
        <View style={styles.remedyInfo}>
          <Text style={styles.remedyName}>{remedy.name}</Text>
          <View style={styles.remedyMeta}>
            <View style={[
              styles.difficultyBadge, 
              { backgroundColor: getDifficultyColor(remedy.difficulty) }
            ]}>
              <Text style={styles.difficultyText}>
                {remedy.difficulty.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.prepTime}>⏱ {remedy.prepTime}</Text>
          </View>
        </View>
        <View style={styles.effectivenessContainer}>
          <Text style={styles.effectivenessLabel}>Effectiveness</Text>
          <Text style={styles.effectivenessValue}>{remedy.effectiveness}%</Text>
        </View>
      </View>

      <View style={styles.ingredientsSection}>
        <Text style={styles.sectionSubtitle}>Ingredients:</Text>
        {remedy.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredientItem}>• {ingredient}</Text>
        ))}
      </View>

      <View style={styles.instructionsSection}>
        <Text style={styles.sectionSubtitle}>Instructions:</Text>
        {remedy.instructions.map((instruction, index) => (
          <View key={index} style={styles.instructionItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.instructionText}>{instruction}</Text>
          </View>
        ))}
      </View>

      {remedy.tips && remedy.tips.length > 0 && (
        <View style={styles.tipsSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
            <Ionicons name="bulb" size={18} color={colors.warning} style={{ marginRight: spacing.sm }} />
            <Text style={styles.sectionSubtitle}>Pro Tips:</Text>
          </View>
          {remedy.tips.map((tip, index) => (
            <Text key={index} style={styles.organicTipItem}>• {tip}</Text>
          ))}
        </View>
      )}
    </View>
  );

  const renderIssue = (issue: PlantIssue, index: number) => (
    <View key={index} style={styles.issueCard}>
      <View style={styles.issueHeader}>
        <View style={styles.issueIcon}>
          <Ionicons 
            name={issue.type === 'disease' ? 'medical' : issue.type === 'pest' ? 'bug' : 'leaf'} 
            size={24} 
            color={colors.primary} 
          />
        </View>
        <View style={styles.issueInfo}>
          <Text style={styles.issueName}>{issue.name}</Text>
          <View style={[
            styles.severityBadge, 
            { backgroundColor: getSeverityColor(issue.severity) }
          ]}>
            <Text style={styles.severityText}>
              {issue.severity.toUpperCase()} SEVERITY
            </Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.issueDescription}>{issue.description}</Text>
      
      <View style={styles.treatmentSection}>
        <Text style={styles.treatmentTitle}>Treatment:</Text>
        <Text style={styles.treatmentText}>{issue.treatment}</Text>
      </View>
      
      {(issue.products && issue.products.length > 0) || (issue.organicRemedies && issue.organicRemedies.length > 0) ? (
        <View style={styles.solutionsSection}>
          <Text style={styles.sectionTitle}>Solutions</Text>
          
          {/* Tab buttons */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'products' && styles.activeTab]}
              onPress={() => setActiveTab('products')}
            >
              <Ionicons 
                name="storefront" 
                size={16} 
                color={activeTab === 'products' ? colors.surface : colors.text.secondary} 
              />
              <Text style={[
                styles.tabText,
                activeTab === 'products' && styles.activeTabText
              ]}>
                Products ({issue.products?.length || 0})
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'organic' && styles.activeTab]}
              onPress={() => setActiveTab('organic')}
            >
              <Ionicons 
                name="leaf" 
                size={16} 
                color={activeTab === 'organic' ? colors.surface : colors.text.secondary} 
              />
              <Text style={[
                styles.tabText,
                activeTab === 'organic' && styles.activeTabText
              ]}>
                Organic ({issue.organicRemedies?.length || 0})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab content */}
          {activeTab === 'products' && issue.products && issue.products.length > 0 && (
            <View style={styles.tabContent}>
              <Text style={styles.tabContentTitle}>Recommended Products</Text>
              {issue.products.map(product => (
                <View key={product.id} style={styles.productCard}>
                  <View style={styles.productHeader}>
                    <View style={styles.productIcon}>
                      <Ionicons name="leaf" size={24} color={colors.primary} />
                    </View>
                    {product.originalPrice && (
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </Text>
                      </View>
                    )}
                    <View style={[
                      styles.stockStatus,
                      { backgroundColor: product.inStock ? colors.success : colors.error }
                    ]}>
                      <Text style={styles.stockText}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productDescription}>{product.description}</Text>
                  
                  <View style={styles.productFeatures}>
                    {product.features.slice(0, 2).map((feature, index) => (
                      <Text key={index} style={styles.featureText}>• {feature}</Text>
                    ))}
                  </View>
                  
                  <View style={styles.productMeta}>
                    <View style={styles.priceSection}>
                      <Text style={styles.productPrice}>₹{product.price}</Text>
                      {product.originalPrice && (
                        <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
                      )}
                    </View>
                    <View style={styles.rating}>
                      <Ionicons name="star" size={14} color={colors.warning} />
                      <Text style={styles.ratingText}>{product.rating}</Text>
                      <Text style={styles.reviewsText}>({product.reviews})</Text>
                    </View>
                  </View>
                  
                  <View style={styles.productActions}>
                    <TouchableOpacity 
                      style={[styles.addToCartButton, cart.find(item => item.id === product.id) && styles.inCartButton]}
                      onPress={() => addToCart(product)}
                      disabled={!product.inStock}
                    >
                      <Ionicons 
                        name={cart.find(item => item.id === product.id) ? "checkmark" : "bag-add"} 
                        size={16} 
                        color={colors.surface} 
                      />
                      <Text style={styles.addToCartText}>
                        {cart.find(item => item.id === product.id) ? 'Added' : 'Add to Cart'}
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.buyNowButton}
                      onPress={() => handleBuyNow(product)}
                      disabled={!product.inStock}
                    >
                      <Text style={styles.buyNowText}>Buy Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'organic' && issue.organicRemedies && issue.organicRemedies.length > 0 && (
            <View style={styles.tabContent}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
                <Ionicons name="leaf" size={18} color={colors.success} style={{ marginRight: spacing.sm }} />
                <Text style={styles.tabContentTitle}>Homemade Organic Remedies</Text>
              </View>
              {issue.organicRemedies.map(renderOrganicRemedy)}
            </View>
          )}
        </View>
      ) : null}
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
          <Text style={styles.headerTitle}>Plant Health Scanner</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!selectedImage ? (
          <View style={styles.uploadSection}>
            <View style={styles.uploadCard}>
              <Ionicons name="camera" size={64} color={colors.primary} />
              <Text style={styles.uploadTitle}>Scan Your Plant</Text>
              <Text style={styles.uploadSubtitle}>
                Take a photo of your plant to detect diseases, pests, and get care recommendations
              </Text>
              
              <CustomButton
                title="Take Photo"
                onPress={() => setShowImagePicker(true)}
                style={styles.uploadButton}
              />
              
              <Text style={styles.tipsTitle}>Tips for best results:</Text>
              <View style={styles.tipsList}>
                <Text style={styles.tipItem}>• Take photo in good lighting</Text>
                <Text style={styles.tipItem}>• Focus on affected areas</Text>
                <Text style={styles.tipItem}>• Include leaves and stems</Text>
                <Text style={styles.tipItem}>• Avoid blurry images</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.analysisSection}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.plantImage} />
              <TouchableOpacity 
                style={styles.retakeButton}
                onPress={() => {
                  setSelectedImage(null);
                  setAnalysisResult(null);
                  setIsAnalyzing(false);
                }}
              >
                <Ionicons name="camera" size={20} color={colors.primary} />
                <Text style={styles.retakeText}>Retake</Text>
              </TouchableOpacity>
            </View>

            {isAnalyzing && (
              <View style={styles.analyzingCard}>
                <View style={styles.loadingSpinner}>
                  <Ionicons name="sync" size={32} color={colors.primary} />
                </View>
                <Text style={styles.analyzingTitle}>Analyzing Plant Health</Text>
                <Text style={styles.analyzingSubtitle}>
                  AI is examining your plant for diseases, pests, and health issues...
                </Text>
              </View>
            )}

            {analysisResult && (
              <View style={styles.resultsSection}>
                <View style={styles.resultHeader}>
                  <View style={styles.plantInfo}>
                    <Text style={styles.plantType}>{analysisResult.plantType}</Text>
                    <Text style={styles.confidence}>Confidence: {analysisResult.confidence}%</Text>
                  </View>
                  <View style={[
                    styles.healthStatus, 
                    { backgroundColor: getHealthStatusColor(analysisResult.healthStatus) }
                  ]}>
                    <Text style={styles.healthStatusText}>
                      {getHealthStatusText(analysisResult.healthStatus)}
                    </Text>
                  </View>
                </View>

                {analysisResult.issues.length > 0 && (
                  <View style={styles.issuesSection}>
                    <Text style={styles.sectionTitle}>Detected Issues</Text>
                    {analysisResult.issues.map(renderIssue)}
                  </View>
                )}

                <View style={styles.recommendationsSection}>
                  <Text style={styles.sectionTitle}>Care Recommendations</Text>
                  <View style={styles.recommendationsList}>
                    {analysisResult.recommendations.map((rec, index) => (
                      <View key={index} style={styles.recommendationItem}>
                        <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                        <Text style={styles.recommendationText}>{rec}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <CustomButton
                  title="Save Report"
                  variant="outline"
                  onPress={() => Alert.alert('Success', 'Plant health report saved!')}
                  style={styles.saveButton}
                />

                {cart.length > 0 && (
                  <View style={styles.cartSection}>
                    <Text style={styles.cartTitle}>
                      Shopping Cart ({cart.length} items)
                    </Text>
                    <View style={styles.cartItems}>
                      {cart.map(item => (
                        <View key={item.id} style={styles.cartItem}>
                          <Text style={styles.cartItemName}>{item.name}</Text>
                          <View style={styles.cartItemActions}>
                            <Text style={styles.cartItemPrice}>₹{item.price}</Text>
                            <TouchableOpacity 
                              onPress={() => removeFromCart(item.id)}
                              style={styles.removeButton}
                            >
                              <Ionicons name="trash" size={16} color={colors.error} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </View>
                    <View style={styles.cartFooter}>
                      <Text style={styles.cartTotal}>
                        Total: ₹{getTotalAmount()}
                      </Text>
                      <CustomButton
                        title="Proceed to Checkout"
                        onPress={handleProceedToPayment}
                        style={styles.checkoutButton}
                      />
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showImagePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowImagePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Image Source</Text>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={handleTakePhoto}
            >
              <Ionicons name="camera" size={24} color={colors.primary} />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={handleSelectFromGallery}
            >
              <Ionicons name="images" size={24} color={colors.primary} />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalCancel}
              onPress={() => setShowImagePicker(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
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
  uploadSection: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  uploadCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  uploadTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  uploadSubtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  uploadButton: {
    marginBottom: spacing.lg,
    minWidth: 200,
  },
  tipsTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    alignSelf: 'flex-start',
  },
  tipsList: {
    alignSelf: 'flex-start',
  },
  tipItem: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  analysisSection: {
    padding: spacing.lg,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  plantImage: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
    backgroundColor: colors.border,
  },
  retakeButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  retakeText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    marginLeft: spacing.xs,
    fontWeight: fontWeight.medium,
  },
  analyzingCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingSpinner: {
    marginBottom: spacing.md,
  },
  analyzingTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  analyzingSubtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  resultsSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
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
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  plantInfo: {
    flex: 1,
  },
  plantType: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  confidence: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  healthStatus: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  healthStatusText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  issuesSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  issueCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  issueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  issueIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  issueInfo: {
    flex: 1,
  },
  issueName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
  severityText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  issueDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  treatmentSection: {
    marginBottom: spacing.md,
  },
  treatmentTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  treatmentText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  productsSection: {
    marginTop: spacing.md,
  },
  productsSectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  productCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 3,
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
  productIcon: {
    width: 40,
    height: 40,
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
  stockStatus: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
  stockText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
  },
  productName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  productDescription: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs / 2,
  },
  productFeatures: {
    marginBottom: spacing.sm,
  },
  featureText: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    marginBottom: spacing.xs / 2,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  originalPrice: {
    fontSize: fontSize.sm,
    color: colors.text.hint,
    textDecorationLine: 'line-through',
    marginLeft: spacing.sm,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  ratingText: {
    fontSize: fontSize.xs,
    color: colors.text.primary,
    marginLeft: spacing.xs / 2,
  },
  reviewsText: {
    fontSize: fontSize.sm,
    color: colors.text.hint,
    marginLeft: spacing.xs,
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  addToCartButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inCartButton: {
    backgroundColor: colors.success,
  },
  addToCartText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
    marginLeft: spacing.xs,
  },
  buyNowButton: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  buyNowText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
  },
  recommendationsSection: {
    marginBottom: spacing.lg,
  },
  recommendationsList: {
    gap: spacing.sm,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  recommendationText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 18,
  },
  saveButton: {
    alignSelf: 'center',
    minWidth: 200,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
    marginBottom: spacing.sm,
  },
  modalOptionText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    marginLeft: spacing.md,
    fontWeight: fontWeight.medium,
  },
  modalCancel: {
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  modalCancelText: {
    fontSize: fontSize.md,
    color: colors.text.hint,
    fontWeight: fontWeight.medium,
  },
  cartSection: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  cartTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  cartItems: {
    marginBottom: spacing.md,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  cartItemName: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    flex: 1,
  },
  cartItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartItemPrice: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
    marginRight: spacing.sm,
  },
  removeButton: {
    padding: spacing.xs,
  },
  cartFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  cartTotal: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  checkoutButton: {
    marginTop: spacing.sm,
  },
  // Tab styles
  solutionsSection: {
    marginTop: spacing.md,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    marginBottom: spacing.md,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
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
  tabContent: {
    marginTop: spacing.sm,
  },
  tabContentTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  // Organic remedy styles
  remedyCard: {
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
  remedyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  remedyIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  remedyInfo: {
    flex: 1,
  },
  remedyName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  remedyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
  difficultyText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  prepTime: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    fontWeight: fontWeight.medium,
  },
  effectivenessContainer: {
    alignItems: 'center',
    minWidth: 60,
  },
  effectivenessLabel: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  effectivenessValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginTop: spacing.xs / 2,
  },
  sectionSubtitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  ingredientsSection: {
    marginBottom: spacing.md,
  },
  ingredientItem: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.xs / 2,
  },
  instructionsSection: {
    marginBottom: spacing.md,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  instructionText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
    flex: 1,
  },
  tipsSection: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  organicTipItem: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 18,
    marginBottom: spacing.xs / 2,
  },
});

export default PlantDiseaseDetection;