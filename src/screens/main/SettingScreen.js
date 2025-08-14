// src/screens/SettingsScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebase';

export default function SettingsScreen() {
  const handleLogout = async () => {
    try {
      await auth().signOut();
    } catch (err) {
      Alert.alert('Logout error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex:1, padding:16 },
  title: { fontSize:22, fontWeight:'700', marginBottom:20 },
  button: { marginTop:12, backgroundColor:'#FF3B30', padding:12, borderRadius:8, alignItems:'center' },
  buttonText: { color:'#fff', fontWeight:'600' }
});
