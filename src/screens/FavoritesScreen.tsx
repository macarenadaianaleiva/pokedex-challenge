import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { FavoritePokemon } from '../api/types';
import { EmptyState } from '../components/EmptyState';
import { PokemonCard } from '../components/PokemonCard';
import type { RootStackParamList } from '../navigation/types';
import { useFavoritesStore } from '../store/favoritesStore';

type Nav = NativeStackNavigationProp<RootStackParamList>;

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

  const renderItem = useCallback(
    ({ item }: { item: FavoritePokemon }) => (
      <PokemonCard
        id={item.id}
        name={item.name}
        image={item.image}
        onPress={() => navigation.navigate('Detail', { id: item.id, name: item.name })}
      >
        <PokemonCard.FavoriteToggle style={styles.favoriteCorner} />
        <PokemonCard.Image />
        <PokemonCard.Id />
        <PokemonCard.Name />
      </PokemonCard>
    ),
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
          data={favorites}
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
  favoriteCorner: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
});
