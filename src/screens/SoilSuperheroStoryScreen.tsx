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
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface SoilSuperheroStoryScreenProps {
  navigation: any;
}

interface StoryChapter {
  id: string;
  title: string;
  superhero: string;
  description: string;
  concept: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  unlocked: boolean;
  completed: boolean;
  scenes: StoryScene[];
  badge: string;
  icon: string;
}

interface StoryScene {
  id: string;
  type: 'story' | 'choice' | 'activity' | 'lesson';
  content: string;
  character: string;
  choices?: Choice[];
  activity?: Activity;
  lesson?: Lesson;
}

interface Choice {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

interface Activity {
  type: 'drag-drop' | 'match' | 'quiz';
  instruction: string;
  items: any[];
}

interface Lesson {
  title: string;
  facts: string[];
  tips: string[];
}

const { width, height } = Dimensions.get('window');

const SoilSuperheroStoryScreen: React.FC<SoilSuperheroStoryScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { translations } = useLanguage();

  const [selectedChapter, setSelectedChapter] = useState<StoryChapter | null>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [animatedValue] = useState(new Animated.Value(0));

  const storyChapters: StoryChapter[] = [
    {
      id: 'captain-compost',
      title: 'Captain Compost Saves the Day',
      superhero: 'Captain Compost',
      description: 'Join Captain Compost as he teaches kids how to turn kitchen scraps into super soil food!',
      concept: 'Composting and Soil Nutrition',
      difficulty: 'easy',
      duration: '10 minutes',
      unlocked: true,
      completed: false,
      badge: 'compost-master',
      icon: 'leaf',
      scenes: [
        {
          id: 'scene1',
          type: 'story',
          content: 'Meet Captain Compost! He has the amazing power to turn food scraps into magical soil food. Today, he needs YOUR help to save the hungry plants in Greenville Garden!',
          character: 'captain-compost',
        },
        {
          id: 'scene2',
          type: 'choice',
          content: 'Captain Compost finds a pile of kitchen scraps. Which ones should he use for compost?',
          character: 'captain-compost',
          choices: [
            {
              text: 'Banana peels and apple cores',
              isCorrect: true,
              explanation: 'Perfect! Fruit scraps are excellent for composting!'
            },
            {
              text: 'Chicken bones and meat',
              isCorrect: false,
              explanation: 'Oops! Meat attracts pests. We use only plant scraps!'
            },
            {
              text: 'Plastic bags and cans',
              isCorrect: false,
              explanation: 'No way! These don\'t break down in soil. Only natural materials!'
            }
          ]
        },
        {
          id: 'scene3',
          type: 'lesson',
          content: 'Captain Compost explains the secret of composting!',
          character: 'captain-compost',
          lesson: {
            title: 'The Composting Secret',
            facts: [
              'Compost is like vitamins for plants',
              'It takes 2-3 months to make compost',
              'Earthworms help make compost faster',
              'Compost helps plants grow 3 times bigger'
            ],
            tips: [
              'Mix green and brown materials',
              'Keep compost damp but not soggy',
              'Turn compost every week',
              'Add earthworms for super power'
            ]
          }
        }
      ]
    },
    {
      id: 'mitti-mitra',
      title: 'Mitti Mitra and the Earthworm Rescue',
      superhero: 'Mitti Mitra',
      description: 'Help Mitti Mitra save earthworms from pollution and learn why they are soil superheroes!',
      concept: 'Soil Organisms and Biodiversity',
      difficulty: 'easy',
      duration: '12 minutes',
      unlocked: true,
      completed: false,
      badge: 'earthworm-protector',
      icon: 'bug',
      scenes: [
        {
          id: 'scene1',
          type: 'story',
          content: 'Mitti Mitra is the guardian of all soil creatures! She can talk to earthworms and helps them stay healthy. But today, the earthworms are in danger from pollution!',
          character: 'mitti-mitra',
        },
        {
          id: 'scene2',
          type: 'choice',
          content: 'Mitti Mitra finds earthworms looking sick. What could be making them unhealthy?',
          character: 'mitti-mitra',
          choices: [
            {
              text: 'Chemical pesticides in the soil',
              isCorrect: true,
              explanation: 'Exactly! Chemicals harm earthworms and other helpful soil creatures.'
            },
            {
              text: 'Too much rain water',
              isCorrect: false,
              explanation: 'Earthworms actually like moist soil! Try again.'
            },
            {
              text: 'Too many plants growing',
              isCorrect: false,
              explanation: 'Plants and earthworms are best friends! They help each other.'
            }
          ]
        },
        {
          id: 'scene3',
          type: 'activity',
          content: 'Help Mitti Mitra clean the soil by matching harmful and helpful things!',
          character: 'mitti-mitra',
          activity: {
            type: 'match',
            instruction: 'Drag harmful items to the red bin and helpful items to the green bin',
            items: [
              { name: 'Chemical pesticide', type: 'harmful' },
              { name: 'Organic compost', type: 'helpful' },
              { name: 'Plastic trash', type: 'harmful' },
              { name: 'Earthworms', type: 'helpful' },
              { name: 'Natural fertilizer', type: 'helpful' },
              { name: 'Oil spill', type: 'harmful' }
            ]
          }
        }
      ]
    },
    {
      id: 'green-guardian',
      title: 'Green Guardian vs Pesticide Monsters',
      superhero: 'Green Guardian',
      description: 'Join Green Guardian in an epic battle against Pesticide Monsters using natural solutions!',
      concept: 'Natural Pest Control',
      difficulty: 'medium',
      duration: '15 minutes',
      unlocked: false,
      completed: false,
      badge: 'natural-defender',
      icon: 'shield',
      scenes: [
        {
          id: 'scene1',
          type: 'story',
          content: 'Green Guardian protects plants from harmful pests using only natural methods! Today, scary Pesticide Monsters are threatening the garden with toxic chemicals!',
          character: 'green-guardian',
        },
        {
          id: 'scene2',
          type: 'choice',
          content: 'The Pesticide Monsters are attacking! What natural weapon should Green Guardian use?',
          character: 'green-guardian',
          choices: [
            {
              text: 'Neem oil spray',
              isCorrect: true,
              explanation: 'Great choice! Neem oil is natural and safe for plants and soil!'
            },
            {
              text: 'Harmful chemical spray',
              isCorrect: false,
              explanation: 'No! That would help the Pesticide Monsters! We need natural solutions!'
            },
            {
              text: 'Ladybugs and beneficial insects',
              isCorrect: true,
              explanation: 'Excellent! Good bugs eat the bad bugs naturally!'
            }
          ]
        },
        {
          id: 'scene3',
          type: 'lesson',
          content: 'Green Guardian teaches the secret of natural pest control!',
          character: 'green-guardian',
          lesson: {
            title: 'Natural Pest Fighting Secrets',
            facts: [
              'Ladybugs eat thousands of harmful aphids',
              'Neem oil comes from the neem tree',
              'Marigold flowers keep pests away naturally',
              'Birds are nature\'s pest controllers'
            ],
            tips: [
              'Plant flowers to attract good insects',
              'Use soapy water for soft-bodied pests',
              'Encourage birds with birdhouses',
              'Rotate crops to confuse pests'
            ]
          }
        }
      ]
    }
  ];

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

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
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },
    heroSection: {
      alignItems: 'center',
      marginVertical: spacing.xl,
      padding: spacing.xl,
      backgroundColor: colors.primaryLight,
      borderRadius: borderRadius.lg,
    },
    heroTitle: {
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.bold,
      color: colors.surface,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    heroSubtitle: {
      fontSize: fontSize.md,
      color: colors.surface,
      textAlign: 'center',
      opacity: 0.9,
    },
    chaptersContainer: {
      flex: 1,
    },
    chapterCard: {
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
    lockedCard: {
      opacity: 0.6,
      backgroundColor: colors.text.secondary,
    },
    completedCard: {
      borderWidth: 2,
      borderColor: colors.success,
    },
    chapterHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    chapterIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    chapterTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      flex: 1,
    },
    statusIcon: {
      marginLeft: spacing.sm,
    },
    chapterMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    superheroName: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.primary,
    },
    chapterDuration: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    chapterDescription: {
      fontSize: fontSize.md,
      color: colors.text.secondary,
      lineHeight: 20,
      marginBottom: spacing.md,
    },
    conceptBadge: {
      backgroundColor: colors.primaryLight,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      alignSelf: 'flex-start',
    },
    conceptText: {
      fontSize: fontSize.sm,
      color: colors.surface,
      fontWeight: fontWeight.medium,
    },
    // Modal styles
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.8)',
    },
    storyContainer: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    storyHeader: {
      backgroundColor: colors.primary,
      paddingTop: StatusBar.currentHeight || spacing.lg,
      paddingBottom: spacing.lg,
      paddingHorizontal: spacing.lg,
    },
    storyHeaderContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    storyTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.surface,
      flex: 1,
      textAlign: 'center',
    },
    storyProgress: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.md,
    },
    progressBar: {
      flex: 1,
      height: 4,
      backgroundColor: colors.surface,
      borderRadius: 2,
      marginHorizontal: spacing.md,
      opacity: 0.3,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.surface,
      borderRadius: 2,
    },
    progressText: {
      fontSize: fontSize.sm,
      color: colors.surface,
    },
    sceneContainer: {
      flex: 1,
      padding: spacing.xl,
    },
    characterSection: {
      alignItems: 'center',
      marginBottom: spacing.xl,
      padding: spacing.lg,
      backgroundColor: colors.primaryLight,
      borderRadius: borderRadius.lg,
    },
    characterIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    characterName: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.surface,
      marginBottom: spacing.sm,
    },
    sceneContent: {
      fontSize: fontSize.lg,
      color: colors.text.primary,
      lineHeight: 24,
      textAlign: 'center',
      marginBottom: spacing.xl,
    },
    choicesContainer: {
      gap: spacing.md,
    },
    choiceButton: {
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      alignItems: 'center',
    },
    choiceText: {
      fontSize: fontSize.md,
      color: colors.text.primary,
      textAlign: 'center',
      fontWeight: fontWeight.medium,
    },
    correctChoice: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
    incorrectChoice: {
      backgroundColor: colors.error,
      borderColor: colors.error,
    },
    choiceResultText: {
      color: colors.surface,
    },
    explanationContainer: {
      marginTop: spacing.lg,
      padding: spacing.lg,
      backgroundColor: colors.primaryLight,
      borderRadius: borderRadius.md,
    },
    explanationText: {
      fontSize: fontSize.md,
      color: colors.surface,
      textAlign: 'center',
      lineHeight: 22,
    },
    lessonContainer: {
      gap: spacing.lg,
    },
    lessonTitle: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.primary,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    factsContainer: {
      backgroundColor: '#E8F5E8',
      borderRadius: borderRadius.md,
      padding: spacing.lg,
    },
    sectionTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.success,
      marginBottom: spacing.md,
    },
    factItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    factBullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.success,
      marginTop: 8,
      marginRight: spacing.sm,
    },
    factText: {
      flex: 1,
      fontSize: fontSize.md,
      color: colors.text.primary,
      lineHeight: 22,
    },
    tipsContainer: {
      backgroundColor: '#FFF8E1',
      borderRadius: borderRadius.md,
      padding: spacing.lg,
    },
    navigationButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    navButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.lg,
      flexDirection: 'row',
      alignItems: 'center',
    },
    navButtonDisabled: {
      backgroundColor: colors.text.secondary,
    },
    navButtonText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.surface,
      marginHorizontal: spacing.sm,
    },
    badgeNotification: {
      position: 'absolute',
      top: spacing.lg,
      right: spacing.lg,
      backgroundColor: colors.success,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 5,
    },
    badgeText: {
      fontSize: fontSize.sm,
      color: colors.surface,
      fontWeight: fontWeight.bold,
      marginLeft: spacing.sm,
    },
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return colors.success;
      case 'medium': return colors.warning;
      case 'hard': return colors.error;
      default: return colors.primary;
    }
  };

  const getSuperheroIcon = (superhero: string) => {
    switch (superhero) {
      case 'Captain Compost': return 'leaf';
      case 'Mitti Mitra': return 'heart';
      case 'Green Guardian': return 'shield';
      default: return 'person';
    }
  };

  const startChapter = (chapter: StoryChapter) => {
    if (!chapter.unlocked) return;
    
    setSelectedChapter(chapter);
    setCurrentSceneIndex(0);
    setShowStoryModal(true);
  };

  const nextScene = () => {
    if (selectedChapter && currentSceneIndex < selectedChapter.scenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
    } else {
      // Chapter completed
      completeChapter();
    }
  };

  const completeChapter = () => {
    if (selectedChapter) {
      setEarnedBadges([...earnedBadges, selectedChapter.badge]);
      // Unlock next chapter logic here
      setShowStoryModal(false);
    }
  };

  const renderChapterCard = (chapter: StoryChapter) => (
    <TouchableOpacity
      key={chapter.id}
      style={[
        styles.chapterCard,
        !chapter.unlocked && styles.lockedCard,
        chapter.completed && styles.completedCard,
      ]}
      onPress={() => startChapter(chapter)}
      disabled={!chapter.unlocked}
      activeOpacity={0.8}
    >
      <View style={styles.chapterHeader}>
        <View style={[styles.chapterIcon, { backgroundColor: getDifficultyColor(chapter.difficulty) }]}>
          <Ionicons name={chapter.icon as any} size={24} color={colors.surface} />
        </View>
        <Text style={styles.chapterTitle}>{chapter.title}</Text>
        <View style={styles.statusIcon}>
          {chapter.completed ? (
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
          ) : !chapter.unlocked ? (
            <Ionicons name="lock-closed" size={24} color={colors.text.secondary} />
          ) : (
            <Ionicons name="play-circle" size={24} color={colors.primary} />
          )}
        </View>
      </View>

      <View style={styles.chapterMeta}>
        <Text style={styles.superheroName}>{chapter.superhero}</Text>
        <Text style={styles.chapterDuration}>{chapter.duration}</Text>
      </View>

      <Text style={styles.chapterDescription}>{chapter.description}</Text>

      <View style={styles.conceptBadge}>
        <Text style={styles.conceptText}>{chapter.concept}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderStoryScene = () => {
    if (!selectedChapter) return null;

    const currentScene = selectedChapter.scenes[currentSceneIndex];
    const progress = ((currentSceneIndex + 1) / selectedChapter.scenes.length) * 100;

    return (
      <View style={styles.storyContainer}>
        <View style={styles.storyHeader}>
          <View style={styles.storyHeaderContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setShowStoryModal(false)}
            >
              <Ionicons name="close" size={24} color={colors.surface} />
            </TouchableOpacity>
            <Text style={styles.storyTitle}>{selectedChapter.title}</Text>
            <View style={{ width: 40 }} />
          </View>
          
          <View style={styles.storyProgress}>
            <Text style={styles.progressText}>
              {currentSceneIndex + 1}/{selectedChapter.scenes.length}
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        </View>

        <ScrollView style={styles.sceneContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.characterSection}>
            <View style={styles.characterIcon}>
              <Ionicons 
                name={getSuperheroIcon(selectedChapter.superhero) as any} 
                size={40} 
                color={colors.primary} 
              />
            </View>
            <Text style={styles.characterName}>{selectedChapter.superhero}</Text>
          </View>

          <Text style={styles.sceneContent}>{currentScene.content}</Text>

          {currentScene.type === 'choice' && currentScene.choices && (
            <View style={styles.choicesContainer}>
              {currentScene.choices.map((choice, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.choiceButton}
                  onPress={() => {
                    // Handle choice selection
                    setTimeout(nextScene, 2000);
                  }}
                >
                  <Text style={styles.choiceText}>{choice.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {currentScene.type === 'lesson' && currentScene.lesson && (
            <View style={styles.lessonContainer}>
              <Text style={styles.lessonTitle}>{currentScene.lesson.title}</Text>
              
              <View style={styles.factsContainer}>
                <Text style={styles.sectionTitle}>Amazing Facts</Text>
                {currentScene.lesson.facts.map((fact, index) => (
                  <View key={index} style={styles.factItem}>
                    <View style={styles.factBullet} />
                    <Text style={styles.factText}>{fact}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.tipsContainer}>
                <Text style={[styles.sectionTitle, { color: colors.warning }]}>Super Tips</Text>
                {currentScene.lesson.tips.map((tip, index) => (
                  <View key={index} style={styles.factItem}>
                    <View style={[styles.factBullet, { backgroundColor: colors.warning }]} />
                    <Text style={styles.factText}>{tip}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, currentSceneIndex === 0 && styles.navButtonDisabled]}
            onPress={() => setCurrentSceneIndex(Math.max(0, currentSceneIndex - 1))}
            disabled={currentSceneIndex === 0}
          >
            <Ionicons name="chevron-back" size={20} color={colors.surface} />
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={nextScene}
          >
            <Text style={styles.navButtonText}>
              {currentSceneIndex === selectedChapter.scenes.length - 1 ? 'Complete' : 'Next'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </View>
    );
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
          <Text style={styles.headerTitle}>Soil Superhero Stories</Text>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="trophy" size={24} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.heroSection,
            {
              transform: [{
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              }],
              opacity: animatedValue,
            },
          ]}
        >
          <Text style={styles.heroTitle}>Soil Superhero Adventures</Text>
          <Text style={styles.heroSubtitle}>
            Join amazing superheroes on exciting soil adventures and become a soil protector yourself!
          </Text>
        </Animated.View>

        <View style={styles.chaptersContainer}>
          {storyChapters.map(renderChapterCard)}
        </View>
      </ScrollView>

      <Modal visible={showStoryModal} animationType="slide">
        {renderStoryScene()}
      </Modal>

      {earnedBadges.length > 0 && (
        <View style={styles.badgeNotification}>
          <Ionicons name="trophy" size={20} color={colors.surface} />
          <Text style={styles.badgeText}>New Badge Earned!</Text>
        </View>
      )}
    </View>
  );
};

export default SoilSuperheroStoryScreen;
