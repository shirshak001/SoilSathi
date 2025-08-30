import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import UserTypeSelectionScreen from '../screens/UserTypeSelectionScreen';
import FarmerDashboard from '../screens/FarmerDashboard';
import GardenerDashboard from '../screens/GardenerDashboard';
import DroneServiceScreen from '../screens/DroneServiceScreen';
import DroneServiceHistory from '../screens/DroneServiceHistory';
import SoilAnalysisScreen from '../screens/SoilAnalysisScreen';
import PlantDiseaseDetection from '../screens/PlantDiseaseDetection';
import ProductStore from '../screens/ProductStore';
import Checkout from '../screens/Checkout';
import WaterScheduleScreen from '../screens/WaterScheduleScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PrivacySecurityScreen from '../screens/PrivacySecurityScreen';
import PaymentMethodsScreen from '../screens/PaymentMethodsScreen';
import PlantCareRemindersScreen from '../screens/PlantCareRemindersScreen';
import WeatherTipsScreen from '../screens/WeatherTipsScreen';
import GardenZonesScreen from '../screens/GardenZonesScreen';
import CommunityScreen from '../screens/CommunityScreen';
import FieldManagementScreen from '../screens/FieldManagementScreen';
import WeatherForecastScreen from '../screens/WeatherForecastScreen';
import ReportsAnalyticsScreen from '../screens/ReportsAnalyticsScreen';
import VirtualGardenPlannerScreen from '../screens/VirtualGardenPlannerScreen';
import IndoorPlantCareModeScreen from '../screens/IndoorPlantCareModeScreen';
import GardenerSocialMapScreen from '../screens/GardenerSocialMapScreen';
import AIMoodPlantsScreen from '../screens/AIMoodPlantsScreen';
import SeasonalAestheticSuggestionsScreen from '../screens/SeasonalAestheticSuggestionsScreen';
import InteractiveLearningGamesScreen from '../screens/InteractiveLearningGamesScreen';
import ARSoilExplorerScreen from '../screens/ARSoilExplorerScreen';
import SoilHealthTipsScreen from '../screens/SoilHealthTipsScreen';
import SoilSuperheroStoryScreen from '../screens/SoilSuperheroStoryScreen';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  UserTypeSelection: undefined;
  FarmerDashboard: undefined;
  GardenerDashboard: undefined;
  DroneService: undefined;
  DroneServiceHistory: undefined;
  SoilAnalysis: undefined;
  PlantDiseaseDetection: {
    capturedImage?: string;
  } | undefined;
  ProductStore: undefined;
  WaterSchedule: undefined;
  Settings: undefined;
  Profile: undefined;
  PrivacySecurity: undefined;
  PaymentMethods: undefined;
  PlantCareReminders: undefined;
  WeatherTips: undefined;
  GardenZones: undefined;
  Community: undefined;
  FieldManagement: undefined;
  WeatherForecastScreen: undefined;
  ReportsAnalyticsScreen: undefined;
  VirtualGardenPlanner: undefined;
  IndoorPlantCareMode: undefined;
  GardenerSocialMap: undefined;
  AIMoodPlants: undefined;
  SeasonalAestheticSuggestions: undefined;
  InteractiveLearningGames: undefined;
  ARSoilExplorer: undefined;
  SoilHealthTips: undefined;
  SoilSuperheroStory: undefined;
  Checkout: {
    items: Array<{
      product: {
        id: string;
        name: string;
        price: number;
        image: string;
      };
      quantity: number;
    }>;
    total: number;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="UserTypeSelection" component={UserTypeSelectionScreen} />
        <Stack.Screen name="FarmerDashboard" component={FarmerDashboard} />
        <Stack.Screen name="GardenerDashboard" component={GardenerDashboard} />
        <Stack.Screen name="DroneService" component={DroneServiceScreen} />
        <Stack.Screen name="DroneServiceHistory" component={DroneServiceHistory} />
        <Stack.Screen name="SoilAnalysis" component={SoilAnalysisScreen} />
        <Stack.Screen name="PlantDiseaseDetection" component={PlantDiseaseDetection} />
        <Stack.Screen name="ProductStore" component={ProductStore} />
        <Stack.Screen name="WaterSchedule" component={WaterScheduleScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
        <Stack.Screen name="PlantCareReminders" component={PlantCareRemindersScreen} />
        <Stack.Screen name="WeatherTips" component={WeatherTipsScreen} />
        <Stack.Screen name="GardenZones" component={GardenZonesScreen} />
        <Stack.Screen name="Community" component={CommunityScreen} />
        <Stack.Screen name="FieldManagement" component={FieldManagementScreen} />
        <Stack.Screen name="WeatherForecastScreen" component={WeatherForecastScreen} />
        <Stack.Screen name="ReportsAnalyticsScreen" component={ReportsAnalyticsScreen} />
        <Stack.Screen name="VirtualGardenPlanner" component={VirtualGardenPlannerScreen} />
        <Stack.Screen name="IndoorPlantCareMode" component={IndoorPlantCareModeScreen} />
        <Stack.Screen name="GardenerSocialMap" component={GardenerSocialMapScreen} />
        <Stack.Screen name="AIMoodPlants" component={AIMoodPlantsScreen} />
        <Stack.Screen name="SeasonalAestheticSuggestions" component={SeasonalAestheticSuggestionsScreen} />
        <Stack.Screen name="InteractiveLearningGames" component={InteractiveLearningGamesScreen} />
        <Stack.Screen name="ARSoilExplorer" component={ARSoilExplorerScreen} />
        <Stack.Screen name="SoilHealthTips" component={SoilHealthTipsScreen} />
        <Stack.Screen name="SoilSuperheroStory" component={SoilSuperheroStoryScreen} />
        <Stack.Screen name="Checkout" component={Checkout} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
