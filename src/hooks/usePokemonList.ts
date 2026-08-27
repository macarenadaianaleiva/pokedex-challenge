import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPokemonList } from '../api/pokemon';

export function usePokemonList() {
  return useInfiniteQuery({
    queryKey: ['pokemonList'],
    queryFn: ({ pageParam }) => fetchPokemonList(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      // Se evita el global `URL` (no siempre polyfilleado en Hermes/RN).
      const match = lastPage.next.match(/[?&]offset=(\d+)/);
      return match ? Number(match[1]) : undefined;
    },
  });
}
