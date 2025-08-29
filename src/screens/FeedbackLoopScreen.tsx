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
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface FeedbackLoopScreenProps {
  navigation: any;
}

interface FeedbackItem {
  id: string;
  type: 'advice' | 'recommendation' | 'prediction';
  title: string;
  description: string;
  date: string;
  category: string;
  rating?: number;
  outcome?: string;
  status: 'pending' | 'rated' | 'completed';
}

interface AITrainingData {
  totalFeedbacks: number;
  accuracy: number;
  improvements: number;
  userSatisfaction: number;
}

const FeedbackLoopScreen: React.FC<FeedbackLoopScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { translations } = useLanguage();

  const [selectedTab, setSelectedTab] = useState<'pending' | 'history' | 'insights'>('pending');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [outcomeText, setOutcomeText] = useState('');
  const [improvementSuggestion, setImprovementSuggestion] = useState('');

  const tabs = [
    { key: 'pending', label: 'Pending Feedback', icon: 'time' },
    { key: 'history', label: 'Feedback History', icon: 'checkmark-circle' },
    { key: 'insights', label: 'AI Insights', icon: 'analytics' },
  ];

  const pendingFeedbacks: FeedbackItem[] = [
    {
      id: '1',
      type: 'advice',
      title: 'Pest Control Recommendation',
      description: 'Use neem oil spray for aphid control on tomato plants',
      date: '2 days ago',
      category: 'Pest Management',
      status: 'pending',
    },
    {
      id: '2',
      type: 'prediction',
      title: 'Harvest Time Prediction',
      description: 'Optimal harvest time for wheat crop: September 15-20',
      date: '1 week ago',
      category: 'Crop Planning',
      status: 'pending',
    },
    {
      id: '3',
      type: 'recommendation',
      title: 'Irrigation Schedule',
      description: 'Reduce watering frequency due to upcoming rain forecast',
      date: '3 days ago',
      category: 'Water Management',
      status: 'pending',
    },
  ];

  const feedbackHistory: FeedbackItem[] = [
    {
      id: '4',
      type: 'advice',
      title: 'Fertilizer Application',
      description: 'Apply NPK fertilizer before monsoon season',
      date: '2 weeks ago',
      category: 'Fertilization',
      status: 'completed',
      rating: 5,
      outcome: 'Excellent results! Crop growth improved by 30%',
    },
    {
      id: '5',
      type: 'recommendation',
      title: 'Crop Rotation Advice',
      description: 'Plant legumes after rice harvest to improve soil nitrogen',
      date: '1 month ago',
      category: 'Soil Management',
      status: 'rated',
      rating: 4,
      outcome: 'Good advice, soil quality improved',
    },
  ];

  const aiTrainingData: AITrainingData = {
    totalFeedbacks: 127,
    accuracy: 89.5,
    improvements: 23,
    userSatisfaction: 4.3,
  };

  const handleFeedbackSubmit = () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please provide a rating for this advice.');
      return;
    }

    if (!outcomeText.trim()) {
      Alert.alert('Outcome Required', 'Please describe the outcome of following this advice.');
      return;
    }

    // Simulate feedback submission
    Alert.alert(
      'Feedback Submitted',
      'Thank you for your feedback! This helps us improve our AI recommendations.',
      [
        {
          text: 'OK',
          onPress: () => {
            setModalVisible(false);
            setRating(0);
            setOutcomeText('');
            setImprovementSuggestion('');
            setSelectedFeedback(null);
          },
        },
      ]
    );
  };

  const openFeedbackModal = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
    setModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'rated':
        return '#3B82F6';
      case 'completed':
        return '#10B981';
      default:
        return colors.text.secondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'advice':
        return 'bulb';
      case 'recommendation':
        return 'leaf';
      case 'prediction':
        return 'trending-up';
      default:
        return 'information-circle';
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
    helpButton: {
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
    content: {
      flex: 1,
      padding: spacing.lg,
    },
    feedbackCard: {
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
    feedbackHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    feedbackTypeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    feedbackTypeIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.sm,
    },
    feedbackTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      flex: 1,
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
    feedbackDescription: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.sm,
      lineHeight: 20,
    },
    feedbackMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    feedbackCategory: {
      fontSize: fontSize.xs,
      color: colors.primary,
      fontWeight: fontWeight.medium,
    },
    feedbackDate: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    ratingStars: {
      flexDirection: 'row',
      marginLeft: spacing.sm,
    },
    outcomeText: {
      fontSize: fontSize.sm,
      color: colors.text.primary,
      fontStyle: 'italic',
      marginTop: spacing.xs,
    },
    actionButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    actionButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.surface,
    },
    insightsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
    },
    insightCard: {
      width: '48%',
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
    insightValue: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.primary,
      marginBottom: spacing.xs,
    },
    insightLabel: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      width: '90%',
      maxHeight: '80%',
    },
    modalTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.lg,
      textAlign: 'center',
    },
    ratingSection: {
      marginBottom: spacing.lg,
    },
    sectionLabel: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    starRating: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    textInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      fontSize: fontSize.sm,
      color: colors.text.primary,
      textAlignVertical: 'top',
      marginBottom: spacing.lg,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalButton: {
      flex: 1,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      marginHorizontal: spacing.xs,
    },
    cancelButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    submitButton: {
      backgroundColor: colors.primary,
    },
    cancelButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
    },
    submitButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.surface,
    },
  });

  const styles = getStyles();

  const renderPendingFeedbacks = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {pendingFeedbacks.map((feedback) => (
        <View key={feedback.id} style={styles.feedbackCard}>
          <View style={styles.feedbackHeader}>
            <View style={styles.feedbackTypeContainer}>
              <View
                style={[
                  styles.feedbackTypeIcon,
                  { backgroundColor: colors.primary + '15' },
                ]}
              >
                <Ionicons
                  name={getTypeIcon(feedback.type) as any}
                  size={16}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.feedbackTitle}>{feedback.title}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(feedback.status) }]}>
              <Text style={styles.statusText}>{feedback.status}</Text>
            </View>
          </View>
          <Text style={styles.feedbackDescription}>{feedback.description}</Text>
          <View style={styles.feedbackMeta}>
            <Text style={styles.feedbackCategory}>{feedback.category}</Text>
            <Text style={styles.feedbackDate}>{feedback.date}</Text>
          </View>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openFeedbackModal(feedback)}
          >
            <Text style={styles.actionButtonText}>Provide Feedback</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  const renderFeedbackHistory = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {feedbackHistory.map((feedback) => (
        <View key={feedback.id} style={styles.feedbackCard}>
          <View style={styles.feedbackHeader}>
            <View style={styles.feedbackTypeContainer}>
              <View
                style={[
                  styles.feedbackTypeIcon,
                  { backgroundColor: colors.primary + '15' },
                ]}
              >
                <Ionicons
                  name={getTypeIcon(feedback.type) as any}
                  size={16}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.feedbackTitle}>{feedback.title}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(feedback.status) }]}>
              <Text style={styles.statusText}>{feedback.status}</Text>
            </View>
          </View>
          <Text style={styles.feedbackDescription}>{feedback.description}</Text>
          <View style={styles.feedbackMeta}>
            <Text style={styles.feedbackCategory}>{feedback.category}</Text>
            <Text style={styles.feedbackDate}>{feedback.date}</Text>
          </View>
          {feedback.rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.sectionLabel}>Rating:</Text>
              <View style={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= feedback.rating! ? 'star' : 'star-outline'}
                    size={16}
                    color="#F59E0B"
                  />
                ))}
              </View>
            </View>
          )}
          {feedback.outcome && (
            <Text style={styles.outcomeText}>"{feedback.outcome}"</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );

  const renderAIInsights = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.insightsGrid}>
        <View style={styles.insightCard}>
          <Text style={styles.insightValue}>{aiTrainingData.totalFeedbacks}</Text>
          <Text style={styles.insightLabel}>Total Feedbacks</Text>
        </View>
        <View style={styles.insightCard}>
          <Text style={styles.insightValue}>{aiTrainingData.accuracy}%</Text>
          <Text style={styles.insightLabel}>AI Accuracy</Text>
        </View>
        <View style={styles.insightCard}>
          <Text style={styles.insightValue}>{aiTrainingData.improvements}</Text>
          <Text style={styles.insightLabel}>AI Improvements</Text>
        </View>
        <View style={styles.insightCard}>
          <Text style={styles.insightValue}>{aiTrainingData.userSatisfaction}/5</Text>
          <Text style={styles.insightLabel}>User Satisfaction</Text>
        </View>
      </View>
      <Text style={styles.sectionLabel}>AI Learning Progress</Text>
      <View style={styles.feedbackCard}>
        <Text style={styles.feedbackDescription}>
          Our AI system has processed {aiTrainingData.totalFeedbacks} farmer feedbacks and achieved{' '}
          {aiTrainingData.accuracy}% accuracy in recommendations. Your feedback helps us continuously
          improve and provide better agricultural advice.
        </Text>
      </View>
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'pending':
        return renderPendingFeedbacks();
      case 'history':
        return renderFeedbackHistory();
      case 'insights':
        return renderAIInsights();
      default:
        return renderPendingFeedbacks();
    }
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
            <Text style={styles.headerTitle}>AI Feedback Loop</Text>
          </View>
          <TouchableOpacity style={styles.helpButton}>
            <Ionicons name="help-circle" size={24} color={colors.surface} />
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

      <View style={styles.content}>{renderTabContent()}</View>

      {/* Feedback Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rate This Advice</Text>
            
            <View style={styles.ratingSection}>
              <Text style={styles.sectionLabel}>How helpful was this advice?</Text>
              <View style={styles.starRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                  >
                    <Ionicons
                      name={star <= rating ? 'star' : 'star-outline'}
                      size={32}
                      color="#F59E0B"
                      style={{ marginHorizontal: spacing.xs }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={styles.sectionLabel}>What was the outcome? *</Text>
            <TextInput
              style={[styles.textInput, { height: 80 }]}
              placeholder="Describe the results of following this advice..."
              placeholderTextColor={colors.text.hint}
              value={outcomeText}
              onChangeText={setOutcomeText}
              multiline
            />

            <Text style={styles.sectionLabel}>Suggestions for improvement (optional)</Text>
            <TextInput
              style={[styles.textInput, { height: 60 }]}
              placeholder="How can we improve our recommendations?"
              placeholderTextColor={colors.text.hint}
              value={improvementSuggestion}
              onChangeText={setImprovementSuggestion}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleFeedbackSubmit}
              >
                <Text style={styles.submitButtonText}>Submit Feedback</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FeedbackLoopScreen;
