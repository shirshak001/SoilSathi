import React, { useState, useRef } from 'react';
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
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import CustomButton from '../components/CustomButton';

interface PlantDiseaseDetectionProps {
  navigation: any;
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
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  rating: number;
}

const PlantDiseaseDetection: React.FC<PlantDiseaseDetectionProps> = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PlantAnalysis | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);

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
            description: 'Organic copper-based fungicide for tomato blight',
            rating: 4.5
          },
          {
            id: '2',
            name: 'Neem Oil Concentrate',
            price: 199,
            description: 'Natural fungicide and pest control solution',
            rating: 4.3
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
            description: 'Fast-acting liquid fertilizer for quick nitrogen boost',
            rating: 4.4
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

  const handleTakePhoto = () => {
    // In a real app, this would open the camera
    setShowImagePicker(false);
    setSelectedImage('https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Plant+Photo');
    analyzeImage();
  };

  const handleSelectFromGallery = () => {
    // In a real app, this would open the gallery
    setShowImagePicker(false);
    setSelectedImage('https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Plant+Photo');
    analyzeImage();
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
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.text.secondary;
    }
  };

  const renderIssue = (issue: PlantIssue, index: number) => (
    <View key={index} style={styles.issueCard}>
      <View style={styles.issueHeader}>
        <View style={styles.issueInfo}>
          <Text style={styles.issueName}>{issue.name}</Text>
          <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(issue.severity) }]}>
            <Text style={styles.severityText}>{issue.severity.toUpperCase()}</Text>
          </View>
        </View>
        <Ionicons 
          name={issue.type === 'disease' ? 'medical' : issue.type === 'pest' ? 'bug' : 'leaf'} 
          size={24} 
          color={colors.primary} 
        />
      </View>
      
      <Text style={styles.issueDescription}>{issue.description}</Text>
      
      <View style={styles.treatmentSection}>
        <Text style={styles.treatmentTitle}>Treatment:</Text>
        <Text style={styles.treatmentText}>{issue.treatment}</Text>
      </View>
      
      {issue.products && issue.products.length > 0 && (
        <View style={styles.productsSection}>
          <Text style={styles.productsSectionTitle}>Recommended Products:</Text>
          {issue.products.map(product => (
            <TouchableOpacity 
              key={product.id} 
              style={styles.productItem}
              onPress={() => navigation.navigate('ProductStore', { productId: product.id })}
            >
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDescription}>{product.description}</Text>
                <View style={styles.productMeta}>
                  <Text style={styles.productPrice}>₹{product.price}</Text>
                  <View style={styles.rating}>
                    <Ionicons name="star" size={12} color={colors.warning} />
                    <Text style={styles.ratingText}>{product.rating}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.addToCartButton}>
                <Ionicons name="bag-add" size={20} color={colors.primary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      )}
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
            
            <TouchableOpacity style={styles.modalOption} onPress={handleTakePhoto}>
              <Ionicons name="camera" size={24} color={colors.primary} />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalOption} onPress={handleSelectFromGallery}>
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
    width: spacing.xl + spacing.md,
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
    lineHeight: 22,
  },
  resultsSection: {
    gap: spacing.lg,
  },
  resultHeader: {
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
  plantInfo: {
    marginBottom: spacing.sm,
  },
  plantType: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  confidence: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  healthStatus: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  healthStatusText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
  },
  issuesSection: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  issueCard: {
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
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
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
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  severityText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  issueDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  treatmentSection: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  treatmentTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  treatmentText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  productsSection: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  productsSectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  productDetails: {
    flex: 1,
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
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  productPrice: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginRight: spacing.md,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    marginLeft: spacing.xs / 2,
  },
  addToCartButton: {
    padding: spacing.sm,
  },
  recommendationsSection: {
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
  recommendationsList: {
    marginTop: spacing.sm,
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
});

export default PlantDiseaseDetection;
