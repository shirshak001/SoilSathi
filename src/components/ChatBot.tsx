import React, { useState, useRef, useEffect } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { colors, spacing, borderRadius, fontSize, fontWeight } from "../constants/theme";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";

const ChatBot: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "🌱 Hello! I’m your gardening assistant. Ask me about plant care, watering, pests, soil, or anything related!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Floating button pulse animation
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ]).start(() => pulse());
    };
    pulse();
  }, []);

  const getGeminiResponse = async (prompt: string): Promise<string> => {
    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
        { contents: [{ parts: [{ text: prompt }] }] },
        { headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY } }
      );
      // console.log("Gemini API response:", response.data);

      return (
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn’t generate a response."
      );
    } catch (error: any) {
      console.error("Gemini API error:", error.response?.data || error.message);
      return "⚠️ Oops! Something went wrong with the AI.";
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

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const aiText = await getGeminiResponse(inputText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, isTyping]);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

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
        <Text style={{ color: colors.text.hint }}>…</Text>
      </View>
    </View>
  );

  return (
    <>
      {/* Floating Chat Button */}
      <Animated.View style={[styles.floatingButton, { transform: [{ scale: pulseAnim }] }]}>
        <TouchableOpacity style={styles.chatButton} onPress={() => setIsVisible(true)}>
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
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            {/* Chat Header */}
            <View style={styles.chatHeader}>
              <View style={styles.headerLeft}>
                <View style={styles.botHeaderAvatar}>
                  <Ionicons name="leaf" size={20} color={colors.surface} />
                </View>
                <View>
                  <Text style={styles.chatTitle}>Garden Assistant</Text>
                  <Text style={styles.chatSubtitle}>AI Powered • Gemini</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <ScrollView ref={scrollViewRef} style={styles.messagesContainer}>
              {messages.map(renderMessage)}
              {isTyping && renderTypingIndicator()}
            </ScrollView>

            {/* Input Area */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.messageInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask me anything about plants..."
                multiline
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
    position: "absolute",
    bottom: 30,
    right: 20,
    zIndex: 1000,
  },
  chatButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  chatModal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    height: "85%",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  botHeaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  chatTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold },
  chatSubtitle: { fontSize: fontSize.sm, color: colors.text.secondary },
  closeButton: { padding: spacing.sm },
  messagesContainer: { flex: 1, padding: spacing.md },
  messageContainer: { flexDirection: "row", marginBottom: spacing.md, alignItems: "flex-end" },
  userMessageContainer: { justifyContent: "flex-end" },
  botMessageContainer: { justifyContent: "flex-start" },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  userMessageBubble: { backgroundColor: colors.primary },
  botMessageBubble: { backgroundColor: colors.background },
  messageText: { fontSize: fontSize.md },
  userMessageText: { color: colors.surface },
  botMessageText: { color: colors.text.primary },
  messageTime: { fontSize: fontSize.xs, marginTop: 4 },
  userMessageTime: { color: colors.surface, opacity: 0.8, textAlign: "right" },
  botMessageTime: { color: colors.text.hint },
  typingBubble: { padding: spacing.md },
  inputContainer: {
    flexDirection: "row",
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
    padding: spacing.md,
    marginRight: spacing.sm,
    fontSize: fontSize.md,
    color: colors.text.primary,
    backgroundColor: colors.background,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: { backgroundColor: colors.text.hint },
});

export default ChatBot;
