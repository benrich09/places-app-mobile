import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/index';
import { PlaceCategory, CATEGORY_CONFIG, TANZANIA_CITIES } from '../../types/index';

const categories: PlaceCategory[] = ['hotel', 'gym', 'hospital', 'restaurant', 'mall'];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedCity, setSelectedCity] = useState('Dar es Salaam');

  const handleCategory = (category: PlaceCategory) => {
    router.push({ pathname: '/map', params: { category, city: selectedCity } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome banner */}
        <View style={styles.banner}>
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.name}>{user?.name || 'Explorer'} 👋</Text>
          <Text style={styles.bannerSub}>Discover places across Tanzania</Text>
        </View>

        {/* City selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select City</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cityRow}>
            {TANZANIA_CITIES.map((city) => (
              <TouchableOpacity
                key={city}
                style={[styles.cityChip, selectedCity === city && styles.cityChipActive]}
                onPress={() => setSelectedCity(city)}
              >
                <Text style={[styles.cityChipText, selectedCity === city && styles.cityChipTextActive]}>
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Category cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore by Category</Text>
          <View style={styles.grid}>
            {categories.map((cat) => {
              const config = CATEGORY_CONFIG[cat];
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.card, { borderTopColor: config.color }]}
                  onPress={() => handleCategory(cat)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.iconCircle, { backgroundColor: config.color + '15' }]}>
                    <Ionicons name={config.icon as any} size={32} color={config.color} />
                  </View>
                  <Text style={[styles.cardLabel, { color: config.color }]}>{config.label}</Text>
                  <Text style={styles.cardSub}>in {selectedCity}</Text>
                  <View style={styles.cardArrow}>
                    <Ionicons name="arrow-forward" size={16} color={config.color} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Info strip */}
        <View style={styles.infoStrip}>
          <Ionicons name="location-outline" size={16} color="#006400" />
          <Text style={styles.infoText}>
            Covering Dar es Salaam · Arusha · Zanzibar and more
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  banner: {
    backgroundColor: '#006400',
    padding: 24,
    paddingBottom: 32,
  },
  welcome: { color: 'rgba(255,255,255,0.8)', fontSize: 15 },
  name: { color: '#fff', fontSize: 24, fontWeight: '700', marginTop: 2 },
  bannerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 },
  section: { padding: 20, paddingBottom: 0 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  cityRow: { flexDirection: 'row' },
  cityChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#fff', marginRight: 8,
    borderWidth: 1, borderColor: '#E0E0E0',
  },
  cityChipActive: { backgroundColor: '#006400', borderColor: '#006400' },
  cityChipText: { fontSize: 13, color: '#555' },
  cityChipTextActive: { color: '#fff', fontWeight: '600' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    borderTopWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  cardLabel: { fontSize: 15, fontWeight: '700' },
  cardSub: { fontSize: 11, color: '#999', marginTop: 2 },
  cardArrow: { position: 'absolute', right: 14, top: 14 },
  infoStrip: {
    flexDirection: 'row', alignItems: 'center',
    margin: 20, padding: 14,
    backgroundColor: '#E8F5E9', borderRadius: 12,
    gap: 8,
  },
  infoText: { fontSize: 13, color: '#2E7D32', flex: 1 },
});