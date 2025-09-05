import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import CustomButton from '../components/CustomButton';
import axios from 'axios';
import { getPlantDiagnosis, DiagnosisResponse } from '../utils/api';

interface PlantDiseaseDetectionProps {
  navigation: any;
  route?: any;
}

interface PlantAnalysis {
  confidence: number;
  disease: string; // e.g., "Potato___healthy"
  success: boolean;
  // Optionally for future: issues?: PlantIssue[]; recommendations?: string[]
}

const PlantDiseaseDetection = ({ navigation, route }: PlantDiseaseDetectionProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PlantAnalysis | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResponse | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [manualDiseaseName, setManualDiseaseName] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  // Helper function to get mime type from URI
  const getMimeType = (uri: string): string => {
    const extension = uri.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      default:
        return 'image/jpeg';
    }
  };

  // Helper function to generate filename
  const generateFileName = (uri: string): string => {
    const extension = uri.split('.').pop()?.toLowerCase() || 'jpg';
    const timestamp = Date.now();
    return `plant_${timestamp}.${extension}`;
  };

  // Parse plant and status from disease string
  const getPlantInfo = (disease: string | undefined) => {
    if (!disease) return { plant: "Unknown Plant", status: "UNKNOWN" };
    const [plant, statusRaw] = disease.split("___");
    const status = statusRaw ? statusRaw.replace("_", " ").toUpperCase() : "UNKNOWN";
    return {
      plant: plant || "Unknown Plant",
      status
    };
  };

  // Color logic for status
  const getHealthStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return colors.success;
      case 'diseased':
        return colors.error;
      default:
        return colors.text.secondary;
    }
  };

  // Send image to your backend model for initial disease detection
  // Send image to your backend model for initial disease detection
  const analyzeImage = async (imageUri?: string) => {
    try {
      setIsAnalyzing(true);
      setAnalysisResult(null);

      if (!imageUri) {
        Alert.alert("Error", "No image selected");
        return;
      }

      const formData = new FormData();
      const fileName = generateFileName(imageUri);
      const mimeType = getMimeType(imageUri);

      formData.append("file", {
        uri: imageUri,
        name: fileName,
        type: mimeType,
      } as any);

      const response = await axios.post("https://httpsakayush-docker-api.hf.space/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      setAnalysisResult(response.data);

      // If a disease is detected and not healthy, fetch detailed diagnosis
      if (response.data?.disease && !response.data.disease.toLowerCase().includes('healthy')) {
        await fetchDiagnosis(response.data.disease);
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          Alert.alert("Error", "Request timed out. Please try again.");
        } else if (error.response) {
          Alert.alert("Error", `Server error: ${error.response.status}`);
        } else if (error.request) {
          Alert.alert("Error", "Network error. Please check your connection.");
        } else {
          Alert.alert("Error", "Failed to analyze image. Please try again.");
        }
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };





  // Gemini API call helper
  // Gemini API call helper
const getGeminiDiagnosis = async (diseaseName: string) => {
  try {
    const prompt = `
Provide a structured agricultural diagnosis for the plant disease: "${diseaseName}".
Respond ONLY in JSON with this exact structure:

{
  "Summary": "...",
  "remedies": {
    "Diagnosis": {
      "Disease": "...",
      "Pathogen": "...",
      "Hosts": "...",
      "Symptoms": "...",
      "Environmental Triggers": "..."
    },
    "Detailed Remedial Plan": {
      "Immediate Action": "...",
      "Traditional Remedy": "...",
      "Natural/Organic Solution": "...",
      "Modern/Synthetic Solution": "...",
      "Cultural Practices": "..."
    }
  },
  "product": {
    "Curated Product List": [
      {
        "Product": "...",
        "Active Ingredient": "...",
        "Use Case": "...",
        "Type": "...",
        "Registration": "..."
      }
    ],
    "Application Protocol": "..."
  }
}`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      { contents: [{ parts: [{ text: prompt }] }] },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );

    const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // Parse JSON safely (strip markdown fences if present)
    try {
      return JSON.parse(rawText);
    } catch {
      const cleaned = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      return JSON.parse(cleaned);
    }
  } catch (err) {
    console.error("Gemini API error:", err);
    return null;
  }
};

// Fetch detailed diagnosis from Gemini AI
const fetchDiagnosis = async (diseaseName: string) => {
  try {
    setIsDiagnosing(true);
    setDiagnosis(null);

    // Clean up incoming disease name for clarity
    const cleanDiseaseName = diseaseName
      .replace(/___/g, " - ")
      .replace(/_/g, " ");

    const diagnosisResult = await getGeminiDiagnosis(cleanDiseaseName);

    if (!diagnosisResult) {
      Alert.alert("Diagnosis Error", "Failed to get detailed diagnosis from Gemini.");
      return;
    }

    setDiagnosis(diagnosisResult);
  } catch (error) {
    console.error("Error fetching diagnosis:", error);
    Alert.alert("Diagnosis Error", "Something went wrong. Try again later.");
  } finally {
    setIsDiagnosing(false);
  }
};



  // Handle captured image from floating scanner
  useEffect(() => {
    if (route?.params?.capturedImage) {
      setSelectedImage(route.params.capturedImage);
      setTimeout(() => {
        analyzeImage(route.params.capturedImage);
      }, 500);
    }
  }, [route?.params?.capturedImage]);


  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setShowImagePicker(false);
        setSelectedImage(imageUri);
        await analyzeImage(imageUri);
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setShowImagePicker(false);
        setSelectedImage(imageUri);
        await analyzeImage(imageUri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select photo. Please try again.');
    }
  };

  // UI Render
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Plant Disease Detection</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!selectedImage ? (
          <View style={styles.uploadSection}>
            <View style={styles.uploadCard}>
              <Ionicons name="camera-outline" size={64} color={colors.primary} />
              <Text style={styles.uploadTitle}>Scan Your Plant</Text>
              <Text style={styles.uploadSubtitle}>
                Take a photo or select an image from your gallery to analyze your plant's health
              </Text>
              <CustomButton
                title="Take Photo"
                onPress={() => setShowImagePicker(true)}
                style={styles.uploadButton}
              />
              <Text style={styles.tipsTitle}>Tips for best results:</Text>
              <View style={styles.tipsList}>
                <Text style={styles.tipItem}>• Ensure good lighting</Text>
                <Text style={styles.tipItem}>• Focus on affected areas</Text>
                <Text style={styles.tipItem}>• Take clear, close-up photos</Text>
                <Text style={styles.tipItem}>• Include leaves and stems</Text>
              </View>

              {/* Manual Research Section */}
              <View style={styles.manualResearchSection}>
                <TouchableOpacity
                  style={styles.manualResearchToggle}
                  onPress={() => setShowManualInput(!showManualInput)}
                >
                  <Ionicons
                    name={showManualInput ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.manualResearchToggleText}>
                    Research a specific disease
                  </Text>
                </TouchableOpacity>

                {showManualInput && (
                  <View style={styles.manualInputContainer}>
                    <TextInput
                      style={styles.manualInput}
                      placeholder="Enter disease name (e.g., 'Tomato Late Blight', 'Apple Scab')"
                      value={manualDiseaseName}
                      onChangeText={setManualDiseaseName}
                      multiline={false}
                    />
                    <CustomButton
                      title="Get Diagnosis"
                      onPress={() => {
                        if (manualDiseaseName.trim()) {
                          fetchDiagnosis(manualDiseaseName.trim());
                          setShowManualInput(false);
                          setManualDiseaseName('');
                        } else {
                          Alert.alert('Error', 'Please enter a disease name');
                        }
                      }}
                      style={styles.manualResearchButton}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.analysisSection}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.plantImage} />
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={() => setShowImagePicker(true)}
              >
                <Ionicons name="camera-outline" size={16} color={colors.primary} />
                <Text style={styles.retakeText}>Retake</Text>
              </TouchableOpacity>
            </View>
            {isAnalyzing && (
              <View style={styles.analyzingCard}>
                <ActivityIndicator
                  size="large"
                  color={colors.primary}
                  style={styles.loadingSpinner}
                />
                <Text style={styles.analyzingTitle}>Analyzing Your Plant</Text>
                <Text style={styles.analyzingSubtitle}>
                  Our AI is examining your plant image...
                </Text>
              </View>
            )}
            {analysisResult && (
              <View style={styles.resultsSection}>
                <View style={styles.resultHeader}>
                  <View style={styles.plantInfo}>
                    <Text style={styles.plantType}>
                      {getPlantInfo(analysisResult.disease).plant}
                    </Text>
                    <Text style={styles.confidence}>
                      Confidence: {Math.round((analysisResult.confidence || 0) * 100)}%
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.healthStatus,
                      { backgroundColor: getHealthStatusColor(getPlantInfo(analysisResult.disease).status) }
                    ]}
                  >
                    <Text style={styles.healthStatusText}>
                      {getPlantInfo(analysisResult.disease).status}
                    </Text>
                  </View>
                </View>

                {/* Manual diagnosis button */}
                {analysisResult && !isDiagnosing && (
                  <View style={styles.manualDiagnosisSection}>
                    <CustomButton
                      title="Get Detailed Analysis"
                      onPress={() => fetchDiagnosis(analysisResult.disease)}
                      style={styles.manualDiagnosisButton}
                    />
                  </View>
                )}

                {/* Diagnosis loading */}
                {isDiagnosing && (
                  <View style={styles.diagnosisLoadingCard}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.diagnosisLoadingText}>
                      Getting detailed diagnosis and treatment recommendations...
                    </Text>
                  </View>
                )}

                {/* Detailed Diagnosis Results */}
                {diagnosis && (
                  <ScrollView style={styles.diagnosisContainer} showsVerticalScrollIndicator={false}>
                    {/* Summary */}
                    <View style={styles.diagnosisSection}>
                      <Text style={styles.diagnosisSectionTitle}>Summary</Text>
                      <Text style={styles.diagnosisText}>{diagnosis.Summary}</Text>
                    </View>

                    {/* Disease Information */}
                    <View style={styles.diagnosisSection}>
                      <Text style={styles.diagnosisSectionTitle}>Disease Information</Text>
                      <View style={styles.diagnosisDetailCard}>
                        <Text style={styles.diagnosisDetailTitle}>Disease:</Text>
                        <Text style={styles.diagnosisDetailText}>{diagnosis.remedies.Diagnosis.Disease}</Text>
                      </View>
                      <View style={styles.diagnosisDetailCard}>
                        <Text style={styles.diagnosisDetailTitle}>Pathogen:</Text>
                        <Text style={styles.diagnosisDetailText}>{diagnosis.remedies.Diagnosis.Pathogen}</Text>
                      </View>
                      <View style={styles.diagnosisDetailCard}>
                        <Text style={styles.diagnosisDetailTitle}>Affected Plants:</Text>
                        <Text style={styles.diagnosisDetailText}>{diagnosis.remedies.Diagnosis.Hosts}</Text>
                      </View>
                      <View style={styles.diagnosisDetailCard}>
                        <Text style={styles.diagnosisDetailTitle}>Symptoms:</Text>
                        <Text style={styles.diagnosisDetailText}>{diagnosis.remedies.Diagnosis.Symptoms}</Text>
                      </View>
                      <View style={styles.diagnosisDetailCard}>
                        <Text style={styles.diagnosisDetailTitle}>Environmental Triggers:</Text>
                        <Text style={styles.diagnosisDetailText}>{diagnosis.remedies.Diagnosis['Environmental Triggers']}</Text>
                      </View>
                    </View>

                    {/* Treatment Plan */}
                    <View style={styles.diagnosisSection}>
                      <Text style={styles.diagnosisSectionTitle}>Treatment Plan</Text>
                      <View style={styles.diagnosisTreatmentCard}>
                        <Text style={styles.diagnosisTreatmentTitle}>🚨 Immediate Action</Text>
                        <Text style={styles.diagnosisTreatmentText}>{diagnosis.remedies['Detailed Remedial Plan']['Immediate Action']}</Text>
                      </View>
                      <View style={styles.diagnosisTreatmentCard}>
                        <Text style={styles.diagnosisTreatmentTitle}>🌿 Traditional Remedy</Text>
                        <Text style={styles.diagnosisTreatmentText}>{diagnosis.remedies['Detailed Remedial Plan']['Traditional Remedy']}</Text>
                      </View>
                      <View style={styles.diagnosisTreatmentCard}>
                        <Text style={styles.diagnosisTreatmentTitle}>🍃 Natural/Organic Solution</Text>
                        <Text style={styles.diagnosisTreatmentText}>{diagnosis.remedies['Detailed Remedial Plan']['Natural/Organic Solution']}</Text>
                      </View>
                      <View style={styles.diagnosisTreatmentCard}>
                        <Text style={styles.diagnosisTreatmentTitle}>💊 Modern/Synthetic Solution</Text>
                        <Text style={styles.diagnosisTreatmentText}>{diagnosis.remedies['Detailed Remedial Plan']['Modern/Synthetic Solution']}</Text>
                      </View>
                      <View style={styles.diagnosisTreatmentCard}>
                        <Text style={styles.diagnosisTreatmentTitle}>🌱 Cultural Practices</Text>
                        <Text style={styles.diagnosisTreatmentText}>{diagnosis.remedies['Detailed Remedial Plan']['Cultural Practices']}</Text>
                      </View>
                    </View>

                    {/* Recommended Products */}
                    <View style={styles.diagnosisSection}>
                      <Text style={styles.diagnosisSectionTitle}>Recommended Products</Text>
                      {diagnosis.product['Curated Product List'].map((product, index) => (
                        <View key={index} style={styles.diagnosisProductCard}>
                          <Text style={styles.diagnosisProductName}>{product.Product}</Text>
                          <Text style={styles.productDetail}>Active Ingredient: {product['Active Ingredient']}</Text>
                          <Text style={styles.productDetail}>Use Case: {product['Use Case']}</Text>
                          <Text style={styles.productDetail}>Type: {product.Type}</Text>
                          <Text style={styles.productDetail}>Registration: {product.Registration}</Text>
                        </View>
                      ))}

                      <View style={styles.applicationProtocolCard}>
                        <Text style={styles.applicationProtocolTitle}>Application Protocol</Text>
                        <Text style={styles.applicationProtocolText}>{diagnosis.product['Application Protocol']}</Text>
                      </View>
                    </View>
                  </ScrollView>
                )}
              </View>
            )}
          </View>
        )}

        {/* Global Diagnosis Loading Modal */}
        {isDiagnosing && (
          <View style={styles.globalLoadingOverlay}>
            <View style={styles.globalLoadingCard}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.globalLoadingTitle}>Getting Expert Analysis</Text>
              <Text style={styles.globalLoadingSubtitle}>
                Our AI agricultural expert is analyzing the disease and preparing detailed treatment recommendations...
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
      <Modal
        visible={showImagePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowImagePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Image</Text>
            <TouchableOpacity style={styles.modalOption} onPress={handleTakePhoto}>
              <Ionicons name="camera-outline" size={24} color={colors.primary} />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={handleSelectFromGallery}>
              <Ionicons name="image-outline" size={24} color={colors.primary} />
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
  // Diagnosis styles
  diagnosisLoadingCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginTop: spacing.md,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  diagnosisLoadingText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  diagnosisContainer: {
    marginTop: spacing.md,
    maxHeight: 600,
  },
  diagnosisSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  diagnosisSectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  diagnosisText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    lineHeight: 22,
  },
  diagnosisDetailCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  diagnosisDetailTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  diagnosisDetailText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  diagnosisTreatmentCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  diagnosisTreatmentTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  diagnosisTreatmentText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  diagnosisProductCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  diagnosisProductName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  productDetail: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs / 2,
  },
  applicationProtocolCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  applicationProtocolTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  applicationProtocolText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    lineHeight: 20,
  },
  manualDiagnosisSection: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  manualDiagnosisButton: {
    backgroundColor: colors.accent,
  },
  manualResearchSection: {
    marginTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.primary + '20',
    paddingTop: spacing.md,
  },
  manualResearchToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  manualResearchToggleText: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
    marginLeft: spacing.sm,
  },
  manualInputContainer: {
    marginTop: spacing.md,
  },
  manualInput: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text.primary,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    minHeight: 50,
  },
  manualResearchButton: {
    backgroundColor: colors.primary,
  },
  globalLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  globalLoadingCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    margin: spacing.lg,
    alignItems: 'center',
    maxWidth: '80%',
  },
  globalLoadingTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  globalLoadingSubtitle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default PlantDiseaseDetection;
