import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function Landing() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <MaterialIcons name="account-circle" size={100} color="#4A90E2" />
      <Text style={styles.title}>Welcome to the App!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/sign-in')}
        activeOpacity={0.8}
      >
        <MaterialIcons name="login" size={24} color="#fff" />
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.signUpButton]}
        onPress={() => router.push('/sign-up')}
        activeOpacity={0.8}
      >
        <MaterialIcons name="person-add" size={24} color="#4A90E2" />
        <Text style={[styles.buttonText, styles.signUpText]}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 28,
    marginVertical: 40,
    fontWeight: '600',
    color: '#333',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 10,
    minWidth: '60%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
  signUpButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 12,
    fontWeight: '600',
  },
  signUpText: {
    color: '#4A90E2',
  },
});
