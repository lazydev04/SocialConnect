// src/navigation/AuthStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{title:'Create account'}} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{title:'Reset password'}} />
    </Stack.Navigator>
  );
}
