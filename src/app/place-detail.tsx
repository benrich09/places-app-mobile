import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  ScrollView, Linking, TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import MapView, { Marker } from 'react-native-maps';
import { placesAPI } from '../services/api';
import { Place, CATEGORY_CONFIG } from '../types/index';

export default function PlaceDetailScreen() {
  const { placeId } = useLocalSearchParams<{ placeId: string }>();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    placesAPI.getById(placeId).then((res: { data: React.SetStateAction<Place | null>; }) => {
      setPlace(res.data);
    }).finally(() => setLoading(false));
  }, [placeId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#006400" />
      </View>
    );
  }

  if (!place) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Place not found</Text>
      </View>
    );
  }

  const config = CATEGORY_CONFIG[place.category];

  const openMaps = () => {
    const url = `https://maps.google.com/?q=${place.latitude},${place.longitude}`;
    Linking.openURL(url);
  };

  const callPlace = () => {
    if (place.phone) Linking.openURL(`tel:${place.phone}`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Category color header */}
      <View style={[styles.colorBand, { backgroundColor: config.color }]}>
        <View style={styles.iconCircle}>
          <Ionicons name={config.icon as any} size={40} color={config.color} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{place.name}</Text>
        <View style={[styles.chip, { backgroundColor: config.color + '15' }]}>
          <Text style={[styles.chipText, { color: config.color }]}>{config.label}</Text>
        </View>

        <View style={styles.ratingRow}>
          {[1,2,3,4,5].map(i => (
            <Ionicons
              key={i}
              name={i <= Math.round(place.rating) ? 'star' : 'star-outline'}
              size={18}
              color="#FFA000"
            />
          ))}
          <Text style={styles.ratingNum}>{place.rating.toFixed(1)}</Text>
        </View>

        {/* Info rows */}
        {[
          { icon: 'location-outline', text: place.address },
          { icon: 'business-outline', text: place.city },
          place.phone && { icon: 'call-outline', text: place.phone },
        ].filter(Boolean).map((item: any) => (
          <View key={item.icon} style={styles.infoRow}>
            <Ionicons name={item.icon} size={18} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoText}>{item.text}</Text>
          </View>
        ))}

        {place.description && (
          <View style={styles.descBox}>
            <Text style={styles.descTitle}>About</Text>
            <Text style={styles.descText}>{place.description}</Text>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: config.color }]} onPress={openMaps}>
            <Ionicons name="navigate-outline" size={20} color="#fff" />
            <Text style={styles.actionText}>Directions</Text>
          </TouchableOpacity>
          {place.phone && (
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnOutline, { borderColor: config.color }]} onPress={callPlace}>
              <Ionicons name="call-outline" size={20} color={config.color} />
              <Text style={[styles.actionText, { color: config.color }]}>Call</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Mini map */}
        <Text style={styles.mapTitle}>Location</Text>
        <MapView
          style={styles.miniMap}
          region={{
            latitude: place.latitude,
            longitude: place.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Marker
            coordinate={{ latitude: place.latitude, longitude: place.longitude }}
            pinColor={config.color}
          />
        </MapView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  colorBand: { height: 120, alignItems: 'center', justifyContent: 'flex-end' },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    marginBottom: -36,
  },
  content: { backgroundColor: '#fff', borderRadius: 24, margin: 16, marginTop: 40, padding: 20 },
  name: { fontSize: 22, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  chip: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 12 },
  chipText: { fontSize: 12, fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 16 },
  ratingNum: { fontSize: 14, color: '#555', marginLeft: 6 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  infoIcon: { marginRight: 10 },
  infoText: { fontSize: 14, color: '#555', flex: 1 },
  descBox: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 16, marginTop: 8 },
  descTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 6 },
  descText: { fontSize: 14, color: '#555', lineHeight: 22 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 4 },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, padding: 14, borderRadius: 14,
  },
  actionBtnOutline: { backgroundColor: 'transparent', borderWidth: 2 },
  actionText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  mapTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginTop: 20, marginBottom: 10 },
  miniMap: { height: 200, borderRadius: 12, overflow: 'hidden' },
  errorText: { color: '#C62828', fontSize: 16 },
});