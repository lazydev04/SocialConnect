import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';

import {useApp} from '../../context/PostContext';
import {useAuth} from '../../context/AuthContext';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import {colors, spacing, typography, borderRadius} from '../../constants/theme';

const CreatePostScreen = ({navigation}) => {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const {createPost} = useApp();
  const {userProfile} = useAuth();

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.error) {
        return;
      }

      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0]);
      }
    });
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const handleCreatePost = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content for your post');
      return;
    }

    setLoading(true);
    try {
      const result = await createPost(
        content.trim(),
        selectedImage?.uri || null
      );

      if (result.success) {
        Alert.alert('Success', 'Post created successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          
          {/* User Info */}
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userProfile?.name?.charAt(0)?.toUpperCase() || 'A'}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                {userProfile?.name || 'Anonymous'}
              </Text>
              <Text style={styles.postingAs}>Posting as public</Text>
            </View>
          </View>

          {/* Content Input */}
          <CustomTextInput
            placeholder="What's on your mind?"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={6}
            style={styles.contentInput}
          />

          {/* Selected Image */}
          {selectedImage && (
            <View style={styles.imageContainer}>
              <Image
                source={{uri: selectedImage.uri}}
                style={styles.selectedImage}
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={removeImage}>
                <Icon name="x" size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
          )}

          {/* Media Options */}
          <View style={styles.mediaOptions}>
            <TouchableOpacity
              style={styles.mediaButton}
              onPress={selectImage}>
              <Icon name="image" size={24} color={colors.primary} />
              <Text style={styles.mediaButtonText}>Add Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <CustomButton
              title="Cancel"
              variant="outline"
              size="medium"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            />
            <CustomButton
              title="Post"
              size="medium"
              onPress={handleCreatePost}
              disabled={loading || !content.trim()}
              style={styles.postButton}>
              {loading && <LoadingSpinner size="small" color={colors.white} />}
            </CustomButton>
          </View>
        </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  postingAs: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  contentInput: {
    marginBottom: spacing.lg,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
  },
  removeImageButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaOptions: {
    flexDirection: 'row',
    marginBottom: spacing.xxl,
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },
  mediaButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
    marginLeft: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  cancelButton: {
    flex: 1,
    marginRight: spacing.md,
  },
  postButton: {
    flex: 1,
  },
});

export default CreatePostScreen;