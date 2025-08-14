// src/screens/SignupScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FormInput from '../components/FormInput';
import { auth, firestore } from '../firebase';

const SignupSchema = Yup.object().shape({
  name: Yup.string().min(2,'Too short').required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6,'Password min 6').required('Required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Required'),
});

export default function SignupScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const handleSignup = async (values) => {
    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(values.email.trim(), values.password);
      const uid = userCredential.user.uid;
      // Create a user doc in Firestore
      await firestore().collection('users').doc(uid).set({
        name: values.name,
        email: values.email.trim(),
        bio: '',
        photoURL: '',
        createdAt: firestore.FieldValue.serverTimestamp ? firestore.FieldValue.serverTimestamp() : new Date(),
      });
      // auth state will change and navigate
    } catch (err) {
      Alert.alert('Signup error', err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      <Formik initialValues={{ name:'', email:'', password:'', confirmPassword:'' }} validationSchema={SignupSchema} onSubmit={handleSignup}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <FormInput label="Full name" placeholder="Your name" onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={values.name} error={touched.name && errors.name} />
            <FormInput label="Email" autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" onChangeText={handleChange('email')} onBlur={handleBlur('email')} value={values.email} error={touched.email && errors.email} />
            <FormInput label="Password" placeholder="********" secureTextEntry onChangeText={handleChange('password')} onBlur={handleBlur('password')} value={values.password} error={touched.password && errors.password} />
            <FormInput label="Confirm Password" placeholder="********" secureTextEntry onChangeText={handleChange('confirmPassword')} onBlur={handleBlur('confirmPassword')} value={values.confirmPassword} error={touched.confirmPassword && errors.confirmPassword} />

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create account'}</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, justifyContent:'center' },
  title: { fontSize:24, fontWeight:'700', marginBottom:20 },
  button: { marginTop:12, backgroundColor:'#007AFF', padding:14, borderRadius:8, alignItems:'center' },
  buttonText: { color:'#fff', fontWeight:'600' }
});
