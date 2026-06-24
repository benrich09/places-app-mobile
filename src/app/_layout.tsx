import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store/index';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="map"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: '#006400' },
            headerTintColor: '#fff',
            headerTitle: 'Map',
          }}
        />
        <Stack.Screen
          name="place-detail"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: '#006400' },
            headerTintColor: '#fff',
            headerTitle: 'Place Details',
          }}
        />
      </Stack>
    </Provider>
  );
}