// src/screens/ProfileScreen.js
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { PostsContext } from '../context/PostsContext';
import { firestore } from '../firebase';s
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProfileScreen({ route, navigation }) {
  const { user } = useContext(AuthContext);
  const { posts } = useContext(PostsContext);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const viewingOwnProfile = !route.params?.userId || route.params.userId === user?.uid;
  const userIdToView = viewingOwnProfile ? user?.uid : route.params.userId;

  useEffect(() => {
    if (!userIdToView) return;
    const fetchProfile = async () => {
      try {
        const doc = await firestore().collection('users').doc(userIdToView).get();
        if (doc.exists) {
          setProfile(doc.data());
        } else {
          setProfile({ name: 'Unknown User', email: '' });
        }
      } catch (err) {
        console.warn('Error fetching profile:', err);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [userIdToView]);

  const userPosts = posts.filter((p) => p.userId === userIdToView);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Info */}
      <View style={styles.profileHeader}>
        <Icon name="account-circle" size={100} color="#ccc" />
        <Text style={styles.name}>{profile?.name || 'Unnamed User'}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
        {viewingOwnProfile && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* User Posts */}
      <Text style={styles.sectionTitle}>Posts</Text>
      {userPosts.length === 0 ? (
        <Text style={styles.noPosts}>No posts yet.</Text>
      ) : (
        <FlatList
          data={userPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              {item.text ? <Text style={styles.postText}>{item.text}</Text> : null}
              {item.imageURL ? (
                <Image source={{ uri: item.imageURL }} style={styles.postImage} />
              ) : null}
              <Text style={styles.likes}>❤️ {item.likesCount || 0} likes</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  profileHeader: { alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#ddd' },
  name: { fontSize: 20, fontWeight: 'bold', marginTop: 8 },
  email: { fontSize: 14, color: 'gray', marginBottom: 10 },
  editButton: { backgroundColor: 'blue', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 6 },
  editButtonText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', padding: 15 },
  noPosts: { paddingHorizontal: 15, color: 'gray' },
  postCard: { backgroundColor: '#f9f9f9', padding: 10, marginHorizontal: 15, marginBottom: 10, borderRadius: 8 },
  postText: { fontSize: 15, marginBottom: 8 },
  postImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 8 },
  likes: { fontSize: 13, color: 'gray' },
});
