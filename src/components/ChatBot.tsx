import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface ChatBotProps {
  // No props needed for now
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

const ChatBot: React.FC<ChatBotProps> = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your gardening assistant. I can help you with plant care, pest problems, watering schedules, and more. How can I assist you today?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation for the chat button
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, []);

  const botanicalResponses = {
    watering: [
      "For most plants, water when the top inch of soil feels dry. Stick your finger into the soil to check!",
      "Early morning (6-10 AM) is the best time to water plants as it reduces evaporation and prevents fungal diseases.",
      "Overwatering is more harmful than underwatering. Signs include yellowing leaves and musty soil smell."
    ],
    fertilizer: [
      "Organic compost is excellent for most plants. Apply a 2-3 inch layer around the base.",
      "Nitrogen promotes leafy growth, phosphorus helps with roots and flowers, potassium strengthens overall plant health.",
      "Feed flowering plants with phosphorus-rich fertilizer during blooming season."
    ],
    pests: [
      "Neem oil is a natural pesticide that's safe for organic gardening. Spray in the evening to avoid harming beneficial insects.",
      "Companion planting can help repel pests. Try basil with tomatoes, marigolds with vegetables.",
      "Inspect plants regularly for early pest detection. Look under leaves where many pests hide."
    ],
    diseases: [
      "Good air circulation helps prevent fungal diseases. Don't overcrowd plants.",
      "Water at the base of plants rather than on leaves to prevent fungal issues.",
      "Remove affected leaves immediately and dispose of them away from your garden."
    ],
    planting: [
      "Check your local frost dates before planting. Most vegetables need soil temperature above 10°C.",
      "Space plants according to their mature size to ensure good air circulation.",
      "Prepare soil with compost 2-3 weeks before planting for best results."
    ],
    harvest: [
      "Harvest leafy greens in the morning after dew dries but before it gets too hot.",
      "Pick vegetables regularly to encourage continued production.",
      "Harvest herbs before flowering for the best flavor concentration."
    ],
    soil: [
      "Test your soil pH. Most vegetables prefer slightly acidic to neutral soil (6.0-7.0).",
      "Add organic matter like compost to improve soil structure and fertility.",
      "Clay soil benefits from sand and compost, while sandy soil needs more organic matter."
    ],
    pruning: [
      "Prune in late winter or early spring before new growth starts.",
      "Remove dead, diseased, or crossing branches first.",
      "For flowering plants, prune right after blooming to avoid removing next year's flowers."
    ]
  };

  const getRandomResponse = (category: string) => {
    const responses = botanicalResponses[category as keyof typeof botanicalResponses];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Check for keywords and provide relevant responses
    if (message.includes('water') || message.includes('irrigation')) {
      return getRandomResponse('watering');
    } else if (message.includes('fertilizer') || message.includes('nutrient') || message.includes('feed')) {
      return getRandomResponse('fertilizer');
    } else if (message.includes('pest') || message.includes('bug') || message.includes('insect')) {
      return getRandomResponse('pests');
    } else if (message.includes('disease') || message.includes('fungus') || message.includes('sick')) {
      return getRandomResponse('diseases');
    } else if (message.includes('plant') || message.includes('grow') || message.includes('seed')) {
      return getRandomResponse('planting');
    } else if (message.includes('harvest') || message.includes('pick') || message.includes('when to')) {
      return getRandomResponse('harvest');
    } else if (message.includes('soil') || message.includes('ground') || message.includes('dirt')) {
      return getRandomResponse('soil');
    } else if (message.includes('prune') || message.includes('trim') || message.includes('cut')) {
      return getRandomResponse('pruning');
    } else if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
      return "Hello! I'm here to help with all your gardening questions. You can ask me about watering, fertilizing, pest control, plant diseases, harvesting, soil care, and much more!";
    } else if (message.includes('thank')) {
      return "You're welcome! Happy gardening! Feel free to ask me anything else about your plants.";
    } else if (message.includes('tomato')) {
      return "Tomatoes need full sun, consistent watering, and support structures. Watch for blight and hornworms. Harvest when fruits are firm but fully colored!";
    } else if (message.includes('basil') || message.includes('herb')) {
      return "Herbs like basil prefer well-drained soil and morning sun. Pinch off flower buds to keep leaves tender. Harvest frequently to encourage growth!";
    } else if (message.includes('rose')) {
      return "Roses need good air circulation, morning sun, and regular feeding. Prune in late winter and deadhead spent blooms for continuous flowering.";
    } else {
      const generalTips = [
        "That's an interesting question! Generally, healthy plants need good soil, proper watering, adequate light, and regular care. Can you be more specific?",
        "I'd be happy to help! For the best advice, could you tell me more about your specific plant or gardening situation?",
        "Every plant is unique! Factors like climate, soil type, and plant variety matter. What specific plant are you asking about?",
        "Great question! Consider factors like your local climate, soil conditions, and the specific needs of your plants. What would you like to know more about?"
      ];
      return generalTips[Math.floor(Math.random() * generalTips.length)];
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    // Auto scroll to bottom when new messages are added
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, isTyping]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessageContainer : styles.botMessageContainer,
      ]}
    >
      {!message.isUser && (
        <View style={styles.botAvatar}>
          <Ionicons name="leaf" size={16} color={colors.surface} />
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          message.isUser ? styles.userMessageBubble : styles.botMessageBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.isUser ? styles.userMessageText : styles.botMessageText,
          ]}
        >
          {message.text}
        </Text>
        <Text
          style={[
            styles.messageTime,
            message.isUser ? styles.userMessageTime : styles.botMessageTime,
          ]}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );

  const renderTypingIndicator = () => (
    <View style={[styles.messageContainer, styles.botMessageContainer]}>
      <View style={styles.botAvatar}>
        <Ionicons name="leaf" size={16} color={colors.surface} />
      </View>
      <View style={[styles.messageBubble, styles.botMessageBubble, styles.typingBubble]}>
        <View style={styles.typingIndicator}>
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
        </View>
      </View>
    </View>
  );

  return (
    <>
      {/* Floating Chat Button */}
      <Animated.View style={[styles.floatingButton, { transform: [{ scale: pulseAnim }] }]}>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => setIsVisible(true)}
        >
          <Ionicons name="chatbubble" size={24} color={colors.surface} />
        </TouchableOpacity>
      </Animated.View>

      {/* Chat Modal */}
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            style={styles.chatModal}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {/* Chat Header */}
            <View style={styles.chatHeader}>
              <View style={styles.headerLeft}>
                <View style={styles.botHeaderAvatar}>
                  <Ionicons name="leaf" size={20} color={colors.surface} />
                </View>
                <View>
                  <Text style={styles.chatTitle}>Garden Assistant</Text>
                  <Text style={styles.chatSubtitle}>AI Powered • Always Online</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsVisible(false)}
              >
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              showsVerticalScrollIndicator={false}
            >
              {messages.map(renderMessage)}
              {isTyping && renderTypingIndicator()}
            </ScrollView>

            {/* Input Area */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.messageInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask about watering, pests, planting..."
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                onPress={sendMessage}
                disabled={!inputText.trim() || isTyping}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={!inputText.trim() ? colors.text.hint : colors.surface}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 30, // Below the plant scanner button
    right: 20,
    zIndex: 1000,
  },
  chatButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  chatModal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    height: '85%',
    maxHeight: 600,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.primaryLight,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  botHeaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  chatTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  chatSubtitle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  closeButton: {
    padding: spacing.sm,
  },
  messagesContainer: {
    flex: 1,
    padding: spacing.md,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  userMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: borderRadius.sm,
  },
  botMessageBubble: {
    backgroundColor: colors.background,
    borderBottomLeftRadius: borderRadius.sm,
  },
  messageText: {
    fontSize: fontSize.md,
    lineHeight: 20,
  },
  userMessageText: {
    color: colors.surface,
  },
  botMessageText: {
    color: colors.text.primary,
  },
  messageTime: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  userMessageTime: {
    color: colors.surface,
    opacity: 0.8,
    textAlign: 'right',
  },
  botMessageTime: {
    color: colors.text.hint,
  },
  typingBubble: {
    paddingVertical: spacing.sm,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text.hint,
    // Note: CSS-style animation won't work in React Native
    // You'd need to use Animated.Value for the animation
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    maxHeight: 100,
    fontSize: fontSize.md,
    color: colors.text.primary,
    backgroundColor: colors.background,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.text.hint,
  },
});

export default ChatBot;
