import { createContext, useContext } from 'react';

export interface PokemonCardContextValue {
  id: number;
  name: string;
  image: string;
}

export const PokemonCardContext = createContext<PokemonCardContextValue | null>(
  null
);

export function usePokemonCardContext(): PokemonCardContextValue {
  const ctx = useContext(PokemonCardContext);
  if (!ctx) {
    throw new Error(
      'Los subcomponentes PokemonCard.* deben usarse dentro de <PokemonCard>.'
    );
  }
  return ctx;
}
