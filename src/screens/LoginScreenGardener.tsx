import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontWeight } from '../constants/theme';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import axios from 'axios';
// import api from '../utils/api'; // axios instance

interface LoginScreenProps {
  navigation: any;
}

const LoginScreenGardener: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    let hasError = false;
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      // console.log(email, password);
      const response = await axios.post("https://soilsathi-backend.onrender.com/api/v1/gardener/login", {
        email,
        password,
      });

      // console.log("Login Response:", response.data);

      // Save token if returned
      if (response.data) {
        // you can use AsyncStorage or SecureStore
        await AsyncStorage.setItem("token", JSON.stringify(response.data.data));

      }
      const token = await AsyncStorage.getItem("token");
      // console.log("Stored Token:", token);

      // Alert.alert("Success", "Logged in successfully");
      navigation.navigate("GardenerDashboard");

    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignup = () => {
    navigation.navigate('SignupGardener');
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <LinearGradient
        colors={[colors.primaryLight, colors.primary]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="leaf" size={40} color={colors.surface} />
            <Text style={styles.appName}>SoilSathi</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to continue managing your irrigation
          </Text>

          <CustomInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
            error={emailError}
          />

          <CustomInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            isPassword
            leftIcon="lock-closed-outline"
            error={passwordError}
          />

          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={navigateToForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <CustomButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            fullWidth
            style={styles.loginButton}
          />

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToSignup}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerGradient: { paddingTop: StatusBar.currentHeight || spacing.xl },
  header: { alignItems: 'center', paddingVertical: spacing.xl },
  logoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  appName: { fontSize: fontSize.heading, fontWeight: fontWeight.bold, color: colors.surface, marginLeft: spacing.sm },
  tagline: { fontSize: fontSize.md, color: colors.surface, opacity: 0.9 },
  content: { flex: 1 },
  formContainer: { padding: spacing.lg, paddingTop: spacing.xl },
  title: { fontSize: fontSize.title, fontWeight: fontWeight.bold, color: colors.text.primary, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { fontSize: fontSize.md, color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.xl },
  forgotPasswordContainer: { alignSelf: 'flex-end', marginBottom: spacing.lg },
  forgotPasswordText: { fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.medium },
  loginButton: { marginBottom: spacing.md },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg },
  divider: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: fontSize.sm, color: colors.text.hint, paddingHorizontal: spacing.md },
  signupContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.md },
  signupText: { fontSize: fontSize.md, color: colors.text.secondary },
  signupLink: { fontSize: fontSize.md, color: colors.primary, fontWeight: fontWeight.semibold },
});

export default LoginScreenGardener;
