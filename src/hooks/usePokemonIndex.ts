import { useQuery } from '@tanstack/react-query';
import { fetchPokemonIndex } from '../api/pokemon';

// staleTime/gcTime Infinity: el índice no cambia en runtime, sirve para
// filtrar offline una vez cacheado.
export function usePokemonIndex() {
  return useQuery({
    queryKey: ['pokemonIndex'],
    queryFn: fetchPokemonIndex,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
