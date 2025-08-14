// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.h1}>Home</Text>
      <Text>Welcome — this is the home screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex:1, justifyContent:'center', alignItems:'center' },
  h1: { fontSize:22, fontWeight:'700', marginBottom:8 }
});
