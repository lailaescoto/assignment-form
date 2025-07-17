import React from 'react';
import { View, TextInput, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MaterialIcons } from '@expo/vector-icons';

export default function EmployeeInfo() {
  const employeeSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required'),
    username: Yup.string()
      .min(4, 'Username too short')
      .required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    department: Yup.string().required('Department is required'),
    address: Yup.string().required('Address is required'),
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Formik
        initialValues={{
          fullName: '',
          username: '',
          email: '',
          phone: '',
          department: '',
          address: '',
        }}
        validationSchema={employeeSchema}
        onSubmit={(values) => {
          console.log('Employee Info Submitted:', values);
          alert('Employee info submitted successfully!');
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
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
            {touched.fullName && errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}

            <View style={styles.inputWrapper}>
              <MaterialIcons name="account-circle" size={20} color="#999" style={styles.icon} />
              <TextInput
                placeholder="Username"
                style={styles.input}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>
            {touched.username && errors.username && <Text style={styles.error}>{errors.username}</Text>}

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
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <View style={styles.inputWrapper}>
              <MaterialIcons name="phone" size={20} color="#999" style={styles.icon} />
              <TextInput
                placeholder="Phone (10 digits)"
                style={styles.input}
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                value={values.phone}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
              />
            </View>
            {touched.phone && errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

            <View style={styles.inputWrapper}>
              <MaterialIcons name="apartment" size={20} color="#999" style={styles.icon} />
              <TextInput
                placeholder="Department"
                style={styles.input}
                onChangeText={handleChange('department')}
                onBlur={handleBlur('department')}
                value={values.department}
                placeholderTextColor="#999"
              />
            </View>
            {touched.department && errors.department && <Text style={styles.error}>{errors.department}</Text>}

            <View style={[styles.inputWrapper, styles.multilineWrapper]}>
              <MaterialIcons name="location-on" size={20} color="#999" style={styles.icon} />
              <TextInput
                placeholder="Address"
                style={[styles.input, styles.multilineInput]}
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                value={values.address}
                multiline
                numberOfLines={3}
                placeholderTextColor="#999"
              />
            </View>
            {touched.address && errors.address && <Text style={styles.error}>{errors.address}</Text>}

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
              activeOpacity={0.8}
            >
              <MaterialIcons name="save" size={24} color="#fff" />
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#f0f4f8',
  },
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
  multilineWrapper: {
    height: 100,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    color: '#333',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
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
