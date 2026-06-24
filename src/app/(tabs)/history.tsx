import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { historyAPI } from '../../services/api';
import { HistoryItem, CATEGORY_CONFIG } from '../../types/index';

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await historyAPI.getHistory();
      setHistory(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchHistory(); }, []));

  const handleClear = () => {
    Alert.alert('Clear History', 'Remove all visit history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear', style: 'destructive',
        onPress: async () => {
          await historyAPI.clearHistory();
          setHistory([]);
        },
      },
    ]);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-TZ', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#006400" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {history.length > 0 && (
        <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
          <Ionicons name="trash-outline" size={16} color="#C62828" />
          <Text style={styles.clearText}>Clear all</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const config = CATEGORY_CONFIG[item.placeCategory as keyof typeof CATEGORY_CONFIG];
          return (
            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push({ pathname: '/place-detail', params: { placeId: item.placeId } })}
            >
              <View style={[styles.icon, { backgroundColor: (config?.color || '#006400') + '15' }]}>
                <Ionicons name={(config?.icon || 'location-outline') as any} size={22} color={config?.color || '#006400'} />
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemName}>{item.placeName}</Text>
                <Text style={styles.itemMeta}>{config?.label || item.placeCategory} · {item.placeCity}</Text>
                <Text style={styles.itemDate}>{formatDate(item.visitedAt)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="time-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No history yet</Text>
            <Text style={styles.emptyText}>Places you view will appear here</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  clearBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-end', margin: 16, marginBottom: 4,
    padding: 8,
  },
  clearText: { color: '#C62828', fontSize: 13, fontWeight: '600' },
  list: { padding: 16, paddingTop: 4 },
  item: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14,
    padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  icon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  itemContent: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  itemMeta: { fontSize: 12, color: '#888', marginTop: 2 },
  itemDate: { fontSize: 11, color: '#bbb', marginTop: 2 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#999', marginTop: 16 },
  emptyText: { fontSize: 14, color: '#bbb', marginTop: 6 },
});