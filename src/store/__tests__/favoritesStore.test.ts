import { useFavoritesStore } from '../favoritesStore';

const pikachu = {
  id: 25,
  name: 'pikachu',
  image: 'https://example.com/pikachu.png',
  types: ['electric'],
};

const bulbasaur = {
  id: 1,
  name: 'bulbasaur',
  image: 'https://example.com/bulbasaur.png',
  types: ['grass', 'poison'],
};

beforeEach(() => {
  useFavoritesStore.setState({ favorites: {} });
});

describe('favoritesStore', () => {
  it('arranca sin favoritos', () => {
    expect(useFavoritesStore.getState().favorites).toEqual({});
  });

  it('toggleFavorite agrega un pokemon que no estaba', () => {
    useFavoritesStore.getState().toggleFavorite(pikachu);
    expect(useFavoritesStore.getState().isFavorite(25)).toBe(true);
    expect(useFavoritesStore.getState().favorites[25]).toEqual(pikachu);
  });

  it('toggleFavorite quita un pokemon que ya estaba (toggle real)', () => {
    useFavoritesStore.getState().toggleFavorite(pikachu);
    useFavoritesStore.getState().toggleFavorite(pikachu);
    expect(useFavoritesStore.getState().isFavorite(25)).toBe(false);
  });

  it('removeFavorite quita por id sin afectar a otros favoritos', () => {
    useFavoritesStore.getState().toggleFavorite(pikachu);
    useFavoritesStore.getState().toggleFavorite(bulbasaur);

    useFavoritesStore.getState().removeFavorite(25);

    expect(useFavoritesStore.getState().isFavorite(25)).toBe(false);
    expect(useFavoritesStore.getState().isFavorite(1)).toBe(true);
  });

  it('isFavorite devuelve false para un id que nunca se agregó', () => {
    expect(useFavoritesStore.getState().isFavorite(999)).toBe(false);
  });

  it('removeFavorite es idempotente: llamarlo varias veces seguidas no re-agrega nada', () => {
    // A diferencia de toggleFavorite, que decide agregar/quitar según
    // el estado actual — llamarlo dos veces seguidas re-agrega.
    useFavoritesStore.getState().toggleFavorite(pikachu);

    useFavoritesStore.getState().removeFavorite(25);
    useFavoritesStore.getState().removeFavorite(25);
    useFavoritesStore.getState().removeFavorite(25);

    expect(useFavoritesStore.getState().isFavorite(25)).toBe(false);
    expect(useFavoritesStore.getState().favorites[25]).toBeUndefined();
  });
});
