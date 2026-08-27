import type { PokemonDetail, PokemonListItem } from '../api/types';

// PokeAPI no da la imagen en el listado (solo name+url); pedir el
// detalle de cada card sería un N+1. La URL trae el id, así que se
// reconstruye el sprite localmente sin red extra.
export function getIdFromUrl(url: string): number {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
}

export function getArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function getArtworkForListItem(item: PokemonListItem): {
  id: number;
  image: string;
} {
  const id = getIdFromUrl(item.url);
  return { id, image: getArtworkUrl(id) };
}

/** Placeholder de expo-image mientras carga el artwork real. */
export const ARTWORK_BLURHASH = 'L5H2EC=PM+yV0g-mq.wG9c010J}I';

export function getBestArtwork(detail: PokemonDetail): string {
  return (
    detail.sprites.other?.['official-artwork']?.front_default ??
    detail.sprites.front_default ??
    getArtworkUrl(detail.id)
  );
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatPokedexId(id: number): string {
  return `#${String(id).padStart(3, '0')}`;
}

/** hectogramos -> kg */
export function formatWeight(hectograms: number): string {
  return `${(hectograms / 10).toFixed(1)} kg`;
}

/** decimetros -> m */
export function formatHeight(decimeters: number): string {
  return `${(decimeters / 10).toFixed(1)} m`;
}

/** Colores oficiales por tipo, usados en badges y como acento del detalle. */
export const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

export function getTypeColor(type: string): string {
  return TYPE_COLORS[type] ?? '#777777';
}

export const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Especial',
  'special-defense': 'Def. Especial',
  speed: 'Velocidad',
};

export const MAX_STAT_VALUE = 255; // tope real de PokeAPI, usado para las barras
