import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24, // ventana de "disponible offline"
      retry: 2,
      refetchOnReconnect: true,
    },
  },
});

// Persiste el cache en AsyncStorage: al reabrir la app (con o sin red),
// se hidrata desde disco antes de disparar cualquier fetch.
export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'pokedex-query-cache',
});
