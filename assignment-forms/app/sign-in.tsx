import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SignIn() {
  const router = useRouter();

  const signInSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password too short').required('Password is required'),
  });

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={signInSchema}
      onSubmit={(values) => {
        console.log('Sign in values:', values);
        router.push('/employee-form');
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
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
              style={styles.input}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
              placeholderTextColor="#999"
            />
          </View>
          {touched.password && errors.password && (
            <Text style={styles.error}>{errors.password}</Text>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSubmit()}
            activeOpacity={0.8}
          >
            <MaterialIcons name="login" size={24} color="#fff" />
            <Text style={styles.buttonText}>Sign In</Text>
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
