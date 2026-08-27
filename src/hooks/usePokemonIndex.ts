import { useQuery } from '@tanstack/react-query';
import { fetchPokemonIndex } from '../api/pokemon';

// staleTime/gcTime Infinity: el índice no cambia en runtime, sirve para
// filtrar offline una vez cacheado. `enabled` lo controla HomeScreen —
// se activa recién la primera vez que hay texto en el buscador, no en
// cuanto se monta Home.
export function usePokemonIndex(enabled: boolean) {
  return useQuery({
    queryKey: ['pokemonIndex'],
    queryFn: fetchPokemonIndex,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled,
  });
}
