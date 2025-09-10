import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LoadingSpinner from './LoadingSpinner';
import {colors, spacing, typography} from '../styles/globalStyles';

const LoadingScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <LoadingSpinner size="large" />
        <Text style={styles.text}>Loading...</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.lg,
    fontWeight: typography.fontWeight.medium,
  },
});

export default LoadingScreen;