import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { FavoritePokemon } from '../api/types';

interface FavoritesState {
  favorites: Record<number, FavoritePokemon>;
  /** true hasta que zustand termina de leer AsyncStorage al arrancar */
  hasHydrated: boolean;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (pokemon: FavoritePokemon) => void;
  removeFavorite: (id: number) => void;
  setHasHydrated: (value: boolean) => void;
}

// Separado de React Query a propósito: favoritos es "client state" (una
// decisión del usuario), no una respuesta de red cacheada. Se guarda un
// snapshot propio (no solo el id) para que Favoritos pinte 100% offline.
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: {},
      hasHydrated: false,
      isFavorite: (id) => Boolean(get().favorites[id]),
      toggleFavorite: (pokemon) =>
        set((state) => {
          const next = { ...state.favorites };
          if (next[pokemon.id]) {
            delete next[pokemon.id];
          } else {
            next[pokemon.id] = pokemon;
          }
          return { favorites: next };
        }),
      removeFavorite: (id) =>
        set((state) => {
          const next = { ...state.favorites };
          delete next[id];
          return { favorites: next };
        }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'pokedex-favorites',
      storage: createJSONStorage(() => AsyncStorage),
      // Si falla la lectura de AsyncStorage, zustand llama esto con
      // `state` undefined; se marca hidratado igual para que
      // FavoritesScreen no quede esperando para siempre.
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        } else {
          useFavoritesStore.getState().setHasHydrated(true);
        }
      },
    }
  )
);
