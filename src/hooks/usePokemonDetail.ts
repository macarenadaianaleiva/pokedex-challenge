import { useQuery } from '@tanstack/react-query';
import { fetchPokemonDetail } from '../api/pokemon';

export function usePokemonDetail(nameOrId: string | number | undefined) {
  return useQuery({
    queryKey: ['pokemonDetail', nameOrId],
    queryFn: () => fetchPokemonDetail(nameOrId as string | number),
    enabled: nameOrId !== undefined,
  });
}
