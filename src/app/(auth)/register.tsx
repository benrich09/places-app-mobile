import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { registerThunk, clearError } from '../../store/authSlice';
import { AppDispatch, RootState } from '../../store';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Name, email and password are required');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    dispatch(registerThunk({ name, email: email.trim().toLowerCase(), password, phone }));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Text style={styles.flag}>🇹🇿</Text>
        <Text style={styles.title}>Tanzania Places</Text>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <Text style={styles.formTitle}>Create Account</Text>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {[
          { label: 'Full Name', value: name, setter: setName, placeholder: 'John Doe', options: {} },
          { label: 'Email', value: email, setter: setEmail, placeholder: 'john@example.com', options: { keyboardType: 'email-address', autoCapitalize: 'none' } },
          { label: 'Phone (optional)', value: phone, setter: setPhone, placeholder: '+255 712 345 678', options: { keyboardType: 'phone-pad' } },
          { label: 'Password', value: password, setter: setPassword, placeholder: 'Min 6 characters', options: { secureTextEntry: true } },
          { label: 'Confirm Password', value: confirm, setter: setConfirm, placeholder: 'Repeat password', options: { secureTextEntry: true } },
        ].map(({ label, value, setter, placeholder, options }) => (
          <View key={label} style={styles.fieldGroup}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor="#999"
              value={value}
              onChangeText={(t) => { setter(t); dispatch(clearError()); }}
              {...options as any}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Account</Text>}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login" style={styles.link}>Sign In</Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#006400' },
  header: { alignItems: 'center', paddingVertical: 28 },
  flag: { fontSize: 48 },
  title: { fontSize: 26, fontWeight: '700', color: '#fff', marginTop: 8 },
  form: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 28 },
  formTitle: { fontSize: 22, fontWeight: '700', color: '#1a1a1a', marginBottom: 20 },
  errorBox: { backgroundColor: '#FFEBEE', borderRadius: 8, padding: 12, marginBottom: 16 },
  errorText: { color: '#C62828', fontSize: 14 },
  fieldGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12,
    padding: 14, fontSize: 16, color: '#1a1a1a', backgroundColor: '#FAFAFA',
  },
  button: { backgroundColor: '#006400', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: 40 },
  footerText: { color: '#666', fontSize: 14 },
  link: { color: '#006400', fontSize: 14, fontWeight: '600' },
});