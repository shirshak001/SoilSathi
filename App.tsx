import React from 'react';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import AppNavigation from './src/navigation/AppNavigation';
import { ThemeProvider } from './src/contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigation />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
