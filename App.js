// App.js (or wherever your root navigator is)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext.js';
import { PostsProvider } from './src/context/PostsContext';
import MainTab from './src/navigation/MainTab';
import AuthStack from './src/navigation/AuthStack'; // your existing auth stack
import { auth } from './src/firebase';

export default function App() {
  const [initializing, setInitializing] = React.useState(true);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, [initializing]);

  if (initializing) return null;

  return (
    <AuthProvider>
      <PostsProvider>
        <NavigationContainer>{user ? <MainTab /> : <AuthStack />}</NavigationContainer>
      </PostsProvider>
    </AuthProvider>
  );
}
