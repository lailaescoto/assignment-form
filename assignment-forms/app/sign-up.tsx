import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { api, setToken } from './api';

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const signUpSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password too short').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm your password'),
  });

  return (
    <Formik
      initialValues={{ fullName: '', email: '', password: '', confirmPassword: '' }}
      validationSchema={signUpSchema}
      onSubmit={async (values) => {
        setApiError(null);
        setLoading(true);
        try {
          const { token } = await api.signup({
            fullName: values.fullName,
            email: values.email,
            password: values.password,
          });
          setToken(token);
          router.push('/employee-form');
        } catch (e: any) {
          setApiError(e.message);
        } finally {
          setLoading(false);
        }
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <View style={styles.inputWrapper}>
            <MaterialIcons name="person" size={20} color="#999" style={styles.icon} />
            <TextInput
              placeholder="Full Name"
              style={styles.input}
              onChangeText={handleChange('fullName')}
              onBlur={handleBlur('fullName')}
              value={values.fullName}
              placeholderTextColor="#999"
            />
          </View>
          {touched.fullName && errors.fullName && (
            <Text style={styles.error}>{errors.fullName}</Text>
          )}

          <View style={styles.inputWrapper}>
            <MaterialIcons name="email" size={20} color="#999" style={styles.icon} />
            <TextInput
              placeholder="Email"
              style={styles.input}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </View>
          {touched.email && errors.email && (
            <Text style={styles.error}>{errors.email}</Text>
          )}

          <View style={styles.inputWrapper}>
            <MaterialIcons name="lock" size={20} color="#999" style={styles.icon} />
            <TextInput
              placeholder="Password"
              secureTextEntry
              style={styles.input}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              placeholderTextColor="#999"
            />
          </View>
          {touched.password && errors.password && (
            <Text style={styles.error}>{errors.password}</Text>
          )}

          <View style={styles.inputWrapper}>
            <MaterialIcons name="lock" size={20} color="#999" style={styles.icon} />
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry
              style={styles.input}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
              placeholderTextColor="#999"
            />
          </View>
          {touched.confirmPassword && errors.confirmPassword && (
            <Text style={styles.error}>{errors.confirmPassword}</Text>
          )}
          {apiError && <Text style={styles.apiError}>{apiError}</Text>}

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={() => handleSubmit()}
            activeOpacity={0.8}
            disabled={loading}
          >
            <MaterialIcons name="person-add" size={24} color="#fff" />
            <Text style={styles.buttonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: 'center', backgroundColor: '#f0f4f8' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    color: '#333',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 4,
  },
  apiError: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 12,
    fontWeight: '600',
  },
});
