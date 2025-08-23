import React from 'react';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import AppNavigation from './src/navigation/AppNavigation';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { LanguageProvider } from './src/contexts/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppNavigation />
        <StatusBar style="auto" />
      </ThemeProvider>
    </LanguageProvider>
  );
}
