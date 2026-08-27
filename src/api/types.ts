// Modela solo los campos de PokeAPI que la app consume, no la respuesta
// completa. https://pokeapi.co/docs/v2

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonTypeSlot {
  slot: number;
  type: { name: string; url: string };
}

export interface PokemonAbilitySlot {
  ability: { name: string; url: string };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonStatSlot {
  base_stat: number;
  effort: number;
  stat: { name: string; url: string };
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number; // decimetros
  weight: number; // hectogramos
  base_experience: number | null;
  sprites: {
    front_default: string | null;
    other?: {
      'official-artwork'?: { front_default: string | null };
    };
  };
  types: PokemonTypeSlot[];
  abilities: PokemonAbilitySlot[];
  stats: PokemonStatSlot[];
}

/** Snapshot que se persiste en Favoritos: alcanza para renderizar sin red. */
export interface FavoritePokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}
