import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

import {useApp} from '../../context/PostContext';
import {useAuth} from '../../context/AuthContext';
import PostCard from '../../components/PostCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import {colors, spacing, typography} from '../../constants/theme';

const HomeScreen = ({navigation}) => {
  const {posts, loading, refreshing, refreshPosts} = useApp();
  const {userProfile} = useAuth();

  useEffect(() => {
    // Setup any initial data loading if needed
  }, []);

  const renderPost = ({item}) => (
    <PostCard
      post={item}
      onCommentPress={() =>
        navigation.navigate('Comments', {postId: item.id, post: item})
      }
    />
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="message-circle" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No posts yet</Text>
      <Text style={styles.emptySubtitle}>
        Be the first to share something with the community!
      </Text>
      <TouchableOpacity
        style={styles.createFirstPostButton}
        onPress={() => navigation.navigate('CreatePost')}>
        <Text style={styles.createFirstPostText}>Create Your First Post</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>SocialConnect</Text>
      <TouchableOpacity
        style={styles.createPostButton}
        onPress={() => navigation.navigate('CreatePost')}>
        <Icon name="edit-3" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  if (loading && posts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshPosts}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          posts.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmptyComponent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  createPostButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.md,
    marginBottom: spacing.xxl,
  },
  createFirstPostButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 25,
  },
  createFirstPostText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.white,
  },
});

export default HomeScreen;