import { pokeApi } from './client';
import type { PokemonDetail, PokemonListResponse } from './types';

export const PAGE_SIZE = 20;

export async function fetchPokemonList(
  offset: number
): Promise<PokemonListResponse> {
  const { data } = await pokeApi.get<PokemonListResponse>('/pokemon', {
    params: { limit: PAGE_SIZE, offset },
  });
  return data;
}

export async function fetchPokemonDetail(
  nameOrId: string | number
): Promise<PokemonDetail> {
  const { data } = await pokeApi.get<PokemonDetail>(`/pokemon/${nameOrId}`);
  return data;
}

/**
 * Índice liviano con TODOS los nombres (~1300, solo name+url, sin
 * sprites ni stats): permite filtrar por nombre 100% local, sin pegarle
 * a la red en cada tecla (ver usePokemonIndex).
 */
export async function fetchPokemonIndex(): Promise<PokemonListResponse> {
  const { data } = await pokeApi.get<PokemonListResponse>('/pokemon', {
    params: { limit: 100000, offset: 0 },
  });
  return data;
}
