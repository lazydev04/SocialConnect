import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useApp} from '../../context/PostContext';
import {useAuth} from '../../context/AuthContext';
import PostCard from '../../components/PostCard';
import CommentCard from '../../components/CommentCard';
import CommentInput from '../../components/CommentInput';
import LoadingSpinner from '../../components/LoadingSpinner';
import {colors, spacing, typography} from '../../constants/theme';

const CommentsScreen = ({route}) => {
  const {postId, post} = route.params;
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commenting, setCommenting] = useState(false);
  
  const {fetchComments, addComment} = useApp();
  const {user} = useAuth();

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      setLoading(true);
      const result = await fetchComments(postId);
      if (result.success) {
        setComments(result.comments);
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (commentText) => {
    if (!commentText.trim()) return;

    setCommenting(true);
    try {
      const result = await addComment(postId, commentText.trim());
      if (result.success) {
        // Reload comments to show the new comment
        await loadComments();
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add comment');
    } finally {
      setCommenting(false);
    }
  };

  const renderComment = ({item}) => (
    <CommentCard comment={item} />
  );

  const renderHeader = () => (
    <View style={styles.postContainer}>
      <PostCard post={post} onCommentPress={() => {}} />
    </View>
  );

  const renderEmptyComments = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No comments yet</Text>
      <Text style={styles.emptySubtext}>Be the first to share your thoughts!</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        
        <FlatList
          data={comments}
          keyExtractor={item => item.id}
          renderItem={renderComment}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyComments}
          contentContainerStyle={[
            styles.listContent,
            comments.length === 0 && styles.emptyListContent,
          ]}
        />

        <CommentInput
          onSubmit={handleAddComment}
          loading={commenting}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContainer: {
    marginBottom: spacing.md,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default CommentsScreen;