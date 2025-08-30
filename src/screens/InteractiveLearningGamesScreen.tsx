import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface InteractiveLearningGamesScreenProps {
  navigation: any;
}

interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ageGroup: string;
  completed: boolean;
  stars: number;
  badges: string[];
}

interface SoilPlantMatch {
  soilType: string;
  soilIcon: string;
  soilDescription: string;
  correctPlants: string[];
  wrongPlants: string[];
}

interface CompostItem {
  id: string;
  name: string;
  type: 'compost' | 'plastic';
  icon: string;
  x: number;
  y: number;
}

interface WateringLevel {
  plantName: string;
  plantIcon: string;
  waterNeed: number; // 1-5 scale
  currentWater: number;
  isCorrect: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: string;
}

const { width, height } = Dimensions.get('window');

const InteractiveLearningGamesScreen: React.FC<InteractiveLearningGamesScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { translations } = useLanguage();

  const [selectedTab, setSelectedTab] = useState('games');
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [gameLevel, setGameLevel] = useState(1);
  const [userProgress, setUserProgress] = useState({
    totalStars: 12,
    completedGames: 3,
    badges: ['soil-expert', 'compost-champion'],
    level: 2,
  });

  // Game 1: Soil-Plant Matching Data
  const soilPlantData: SoilPlantMatch[] = [
    {
      soilType: 'Clay Soil',
      soilIcon: 'cube',
      soilDescription: 'Heavy, dense soil that holds water well',
      correctPlants: ['Rice', 'Willow Trees', 'Mint'],
      wrongPlants: ['Cactus', 'Lavender', 'Succulents'],
    },
    {
      soilType: 'Sandy Soil',
      soilIcon: 'ellipse',
      soilDescription: 'Light, well-draining soil',
      correctPlants: ['Cactus', 'Carrots', 'Herbs'],
      wrongPlants: ['Rice', 'Water Lilies', 'Mint'],
    },
    {
      soilType: 'Loamy Soil',
      soilIcon: 'layers',
      soilDescription: 'Perfect balance of sand, silt, and clay',
      correctPlants: ['Tomatoes', 'Roses', 'Vegetables'],
      wrongPlants: ['Cactus', 'Water Plants', 'Desert Plants'],
    },
    {
      soilType: 'Peaty Soil',
      soilIcon: 'leaf',
      soilDescription: 'Acidic soil rich in organic matter',
      correctPlants: ['Blueberries', 'Azaleas', 'Ferns'],
      wrongPlants: ['Lavender', 'Succulents', 'Vegetables'],
    },
  ];

  // Game 2: Compost Game Data
  const [compostItems, setCompostItems] = useState<CompostItem[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);

  // Game 3: Watering Game Data
  const wateringLevels: WateringLevel[] = [
    { plantName: 'Cactus', plantIcon: 'flower', waterNeed: 1, currentWater: 0, isCorrect: false },
    { plantName: 'Fern', plantIcon: 'leaf', waterNeed: 4, currentWater: 0, isCorrect: false },
    { plantName: 'Tomato', plantIcon: 'nutrition', waterNeed: 3, currentWater: 0, isCorrect: false },
    { plantName: 'Succulent', plantIcon: 'diamond', waterNeed: 2, currentWater: 0, isCorrect: false },
    { plantName: 'Lettuce', plantIcon: 'leaf', waterNeed: 4, currentWater: 0, isCorrect: false },
  ];

  const [wateringData, setWateringData] = useState(wateringLevels);

  const games: Game[] = [
    {
      id: 'soil-match',
      title: 'Soil & Plant Matcher',
      description: 'Match the right plants to their favorite soil types!',
      icon: 'layers',
      difficulty: 'easy',
      ageGroup: '6-10 years',
      completed: true,
      stars: 3,
      badges: ['soil-expert'],
    },
    {
      id: 'compost-catch',
      title: 'Compost Catcher',
      description: 'Catch compost items and avoid plastic waste!',
      icon: 'leaf',
      difficulty: 'medium',
      ageGroup: '8-12 years',
      completed: true,
      stars: 2,
      badges: ['compost-champion'],
    },
    {
      id: 'water-garden',
      title: 'Garden Watering Master',
      description: 'Give each plant the right amount of water!',
      icon: 'water',
      difficulty: 'easy',
      ageGroup: '5-9 years',
      completed: false,
      stars: 0,
      badges: [],
    },
    {
      id: 'soil-layers',
      title: 'Build Soil Layers',
      description: 'Stack soil layers in the correct order!',
      icon: 'albums',
      difficulty: 'hard',
      ageGroup: '10-14 years',
      completed: false,
      stars: 0,
      badges: [],
    },
    {
      id: 'microbe-world',
      title: 'Microbe Adventure',
      description: 'Help beneficial microbes reach plant roots!',
      icon: 'bug',
      difficulty: 'medium',
      ageGroup: '8-12 years',
      completed: false,
      stars: 0,
      badges: [],
    },
    {
      id: 'nutrient-cycle',
      title: 'Nutrient Cycle Journey',
      description: 'Follow nutrients from soil to plant!',
      icon: 'sync',
      difficulty: 'hard',
      ageGroup: '12+ years',
      completed: false,
      stars: 0,
      badges: [],
    },
  ];

  const achievements: Achievement[] = [
    {
      id: 'first-game',
      title: 'Getting Started',
      description: 'Complete your first game',
      icon: 'play',
      unlocked: true,
      requirement: 'Complete any game',
    },
    {
      id: 'soil-expert',
      title: 'Soil Expert',
      description: 'Master soil and plant matching',
      icon: 'school',
      unlocked: true,
      requirement: 'Get 3 stars in Soil Matcher',
    },
    {
      id: 'compost-champion',
      title: 'Compost Champion',
      description: 'Become a composting hero',
      icon: 'leaf',
      unlocked: true,
      requirement: 'Score 500+ in Compost Catcher',
    },
    {
      id: 'water-wise',
      title: 'Water Wise',
      description: 'Perfect watering technique',
      icon: 'water',
      unlocked: false,
      requirement: 'Perfect score in Watering Game',
    },
    {
      id: 'earth-guardian',
      title: 'Earth Guardian',
      description: 'Complete all games with 3 stars',
      icon: 'planet',
      unlocked: false,
      requirement: 'Master all games',
    },
  ];

  const tabs = [
    { key: 'games', label: 'Games', icon: 'game-controller' },
    { key: 'progress', label: 'Progress', icon: 'trophy' },
    { key: 'achievements', label: 'Badges', icon: 'ribbon' },
    { key: 'facts', label: 'Fun Facts', icon: 'bulb' },
  ];

  const soilFacts = [
    {
      id: '1',
      title: 'Amazing Earthworms',
      fact: 'One earthworm can eat its own weight in soil every day!',
      icon: 'bug',
      unlocked: true,
    },
    {
      id: '2',
      title: 'Soil Organisms',
      fact: 'A teaspoon of soil contains more living organisms than there are people on Earth!',
      icon: 'eye',
      unlocked: true,
    },
    {
      id: '3',
      title: 'Soil Formation',
      fact: 'It takes 500-1000 years to form just 1 inch of soil naturally!',
      icon: 'time',
      unlocked: false,
    },
    {
      id: '4',
      title: 'Soil Colors',
      fact: 'Soil can be red, black, brown, yellow, or even purple depending on minerals!',
      icon: 'color-palette',
      unlocked: false,
    },
  ];

  useEffect(() => {
    if (currentGame === 'compost-catch' && gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0) {
      endCompostGame();
    }
  }, [timeLeft, gameActive]);

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
    headerTitle: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.surface,
      flex: 1,
      textAlign: 'center',
    },
    backButton: {
      padding: spacing.sm,
    },
    settingsButton: {
      padding: spacing.sm,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.xs,
      marginVertical: spacing.lg,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    tabIcon: {
      marginRight: spacing.sm,
    },
    tabText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.secondary,
    },
    activeTabText: {
      color: colors.surface,
    },
    progressCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      elevation: 3,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    progressHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    progressTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginLeft: spacing.md,
    },
    progressStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.primary,
    },
    statLabel: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.xs,
    },
    gameCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      elevation: 3,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    gameHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    gameIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    gameInfo: {
      flex: 1,
    },
    gameTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    gameDescription: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.xs,
    },
    gameDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.md,
    },
    gameStats: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    difficultyBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      marginRight: spacing.sm,
    },
    difficultyText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.surface,
    },
    ageGroup: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    playButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
    },
    playButtonText: {
      color: colors.surface,
      fontWeight: fontWeight.bold,
      marginLeft: spacing.sm,
    },
    completedButton: {
      backgroundColor: colors.success,
    },
    starsContainer: {
      flexDirection: 'row',
      marginTop: spacing.sm,
    },
    achievementCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      opacity: 1,
    },
    lockedAchievement: {
      opacity: 0.5,
    },
    achievementHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    achievementIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.warning,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    achievementTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    achievementDescription: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.xs,
    },
    achievementRequirement: {
      fontSize: fontSize.xs,
      color: colors.text.hint,
      marginTop: spacing.sm,
      fontStyle: 'italic',
    },
    factCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    factHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    factIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    factTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    factText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      lineHeight: 20,
    },
    gameModal: {
      flex: 1,
      backgroundColor: colors.background,
    },
    gameModalHeader: {
      backgroundColor: colors.primary,
      paddingTop: StatusBar.currentHeight || spacing.xl,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
    },
    gameModalTitle: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.surface,
      textAlign: 'center',
    },
    gameContent: {
      flex: 1,
      padding: spacing.lg,
    },
    soilCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      elevation: 2,
    },
    soilHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    soilIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    soilTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    soilDescription: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.md,
    },
    plantsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    plantChip: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      margin: spacing.xs,
      borderWidth: 2,
      borderColor: colors.border,
    },
    correctPlant: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
    wrongPlant: {
      backgroundColor: colors.error,
      borderColor: colors.error,
    },
    plantText: {
      fontSize: fontSize.sm,
      color: colors.text.primary,
    },
    correctPlantText: {
      color: colors.surface,
    },
    wrongPlantText: {
      color: colors.surface,
    },
    gameControls: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    controlButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
    },
    controlButtonText: {
      color: colors.surface,
      fontWeight: fontWeight.bold,
      marginLeft: spacing.sm,
    },
    scoreText: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.primary,
    },
    wateringContainer: {
      flex: 1,
    },
    wateringPlant: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      elevation: 2,
    },
    wateringHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    plantIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.success,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    wateringTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    waterLevelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    waterLevel: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.background,
      margin: spacing.xs,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.border,
    },
    waterFilled: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    waterCorrect: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
    waterIncorrect: {
      backgroundColor: colors.error,
      borderColor: colors.error,
    },
  });

  const styles = getStyles();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return colors.success;
      case 'medium': return colors.warning;
      case 'hard': return colors.error;
      default: return colors.primary;
    }
  };

  const startGame = (gameId: string) => {
    setCurrentGame(gameId);
    if (gameId === 'compost-catch') {
      startCompostGame();
    } else if (gameId === 'water-garden') {
      setWateringData(wateringLevels.map(plant => ({ ...plant, currentWater: 0, isCorrect: false })));
    }
  };

  const closeGame = () => {
    setCurrentGame(null);
    setGameActive(false);
    setScore(0);
    setTimeLeft(60);
  };

  const startCompostGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(60);
    generateCompostItems();
  };

  const generateCompostItems = () => {
    const compostTypes = [
      { name: 'Apple Core', type: 'compost', icon: 'nutrition' },
      { name: 'Banana Peel', type: 'compost', icon: 'leaf' },
      { name: 'Coffee Grounds', type: 'compost', icon: 'cafe' },
      { name: 'Plastic Bottle', type: 'plastic', icon: 'trash' },
      { name: 'Plastic Bag', type: 'plastic', icon: 'bag' },
      { name: 'Vegetable Scraps', type: 'compost', icon: 'restaurant' },
    ];

    const newItems = Array.from({ length: 10 }, (_, i) => {
      const randomItem = compostTypes[Math.floor(Math.random() * compostTypes.length)];
      return {
        id: `item-${i}`,
        name: randomItem.name,
        type: randomItem.type as 'compost' | 'plastic',
        icon: randomItem.icon,
        x: Math.random() * (width - 60),
        y: Math.random() * (height * 0.6),
      };
    });

    setCompostItems(newItems);
  };

  const handleCompostItemPress = (item: CompostItem) => {
    if (item.type === 'compost') {
      setScore(score + 10);
    } else {
      setScore(Math.max(0, score - 5));
    }
    setCompostItems(items => items.filter(i => i.id !== item.id));
  };

  const endCompostGame = () => {
    setGameActive(false);
    Alert.alert(
      'Game Over!',
      `Your score: ${score} points!\n${score > 100 ? 'Great job!' : 'Keep practicing!'}`,
      [{ text: 'Play Again', onPress: startCompostGame }, { text: 'Close', onPress: closeGame }]
    );
  };

  const updateWaterLevel = (plantIndex: number, increment: boolean) => {
    const newData = [...wateringData];
    const plant = newData[plantIndex];
    
    if (increment && plant.currentWater < 5) {
      plant.currentWater += 1;
    } else if (!increment && plant.currentWater > 0) {
      plant.currentWater -= 1;
    }
    
    plant.isCorrect = plant.currentWater === plant.waterNeed;
    setWateringData(newData);
  };

  const checkWateringComplete = () => {
    const allCorrect = wateringData.every(plant => plant.isCorrect);
    if (allCorrect) {
      Alert.alert('Perfect!', 'You watered all plants correctly!', [
        { text: 'Continue', onPress: closeGame }
      ]);
    }
  };

  useEffect(() => {
    if (currentGame === 'water-garden') {
      checkWateringComplete();
    }
  }, [wateringData]);

  const renderGame = (game: Game) => (
    <View key={game.id} style={styles.gameCard}>
      <View style={styles.gameHeader}>
        <View style={styles.gameIcon}>
          <Ionicons name={game.icon as any} size={24} color={colors.surface} />
        </View>
        <View style={styles.gameInfo}>
          <Text style={styles.gameTitle}>{game.title}</Text>
          <Text style={styles.gameDescription}>{game.description}</Text>
        </View>
      </View>
      
      <View style={styles.gameDetails}>
        <View>
          <View style={styles.gameStats}>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(game.difficulty) }]}>
              <Text style={styles.difficultyText}>{game.difficulty.toUpperCase()}</Text>
            </View>
            <Text style={styles.ageGroup}>{game.ageGroup}</Text>
          </View>
          {game.completed && (
            <View style={styles.starsContainer}>
              {Array.from({ length: 3 }, (_, i) => (
                <Ionicons
                  key={i}
                  name={i < game.stars ? 'star' : 'star-outline'}
                  size={16}
                  color={colors.warning}
                  style={{ marginRight: spacing.xs }}
                />
              ))}
            </View>
          )}
        </View>
        
        <TouchableOpacity
          style={[styles.playButton, game.completed && styles.completedButton]}
          onPress={() => startGame(game.id)}
        >
          <Ionicons 
            name={game.completed ? 'checkmark' : 'play'} 
            size={20} 
            color={colors.surface} 
          />
          <Text style={styles.playButtonText}>
            {game.completed ? 'Replay' : 'Play'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProgress = () => (
    <View>
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Ionicons name="trophy" size={24} color={colors.primary} />
          <Text style={styles.progressTitle}>Your Progress</Text>
        </View>
        <View style={styles.progressStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userProgress.totalStars}</Text>
            <Text style={styles.statLabel}>Stars</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userProgress.completedGames}</Text>
            <Text style={styles.statLabel}>Games</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userProgress.badges.length}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userProgress.level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderAchievements = () => (
    <View>
      {achievements.map(achievement => (
        <View 
          key={achievement.id} 
          style={[styles.achievementCard, !achievement.unlocked && styles.lockedAchievement]}
        >
          <View style={styles.achievementHeader}>
            <View style={styles.achievementIcon}>
              <Ionicons 
                name={achievement.unlocked ? achievement.icon as any : 'lock-closed'} 
                size={20} 
                color={colors.surface} 
              />
            </View>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
          </View>
          <Text style={styles.achievementDescription}>{achievement.description}</Text>
          <Text style={styles.achievementRequirement}>
            Requirement: {achievement.requirement}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderFacts = () => (
    <View>
      {soilFacts.map(fact => (
        <View key={fact.id} style={[styles.factCard, !fact.unlocked && styles.lockedAchievement]}>
          <View style={styles.factHeader}>
            <View style={styles.factIcon}>
              <Ionicons 
                name={fact.unlocked ? fact.icon as any : 'lock-closed'} 
                size={20} 
                color={colors.surface} 
              />
            </View>
            <Text style={styles.factTitle}>{fact.title}</Text>
          </View>
          <Text style={styles.factText}>
            {fact.unlocked ? fact.fact : 'Complete more games to unlock this fact!'}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderSoilMatchGame = () => (
    <View style={styles.gameContent}>
      {soilPlantData.map((soil, index) => (
        <View key={index} style={styles.soilCard}>
          <View style={styles.soilHeader}>
            <View style={styles.soilIconContainer}>
              <Ionicons name={soil.soilIcon as any} size={24} color={colors.surface} />
            </View>
            <View>
              <Text style={styles.soilTitle}>{soil.soilType}</Text>
              <Text style={styles.soilDescription}>{soil.soilDescription}</Text>
            </View>
          </View>
          
          <Text style={styles.gameTitle}>Drag plants here:</Text>
          <View style={styles.plantsContainer}>
            {[...soil.correctPlants, ...soil.wrongPlants].map((plant, plantIndex) => (
              <TouchableOpacity
                key={plantIndex}
                style={[
                  styles.plantChip,
                  soil.correctPlants.includes(plant) && styles.correctPlant,
                  soil.wrongPlants.includes(plant) && styles.wrongPlant,
                ]}
              >
                <Text 
                  style={[
                    styles.plantText,
                    soil.correctPlants.includes(plant) && styles.correctPlantText,
                    soil.wrongPlants.includes(plant) && styles.wrongPlantText,
                  ]}
                >
                  {plant}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  const renderCompostGame = () => (
    <View style={styles.gameContent}>
      <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.scoreText}>Time: {timeLeft}s</Text>
      </View>
      
      <View style={{ flex: 1, position: 'relative' }}>
        {compostItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={{
              position: 'absolute',
              left: item.x,
              top: item.y,
              backgroundColor: item.type === 'compost' ? colors.success : colors.error,
              borderRadius: borderRadius.lg,
              padding: spacing.md,
              alignItems: 'center',
            }}
            onPress={() => handleCompostItemPress(item)}
          >
            <Ionicons name={item.icon as any} size={24} color={colors.surface} />
            <Text style={{ color: colors.surface, fontSize: fontSize.xs, marginTop: spacing.xs }}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {!gameActive && (
        <TouchableOpacity style={styles.controlButton} onPress={startCompostGame}>
          <Ionicons name="play" size={20} color={colors.surface} />
          <Text style={styles.controlButtonText}>Start Game</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderWateringGame = () => (
    <View style={styles.wateringContainer}>
      <Text style={styles.gameTitle}>Give each plant the right amount of water!</Text>
      
      {wateringData.map((plant, index) => (
        <View key={index} style={styles.wateringPlant}>
          <View style={styles.wateringHeader}>
            <View style={styles.plantIconContainer}>
              <Ionicons name={plant.plantIcon as any} size={20} color={colors.surface} />
            </View>
            <Text style={styles.wateringTitle}>
              {plant.plantName} (needs {plant.waterNeed} drops)
            </Text>
          </View>
          
          <View style={styles.waterLevelContainer}>
            <TouchableOpacity
              onPress={() => updateWaterLevel(index, false)}
              style={[styles.controlButton, { marginRight: spacing.md }]}
            >
              <Ionicons name="remove" size={16} color={colors.surface} />
            </TouchableOpacity>
            
            {Array.from({ length: 5 }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.waterLevel,
                  i < plant.currentWater && styles.waterFilled,
                  plant.isCorrect && i < plant.waterNeed && styles.waterCorrect,
                  plant.currentWater > plant.waterNeed && i >= plant.waterNeed && styles.waterIncorrect,
                ]}
              >
                <Ionicons name="water" size={12} color={colors.text.hint} />
              </View>
            ))}
            
            <TouchableOpacity
              onPress={() => updateWaterLevel(index, true)}
              style={[styles.controlButton, { marginLeft: spacing.md }]}
            >
              <Ionicons name="add" size={16} color={colors.surface} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderGameContent = () => {
    switch (currentGame) {
      case 'soil-match':
        return renderSoilMatchGame();
      case 'compost-catch':
        return renderCompostGame();
      case 'water-garden':
        return renderWateringGame();
      default:
        return (
          <View style={styles.gameContent}>
            <Text style={styles.gameTitle}>Game coming soon!</Text>
          </View>
        );
    }
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'games':
        return games.map(renderGame);
      case 'progress':
        return renderProgress();
      case 'achievements':
        return renderAchievements();
      case 'facts':
        return renderFacts();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      
      <LinearGradient
        colors={[colors.primaryLight, colors.primary]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Learning Games</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={() => {}}>
            <Ionicons name="settings" size={24} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.tabContainer}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
              onPress={() => setSelectedTab(tab.key)}
            >
              <Ionicons
                name={tab.icon as any}
                size={18}
                color={selectedTab === tab.key ? colors.surface : colors.text.secondary}
                style={styles.tabIcon}
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

        <ScrollView showsVerticalScrollIndicator={false}>
          {renderTabContent()}
        </ScrollView>
      </View>

      <Modal visible={currentGame !== null} animationType="slide">
        <View style={styles.gameModal}>
          <View style={styles.gameModalHeader}>
            <TouchableOpacity style={styles.backButton} onPress={closeGame}>
              <Ionicons name="close" size={24} color={colors.surface} />
            </TouchableOpacity>
            <Text style={styles.gameModalTitle}>
              {games.find(g => g.id === currentGame)?.title || 'Game'}
            </Text>
            <View style={{ width: 40 }} />
          </View>
          
          {renderGameContent()}
          
          <View style={styles.gameControls}>
            <TouchableOpacity style={styles.controlButton} onPress={closeGame}>
              <Ionicons name="home" size={20} color={colors.surface} />
              <Text style={styles.controlButtonText}>Back to Games</Text>
            </TouchableOpacity>
            
            <Text style={styles.scoreText}>Score: {score}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default InteractiveLearningGamesScreen;
