import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { fetchPokemonDetail } from '../api/pokemon';
import type { FavoritePokemon } from '../api/types';
import { queryClient } from '../lib/queryClient';
import { useFavoritesStore } from '../store/favoritesStore';
import { getBestArtwork } from '../utils/pokemon';

interface CardSnapshot {
  id: number;
  name: string;
  image: string;
}

export function useFavoriteToggle(pokemon: CardSnapshot) {
  const isFavorite = useFavoritesStore((s) => s.isFavorite(pokemon.id));
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);
  const addFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const [pending, setPending] = useState(false);

  const toggle = useCallback(async () => {
    // removeFavorite (no toggleFavorite) porque es idempotente: quitar
    // con toggleFavorite y un doble-tap rápido podía re-agregar el
    // favorito con datos a medias (types: [], imagen chica).
    if (isFavorite) {
      removeFavorite(pokemon.id);
      return;
    }

    // La card de listado no trae tipos (evita N+1), así que hace falta
    // el detalle. Se pide bajo demanda y queda cacheado en React Query.
    setPending(true);
    try {
      const detail = await queryClient.fetchQuery({
        queryKey: ['pokemonDetail', pokemon.name],
        queryFn: () => fetchPokemonDetail(pokemon.name),
        networkMode: 'always',
      });
      const favorite: FavoritePokemon = {
        id: detail.id,
        name: detail.name,
        image: getBestArtwork(detail) || pokemon.image,
        types: detail.types.map((t) => t.type.name),
      };
      addFavorite(favorite);
    } catch {
      Alert.alert(
        'No se pudo agregar a favoritos',
        'Revisá tu conexión e intentá de nuevo.'
      );
    } finally {
      setPending(false);
    }
  }, [isFavorite, pokemon.id, pokemon.name, pokemon.image, removeFavorite, addFavorite]);

  return { isFavorite, pending, toggle };
}
