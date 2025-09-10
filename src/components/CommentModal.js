import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, spacing, typography, borderRadius} from '../styles/globalStyles';

const CommentCard = ({comment}) => {
  const formatTimeAgo = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return 'Just now';
    
    const now = new Date();
    const commentTime = new Date(timestamp.seconds * 1000);
    const diffInMs = now - commentTime;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {comment.authorName?.charAt(0)?.toUpperCase() || 'A'}
        </Text>
      </View>
      
      <View style={styles.commentContent}>
        <View style={styles.commentBubble}>
          <Text style={styles.authorName}>
            {comment.authorName || 'Anonymous'}
          </Text>
          <Text style={styles.content}>{comment.content}</Text>
        </View>
        
        <Text style={styles.timeAgo}>{formatTimeAgo(comment.createdAt)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    marginTop: spacing.xs,
  },
  avatarText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  authorName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  content: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    lineHeight: typography.lineHeight.sm,
  },
  timeAgo: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
});

export default CommentCard;