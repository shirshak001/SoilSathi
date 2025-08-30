import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface CommunityScreenProps {
  navigation: any;
}

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    location: string;
  };
  content: string;
  images: string[];
  tags: string[];
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  category: 'question' | 'tip' | 'showcase' | 'problem' | 'harvest';
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
}

const { width } = Dimensions.get('window');

const CommunityScreen: React.FC<CommunityScreenProps> = ({ navigation }) => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://via.placeholder.com/40',
        verified: true,
        location: 'New Delhi, India'
      },
      content: 'My tomatoes are finally ready for harvest! This is my first time growing them from seeds. Any tips for storing them properly?',
      images: ['https://via.placeholder.com/300x200'],
      tags: ['tomatoes', 'harvest', 'firsttime'],
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: false,
      category: 'showcase'
    },
    {
      id: '2',
      author: {
        name: 'Mike Chen',
        avatar: 'https://via.placeholder.com/40',
        verified: false,
        location: 'Mumbai, India'
      },
      content: 'Help! My basil leaves are turning yellow. I water them every other day and they get morning sunlight. What could be wrong? 😟',
      images: ['https://via.placeholder.com/300x200'],
      tags: ['basil', 'help', 'yellowing', 'herbs'],
      timestamp: '5 hours ago',
      likes: 12,
      comments: 15,
      shares: 2,
      isLiked: true,
      category: 'problem'
    },
    {
      id: '3',
      author: {
        name: 'Priya Sharma',
        avatar: 'https://via.placeholder.com/40',
        verified: true,
        location: 'Bangalore, India'
      },
      content: 'Pro tip: Coffee grounds make excellent fertilizer for acid-loving plants like blueberries and azaleas! Just sprinkle used grounds around the base.',
      images: [],
      tags: ['tips', 'fertilizer', 'coffee', 'blueberries'],
      timestamp: '1 day ago',
      likes: 89,
      comments: 23,
      shares: 12,
      isLiked: true,
      category: 'tip'
    },
    {
      id: '4',
      author: {
        name: 'Raj Patel',
        avatar: 'https://via.placeholder.com/40',
        verified: false,
        location: 'Pune, India'
      },
      content: 'When is the best time to plant winter vegetables in Zone 9? I\'m planning to grow carrots, lettuce, and radishes.',
      images: [],
      tags: ['winter', 'vegetables', 'planting', 'zone9'],
      timestamp: '2 days ago',
      likes: 34,
      comments: 18,
      shares: 5,
      isLiked: false,
      category: 'question'
    }
  ]);

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newPost, setNewPost] = useState({
    content: '',
    category: 'showcase' as Post['category'],
    tags: '',
    images: [] as string[]
  });

  const categories = [
    { key: 'all', label: 'All Posts', icon: 'apps', color: colors.text.secondary },
    { key: 'question', label: 'Questions', icon: 'help-circle', color: colors.secondary },
    { key: 'tip', label: 'Tips', icon: 'bulb', color: colors.warning },
    { key: 'showcase', label: 'Showcase', icon: 'trophy', color: colors.success },
    { key: 'problem', label: 'Problems', icon: 'alert-circle', color: colors.error },
    { key: 'harvest', label: 'Harvest', icon: 'basket', color: colors.primary }
  ];

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.key === category) || categories[0];
  };

  const formatTimestamp = (timestamp: string) => {
    return timestamp;
  };

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setNewPost({
        ...newPost,
        images: [...newPost.images, result.assets[0].uri]
      });
    }
  };

  const removeImage = (index: number) => {
    setNewPost({
      ...newPost,
      images: newPost.images.filter((_, i) => i !== index)
    });
  };

  const createPost = () => {
    if (!newPost.content.trim()) {
      Alert.alert('Error', 'Please enter some content for your post');
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      author: {
        name: 'You',
        avatar: 'https://via.placeholder.com/40',
        verified: false,
        location: 'Your Location'
      },
      content: newPost.content,
      images: newPost.images,
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      category: newPost.category
    };

    setPosts([post, ...posts]);
    setNewPost({ content: '', category: 'showcase', tags: '', images: [] });
    setShowCreatePost(false);
  };

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const renderPost = (post: Post) => (
    <View key={post.id} style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
        <View style={styles.authorInfo}>
          <View style={styles.authorNameRow}>
            <Text style={styles.authorName}>{post.author.name}</Text>
            {post.author.verified && (
              <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
            )}
          </View>
          <Text style={styles.authorLocation}>{post.author.location}</Text>
          <Text style={styles.timestamp}>{formatTimestamp(post.timestamp)}</Text>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryInfo(post.category).color }]}>
          <Ionicons name={getCategoryInfo(post.category).icon as any} size={12} color={colors.surface} />
        </View>
      </View>

      {/* Post Content */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Post Images */}
      {post.images.length > 0 && (
        <ScrollView horizontal style={styles.imagesContainer} showsHorizontalScrollIndicator={false}>
          {post.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.postImage} />
          ))}
        </ScrollView>
      )}

      {/* Post Tags */}
      {post.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {post.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => toggleLike(post.id)}
        >
          <Ionicons 
            name={post.isLiked ? "heart" : "heart-outline"} 
            size={20} 
            color={post.isLiked ? colors.error : colors.text.secondary} 
          />
          <Text style={[styles.actionText, post.isLiked && { color: colors.error }]}>
            {post.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={20} color={colors.text.secondary} />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={20} color={colors.text.secondary} />
          <Text style={styles.actionText}>{post.shares}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="bookmark-outline" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <LinearGradient
        colors={[colors.primaryLight, colors.primary]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Community</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => setShowCreatePost(true)}
          >
            <Ionicons name="add" size={24} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryButton,
                selectedCategory === category.key && styles.activeCategoryButton
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <Ionicons 
                name={category.icon as any} 
                size={16} 
                color={selectedCategory === category.key ? colors.surface : category.color} 
              />
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category.key && styles.activeCategoryButtonText
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Posts Feed */}
      <ScrollView style={styles.feed} showsVerticalScrollIndicator={false}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map(renderPost)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={64} color={colors.text.hint} />
            <Text style={styles.emptyStateText}>No posts found</Text>
            <Text style={styles.emptyStateSubtext}>
              Be the first to share something in this category!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Create Post Modal */}
      <Modal
        visible={showCreatePost}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreatePost(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.createPostModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Post</Text>
              <TouchableOpacity onPress={() => setShowCreatePost(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.createPostForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <View style={styles.categorySelector}>
                  {categories.slice(1).map((category) => (
                    <TouchableOpacity
                      key={category.key}
                      style={[
                        styles.categorySelectorButton,
                        newPost.category === category.key && styles.activeCategorySelectorButton,
                        { borderColor: category.color }
                      ]}
                      onPress={() => setNewPost({...newPost, category: category.key as any})}
                    >
                      <Ionicons 
                        name={category.icon as any} 
                        size={16} 
                        color={newPost.category === category.key ? category.color : colors.text.secondary} 
                      />
                      <Text style={[
                        styles.categorySelectorText,
                        newPost.category === category.key && { color: category.color }
                      ]}>
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>What's on your mind?</Text>
                <TextInput
                  style={styles.contentInput}
                  value={newPost.content}
                  onChangeText={(text) => setNewPost({...newPost, content: text})}
                  placeholder="Share your gardening experience, ask a question, or give advice..."
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tags (comma separated)</Text>
                <TextInput
                  style={styles.textInput}
                  value={newPost.tags}
                  onChangeText={(text) => setNewPost({...newPost, tags: text})}
                  placeholder="e.g., tomatoes, organic, beginner"
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.imageHeader}>
                  <Text style={styles.inputLabel}>Photos (Optional)</Text>
                  <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                    <Ionicons name="camera" size={16} color={colors.primary} />
                    <Text style={styles.addImageText}>Add Photo</Text>
                  </TouchableOpacity>
                </View>
                {newPost.images.length > 0 && (
                  <ScrollView horizontal style={styles.selectedImages}>
                    {newPost.images.map((image, index) => (
                      <View key={index} style={styles.selectedImageContainer}>
                        <Image source={{ uri: image }} style={styles.selectedImage} />
                        <TouchableOpacity 
                          style={styles.removeImageButton}
                          onPress={() => removeImage(index)}
                        >
                          <Ionicons name="close" size={16} color={colors.surface} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>
            </ScrollView>

            <View style={styles.createPostActions}>
              <TouchableOpacity
                style={styles.cancelPostButton}
                onPress={() => setShowCreatePost(false)}
              >
                <Text style={styles.cancelPostButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.publishButton}
                onPress={createPost}
              >
                <Text style={styles.publishButtonText}>Publish</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.surface,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.md,
  },
  createButton: {
    padding: spacing.sm,
  },
  filterContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
  },
  categoryScroll: {
    paddingHorizontal: spacing.lg,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  activeCategoryButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  activeCategoryButtonText: {
    color: colors.surface,
    fontWeight: fontWeight.medium,
  },
  feed: {
    flex: 1,
  },
  postCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postHeader: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.md,
  },
  authorInfo: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  authorName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  authorLocation: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  timestamp: {
    fontSize: fontSize.xs,
    color: colors.text.hint,
    marginTop: 2,
  },
  categoryBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContent: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  imagesContainer: {
    marginBottom: spacing.md,
  },
  postImage: {
    width: 200,
    height: 150,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  tagText: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
    justifyContent: 'center',
  },
  actionText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  emptyStateText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    color: colors.text.secondary,
    marginTop: spacing.lg,
  },
  emptyStateSubtext: {
    fontSize: fontSize.md,
    color: colors.text.hint,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  createPostModal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '90%',
    height: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  createPostForm: {
    flex: 1,
    padding: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categorySelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing.xs,
  },
  activeCategorySelectorButton: {
    backgroundColor: colors.background,
  },
  categorySelectorText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text.primary,
    backgroundColor: colors.background,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text.primary,
    backgroundColor: colors.background,
    height: 120,
    textAlignVertical: 'top',
  },
  imageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  addImageText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  selectedImages: {
    flexDirection: 'row',
  },
  selectedImageContainer: {
    position: 'relative',
    marginRight: spacing.sm,
  },
  selectedImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.error,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createPostActions: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelPostButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  cancelPostButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.secondary,
  },
  publishButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  publishButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.surface,
  },
});

export default CommunityScreen;
