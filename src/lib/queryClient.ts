import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

// 404 real de PokeAPI ("no existe"). Compartido entre acá (retry) y
// DetailScreen (mensaje de error) para no reimplementarlo dos veces.
export function isNotFoundError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 404;
}

// Retry para queries de un solo recurso (ver usePokemonDetail): un 404
// ahí no es transitorio, reintentarlo no lo arregla. NO es el retry por
// defecto del queryClient porque listado/índice pegan a un endpoint que
// siempre existe — un 404 ahí sería un fallo real de infra, no "no existe".
export function retryUnlessNotFound(failureCount: number, error: unknown): boolean {
  if (isNotFoundError(error)) return false;
  return failureCount < 2;
}

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
