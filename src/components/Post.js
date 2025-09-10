import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';

import {useApp} from '../context/PostContext';
import {useAuth} from '../context/AuthContext';
import {colors, spacing, typography, borderRadius, shadows} from '../styles/globalStyles';

const PostCard = ({post, onCommentPress}) => {
  const {toggleLike} = useApp();
  const {user} = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  
  const likeScale = useSharedValue(1);
  
  const isLiked = post.likes?.includes(user?.uid) || false;

  const formatTimeAgo = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return 'Just now';
    
    const now = new Date();
    const postTime = new Date(timestamp.seconds * 1000);
    const diffInMs = now - postTime;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    
    // Animate the like button
    likeScale.value = withSequence(
      withSpring(1.2, {duration: 150}),
      withSpring(1, {duration: 150})
    );

    try {
      const result = await toggleLike(post.id);
      if (!result.success) {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update like status');
    } finally {
      setIsLiking(false);
    }
  };

  const likeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: likeScale.value}],
    };
  });

  return (
    <View style={styles.container}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {post.authorName?.charAt(0)?.toUpperCase() || 'A'}
          </Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{post.authorName || 'Anonymous'}</Text>
          <Text style={styles.timeAgo}>{formatTimeAgo(post.createdAt)}</Text>
        </View>
      </View>

      {/* Post Content */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Post Image */}
      {post.imageUri && (
        <Image source={{uri: post.imageUri}} style={styles.postImage} />
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <Animated.View style={likeAnimatedStyle}>
            <TouchableOpacity
              style={[styles.actionButton, isLiked && styles.likedButton]}
              onPress={handleLike}
              disabled={isLiking}>
              <Icon
                name={isLiked ? 'heart' : 'heart'}
                size={20}
                color={isLiked ? colors.error : colors.textSecondary}
                solid={isLiked}
              />
              <Text
                style={[
                  styles.actionText,
                  isLiked && styles.likedText,
                ]}>
                {post.likesCount || 0}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={onCommentPress}>
            <Icon name="message-circle" size={20} color={colors.textSecondary} />
            <Text style={styles.actionText}>{post.commentsCount || 0}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="share" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    ...shadows.sm,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
  },
  timeAgo: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  postContent: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    lineHeight: typography.lineHeight.md,
    marginBottom: spacing.md,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.md,
  },
  likedButton: {
    // Additional styling for liked state if needed
  },
  actionText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    fontWeight: typography.fontWeight.medium,
  },
  likedText: {
    color: colors.error,
  },
});

export default PostCard;