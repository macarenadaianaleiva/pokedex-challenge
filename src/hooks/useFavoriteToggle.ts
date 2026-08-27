import { useCallback, useState } from 'react';
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
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const [pending, setPending] = useState(false);

  const toggle = useCallback(async () => {
    // Quitar favorito no necesita red: ya tenemos todo lo que hace falta.
    if (isFavorite) {
      toggleFavorite({ id: pokemon.id, name: pokemon.name, image: pokemon.image, types: [] });
      return;
    }

    // Agregar SÍ necesita los tipos, y la card de listado no los trae
    // (para no disparar 20 requests por página). Se pide el detalle una
    // única vez, bajo demanda, y queda cacheado en React Query.
    setPending(true);
    try {
      const detail = await queryClient.fetchQuery({
        queryKey: ['pokemonDetail', pokemon.name],
        queryFn: () => fetchPokemonDetail(pokemon.name),
      });
      const favorite: FavoritePokemon = {
        id: detail.id,
        name: detail.name,
        image: getBestArtwork(detail) || pokemon.image,
        types: detail.types.map((t) => t.type.name),
      };
      toggleFavorite(favorite);
    } catch {
      // Fallo de red al favoritear: el usuario puede reintentar tocando
      // la estrella de nuevo.
    } finally {
      setPending(false);
    }
  }, [isFavorite, pokemon.id, pokemon.name, pokemon.image, toggleFavorite]);

  return { isFavorite, pending, toggle };
}
