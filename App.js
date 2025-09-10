import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar, StyleSheet} from 'react-native';
import messaging from '@react-native-firebase/messaging';

import {AuthProvider} from './src/context/AuthContext';
import {AppProvider} from './src/context/PostContext';
import AppNavigator from './src/navigation/AppNavigator';
import {colors} from './src/constants/theme';

const App = () => {
  useEffect(() => {
    // Request notification permissions
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    };

    requestPermission();

    // Handle foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
        />
        <NavigationContainer>
          <AuthProvider>
            <AppProvider>
              <AppNavigator />
            </AppProvider>
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;