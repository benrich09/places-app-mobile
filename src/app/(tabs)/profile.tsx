import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { logoutThunk } from '../../store/authSlice';
import { AppDispatch, RootState } from '../../store/index';

export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive',
        onPress: () => dispatch(logoutThunk()),
      },
    ]);
  };

  const menuItems = [
    { icon: 'person-outline', label: 'Name', value: user?.name },
    { icon: 'mail-outline', label: 'Email', value: user?.email },
    { icon: 'call-outline', label: 'Phone', value: user?.phone || 'Not set' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      {/* Info cards */}
      <View style={styles.card}>
        {menuItems.map((item) => (
          <View key={item.icon} style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name={item.icon as any} size={18} color="#006400" />
              <Text style={styles.rowLabel}>{item.label}</Text>
            </View>
            <Text style={styles.rowValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* App info */}
      <View style={[styles.card, { marginTop: 12 }]}>
        {[
          { icon: 'flag-outline', label: 'Country', value: 'Tanzania 🇹🇿' },
          { icon: 'information-circle-outline', label: 'Version', value: '1.0.0' },
        ].map((item) => (
          <View key={item.label} style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name={item.icon as any} size={18} color="#006400" />
              <Text style={styles.rowLabel}>{item.label}</Text>
            </View>
            <Text style={styles.rowValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  avatarSection: { alignItems: 'center', paddingVertical: 32, backgroundColor: '#006400' },
  avatar: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 36, color: '#fff', fontWeight: '700' },
  userName: { fontSize: 20, fontWeight: '700', color: '#fff' },
  userEmail: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  card: {
    backgroundColor: '#fff', margin: 16, marginBottom: 0,
    borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowLabel: { fontSize: 14, color: '#555' },
  rowValue: { fontSize: 14, color: '#1a1a1a', fontWeight: '500' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#C62828', margin: 16, marginTop: 24,
    padding: 16, borderRadius: 14,
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});