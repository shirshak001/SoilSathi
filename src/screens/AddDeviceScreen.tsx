import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { colors, spacing, fontSize, fontWeight } from "../constants/theme";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddDeviceScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [deviceId, setDeviceId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddDevice = async () => {
    if (!deviceId.trim()) {
      Alert.alert("Validation Error", "Please enter a valid Device ID");
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Authentication Error", "Please login again");
        return;
      }

      const response = await axios.post(
        `https://soilsathi-backend.onrender.com/api/v1/gardener/addDevice`,
        { deviceId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Device added successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Error", response.data.message || "Something went wrong");
      }
    } catch (error: any) {
      console.error("Add Device Error:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <LinearGradient
        colors={[colors.primaryLight, colors.primary]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Ionicons name="hardware-chip-outline" size={40} color={colors.surface} />
          <Text style={styles.title}>Add Device</Text>
        </View>
      </LinearGradient>

      <View style={styles.formContainer}>
        <CustomInput
          label="Device ID"
          value={deviceId}
          onChangeText={setDeviceId}
          placeholder="Enter your Device ID"
          leftIcon="key-outline"
        />

        <CustomButton
          title="Add Device"
          onPress={handleAddDevice}
          loading={loading}
          fullWidth
          style={styles.addButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerGradient: { paddingTop: StatusBar.currentHeight || spacing.xl },
  header: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    flexDirection: "row",
    justifyContent: "center",
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.surface,
    marginLeft: spacing.sm,
  },
  formContainer: { padding: spacing.lg, marginTop: spacing.xl },
  addButton: { marginTop: spacing.lg },
});

export default AddDeviceScreen;
