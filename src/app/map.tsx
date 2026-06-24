import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  TouchableOpacity, FlatList, SafeAreaView,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { placesAPI, historyAPI } from '../services/api';
import { Place, PlaceCategory, CATEGORY_CONFIG, TANZANIA_REGION } from '../types/index';

export default function MapScreen() {
  const { category, city } = useLocalSearchParams<{ category: PlaceCategory; city: string }>();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const config = CATEGORY_CONFIG[category];

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Place | null>(null);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    fetchPlaces();
  }, [category, city]);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await placesAPI.getByCategory(category, city);
      setPlaces(res.data);
      if (res.data.length > 0) {
        // Fit map to show all markers
        setTimeout(() => {
          mapRef.current?.fitToCoordinates(
            res.data.map((p: Place) => ({ latitude: p.latitude, longitude: p.longitude })),
            { edgePadding: { top: 60, right: 40, bottom: 60, left: 40 }, animated: true },
          );
        }, 500);
      }
    } catch (e) {
      setError('Could not load places. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = async (place: Place) => {
    setSelected(place);
    // Log visit to history
    try {
      await historyAPI.logVisit({
        placeId: place.id,
        placeName: place.name,
        placeCategory: place.category,
        placeCity: place.city,
      });
    } catch {}
  };

  const navigateToDetail = (place: Place) => {
    router.push({ pathname: '/place-detail', params: { placeId: place.id } });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header bar */}
      <View style={[styles.header, { backgroundColor: config.color }]}>
        <Ionicons name={config.icon as any} size={20} color="#fff" />
        <Text style={styles.headerTitle}>{config.label} in {city}</Text>
        <TouchableOpacity onPress={() => setShowList(!showList)} style={styles.toggleBtn}>
          <Ionicons name={showList ? 'map-outline' : 'list-outline'} size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={config.color} />
          <Text style={styles.loadingText}>Loading {config.label}...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="wifi-outline" size={48} color="#ccc" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchPlaces}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : !showList ? (
        // Map view
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={TANZANIA_REGION}
            showsUserLocation
            showsMyLocationButton
          >
            {places.map((place) => (
              <Marker
                key={place.id}
                coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                pinColor={config.color}
                onPress={() => handleMarkerPress(place)}
              >
                <Callout onPress={() => navigateToDetail(place)}>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>{place.name}</Text>
                    <Text style={styles.calloutRating}>⭐ {place.rating.toFixed(1)}</Text>
                    <Text style={styles.calloutAddress}>{place.address}</Text>
                    <Text style={[styles.calloutTap, { color: config.color }]}>
                      Tap for details →
                    </Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>

          {/* Count badge */}
          <View style={[styles.badge, { backgroundColor: config.color }]}>
            <Text style={styles.badgeText}>{places.length} places</Text>
          </View>
        </View>
      ) : (
        // List view
        <FlatList
          data={places}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => { handleMarkerPress(item); navigateToDetail(item); }}
            >
              <View style={[styles.listIcon, { backgroundColor: config.color + '15' }]}>
                <Ionicons name={config.icon as any} size={24} color={config.color} />
              </View>
              <View style={styles.listContent}>
                <Text style={styles.listName}>{item.name}</Text>
                <Text style={styles.listAddress}>{item.address}</Text>
                <View style={styles.listMeta}>
                  <Text style={styles.listRating}>⭐ {item.rating.toFixed(1)}</Text>
                  <Text style={styles.listCity}>{item.city}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Ionicons name="search-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No {config.label.toLowerCase()} found in {city}</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, gap: 10,
  },
  headerTitle: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '600' },
  toggleBtn: { padding: 4 },
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  badge: {
    position: 'absolute', bottom: 24, left: 24,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  callout: { minWidth: 200, padding: 4 },
  calloutTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  calloutRating: { fontSize: 13, color: '#555', marginTop: 2 },
  calloutAddress: { fontSize: 12, color: '#888', marginTop: 2 },
  calloutTap: { fontSize: 12, fontWeight: '600', marginTop: 6 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  loadingText: { color: '#888', marginTop: 12, fontSize: 14 },
  errorText: { color: '#C62828', marginTop: 12, fontSize: 14, textAlign: 'center' },
  retryBtn: { marginTop: 16, backgroundColor: '#006400', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  retryText: { color: '#fff', fontWeight: '600' },
  list: { padding: 16 },
  listItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14,
    padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  listIcon: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  listContent: { flex: 1 },
  listName: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  listAddress: { fontSize: 12, color: '#888', marginTop: 2 },
  listMeta: { flexDirection: 'row', gap: 10, marginTop: 4 },
  listRating: { fontSize: 12, color: '#555' },
  listCity: { fontSize: 12, color: '#999' },
  emptyText: { color: '#888', marginTop: 12, fontSize: 14, textAlign: 'center' },
});