// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FormInput from '../components/FormInput';
import { auth } from '../firebase';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6,'Password too short').required('Required'),
});

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(values.email.trim(), values.password);
      // onAuthStateChanged in App.js will pick up user
    } catch (err) {
      Alert.alert('Login error', err.message);
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Formik initialValues={{ email: '', password: '' }} validationSchema={LoginSchema} onSubmit={handleLogin}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <FormInput label="Email" autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" onChangeText={handleChange('email')} onBlur={handleBlur('email')} value={values.email} error={touched.email && errors.email} />
            <FormInput label="Password" placeholder="********" secureTextEntry onChangeText={handleChange('password')} onBlur={handleBlur('password')} value={values.password} error={touched.password && errors.password} />
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.link}>Forgot password?</Text>
            </TouchableOpacity>

            <View style={{flexDirection:'row', marginTop:16, justifyContent:'center'}}>
              <Text>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={{color:'#007AFF'}}> Sign up</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, justifyContent:'center' },
  title: { fontSize:28, fontWeight:'700', marginBottom:20 },
  button: { marginTop:12, backgroundColor:'#007AFF', padding:14, borderRadius:8, alignItems:'center' },
  buttonText: { color:'#fff', fontWeight:'600' },
  link: { color:'#007AFF', marginTop:10, textAlign:'center' }
});
