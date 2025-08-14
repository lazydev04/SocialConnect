// src/components/PostItem.js
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import { PostsContext } from '../context/PostsContext';
import { AuthContext } from '../context/AuthContext.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PostItem({ post, navigation }) {
  const { toggleLike, checkIfLiked } = useContext(PostsContext);
  const { user } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (user) {
        const liked = await checkIfLiked(post.id);
        if (mounted) setIsLiked(liked);
      }
    })();
    return () => (mounted = false);
  }, [post.id, user]);

  const onToggleLike = async () => {
    setIsLiked((v) => !v); // optimistic
    await toggleLike(post.id, isLiked);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('ProfileView', { userId: post.userId })}>
        <Text style={styles.userText}>{post.userName || post.userId}</Text>
      </TouchableOpacity>

      <Text style={styles.text}>{post.text}</Text>

      {post.imageURL ? <Image source={{ uri: post.imageURL }} style={styles.image} /> : null}

      <View style={styles.row}>
        <TouchableOpacity style={styles.iconRow} onPress={onToggleLike}>
          <Icon name={isLiked ? 'heart' : 'heart-outline'} size={20} />
          <Text style={styles.metaText}>{post.likesCount || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconRow} onPress={() => navigation.navigate('Comments', { postId: post.id })}>
          <Icon name="comment-outline" size={20} />
          <Text style={styles.metaText}>Comments</Text>
        </TouchableOpacity>

        <Text style={styles.time}>{post.createdAt ? dayjs(post.createdAt.toDate ? post.createdAt.toDate() : post.createdAt).fromNow() : ''}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, borderBottomWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
  userText: { fontWeight: '700', marginBottom: 6 },
  text: { fontSize: 15, marginBottom: 8 },
  image: { width: '100%', height: 220, borderRadius: 8, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { marginLeft: 6 },
  time: { color: '#666', fontSize: 12 },
});
