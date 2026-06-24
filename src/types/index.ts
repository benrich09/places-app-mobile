export type PlaceCategory = 'hotel' | 'gym' | 'hospital' | 'restaurant' | 'mall';

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  city: string;
  latitude: number;
  longitude: number;
  address: string;
  phone?: string;
  description?: string;
  imageUrl?: string;
  rating: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

export interface HistoryItem {
  id: string;
  placeId: string;
  placeName: string;
  placeCategory: PlaceCategory;
  placeCity: string;
  visitedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export type RootStackParamList = {
  '(auth)': undefined;
  '(tabs)': undefined;
  'map': { category: PlaceCategory; city?: string };
  'place-detail': { placeId: string };
};

export const CATEGORY_CONFIG: Record<PlaceCategory, { label: string; icon: string; color: string }> = {
  hotel: { label: 'Hotels', icon: 'bed-outline', color: '#1565C0' },
  gym: { label: 'Gyms', icon: 'fitness-outline', color: '#2E7D32' },
  hospital: { label: 'Hospitals', icon: 'medkit-outline', color: '#C62828' },
  restaurant: { label: 'Restaurants', icon: 'restaurant-outline', color: '#E65100' },
  mall: { label: 'Malls', icon: 'storefront-outline', color: '#6A1B9A' },
};

export const TANZANIA_CITIES = ['Dar es Salaam', 'Arusha', 'Zanzibar', 'Mwanza', 'Dodoma'];

export const TANZANIA_REGION = {
  latitude: -6.3690,
  longitude: 34.8888,
  latitudeDelta: 8,
  longitudeDelta: 8,
};