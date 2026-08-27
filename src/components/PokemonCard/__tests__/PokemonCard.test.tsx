import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import type { PokemonDetail } from '../../../api/types';
import { fetchPokemonDetail } from '../../../api/pokemon';
import { queryClient } from '../../../lib/queryClient';
import { useFavoritesStore } from '../../../store/favoritesStore';
import { PokemonCard } from '../PokemonCard';

jest.mock('../../../api/pokemon');
const mockedFetchDetail = fetchPokemonDetail as jest.MockedFunction<
  typeof fetchPokemonDetail
>;

const pikachuDetail: PokemonDetail = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  base_experience: 112,
  sprites: {
    front_default: 'https://example.com/sprite.png',
    other: {
      'official-artwork': { front_default: 'https://example.com/artwork.png' },
    },
  },
  types: [{ slot: 1, type: { name: 'electric', url: '' } }],
  abilities: [],
  stats: [],
};

function renderFavoriteToggle() {
  render(
    <PokemonCard id={25} name="pikachu" image="https://example.com/list.png">
      <PokemonCard.FavoriteToggle />
    </PokemonCard>
  );
}

beforeAll(() => {
  // retry:false para que el test de error no espere el backoff real.
  queryClient.setDefaultOptions({ queries: { retry: false, gcTime: 0 } });
});

beforeEach(() => {
  useFavoritesStore.setState({ favorites: {} });
  queryClient.clear();
  mockedFetchDetail.mockReset();
});

describe('PokemonCard.FavoriteToggle', () => {
  it('al agregar desde la lista, pide el detalle UNA vez y guarda los tipos reales', async () => {
    mockedFetchDetail.mockResolvedValue(pikachuDetail);

    renderFavoriteToggle();
    fireEvent.press(screen.getByLabelText('Agregar a favoritos'));

    await waitFor(() => {
      expect(useFavoritesStore.getState().isFavorite(25)).toBe(true);
    });

    expect(mockedFetchDetail).toHaveBeenCalledTimes(1);
    expect(mockedFetchDetail).toHaveBeenCalledWith('pikachu');
    expect(useFavoritesStore.getState().favorites[25].types).toEqual([
      'electric',
    ]);
    expect(useFavoritesStore.getState().favorites[25].image).toBe(
      'https://example.com/artwork.png'
    );
  });

  it('al quitar un favorito existente, NO pide el detalle (no hace falta red)', () => {
    useFavoritesStore.getState().toggleFavorite({
      id: 25,
      name: 'pikachu',
      image: 'https://example.com/list.png',
      types: ['electric'],
    });

    renderFavoriteToggle();
    fireEvent.press(screen.getByLabelText('Quitar de favoritos'));

    expect(useFavoritesStore.getState().isFavorite(25)).toBe(false);
    expect(mockedFetchDetail).not.toHaveBeenCalled();
  });

  it('si falla la red al favoritear, avisa con un Alert y no agrega un favorito a medias', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    mockedFetchDetail.mockRejectedValue(new Error('Network Error'));

    renderFavoriteToggle();
    fireEvent.press(screen.getByLabelText('Agregar a favoritos'));

    await waitFor(() => expect(mockedFetchDetail).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(alertSpy).toHaveBeenCalledTimes(1));
    alertSpy.mockRestore();

    expect(useFavoritesStore.getState().isFavorite(25)).toBe(false);
    expect(useFavoritesStore.getState().favorites[25]).toBeUndefined();
  });
});
