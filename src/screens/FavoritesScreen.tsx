import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { FavoritePokemon } from '../api/types';
import { EmptyState } from '../components/EmptyState';
import { PokemonCard } from '../components/PokemonCard';
import type { RootStackParamList } from '../navigation/types';
import { useFavoritesStore } from '../store/favoritesStore';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// Id que ningún favorito real puede tener: marca el item "fantasma" que
// se agrega cuando la cantidad es impar, para que la última card no se
// estire con flex:1 a lo ancho de las dos columnas.
const SPACER_ID = -1;

// A diferencia de Home, no usa React Query: lee directo del store de
// Zustand (persistido en AsyncStorage) — funciona offline sin depender
// del cache de red.
export function FavoritesScreen() {
  const navigation = useNavigation<Nav>();
  const favoritesMap = useFavoritesStore((s) => s.favorites);
  const hasHydrated = useFavoritesStore((s) => s.hasHydrated);

  const favorites = useMemo(
    () => Object.values(favoritesMap).sort((a, b) => a.id - b.id),
    [favoritesMap]
  );
  // Item fantasma al final si la cantidad es impar (ver comentario en HomeScreen).
  const paddedFavorites = favorites.length % 2 !== 0
    ? [...favorites, { id: SPACER_ID, name: '', image: '', types: [] }]
    : favorites;

  const renderItem = useCallback(
    ({ item }: { item: FavoritePokemon }) => {
      if (item.id === SPACER_ID) {
        return <View style={styles.cardSpacer} />;
      }
      return (
        <PokemonCard
          id={item.id}
          name={item.name}
          image={item.image}
          onPress={() => navigation.navigate('Detail', { name: item.name })}
        >
          <PokemonCard.FavoriteToggle />
          <PokemonCard.Image />
          <PokemonCard.Id />
          <PokemonCard.Name />
        </PokemonCard>
      );
    },
    [navigation]
  );

  if (!hasHydrated) {
    return <SafeAreaView style={styles.container} edges={['top']} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {favorites.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="Todavía no tenés favoritos"
          subtitle="Tocá el corazón en cualquier Pokémon para agregarlo acá."
        />
      ) : (
        <FlatList
          data={paddedFavorites}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 24,
  },
  cardSpacer: {
    flex: 1,
    margin: 6,
  },
});
