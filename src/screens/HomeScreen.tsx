import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { PokemonCard } from '../components/PokemonCard';
import { PokemonCardSkeleton } from '../components/PokemonCardSkeleton';
import { usePokemonList } from '../hooks/usePokemonList';
import type { RootStackParamList } from '../navigation/types';
import { getArtworkForListItem } from '../utils/pokemon';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface Row {
  id: number;
  name: string;
  image: string;
}

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const list = usePokemonList();

  const rows: Row[] = useMemo(
    () =>
      (list.data?.pages.flatMap((page) => page.results) ?? []).map((item) => {
        const { id, image } = getArtworkForListItem(item);
        return { id, name: item.name, image };
      }),
    [list.data]
  );

  const goToDetail = useCallback(
    (row: Row) => navigation.navigate('Detail', { id: row.id, name: row.name }),
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: Row }) => (
      <PokemonCard
        id={item.id}
        name={item.name}
        image={item.image}
        onPress={() => goToDetail(item)}
      >
        <PokemonCard.Image />
        <PokemonCard.Id />
        <PokemonCard.Name />
      </PokemonCard>
    ),
    [goToDetail]
  );

  const handleEndReached = useCallback(() => {
    if (list.hasNextPage && !list.isFetchingNextPage) {
      list.fetchNextPage();
    }
  }, [list.hasNextPage, list.isFetchingNextPage, list.fetchNextPage]);

  const renderContent = () => {
    if (list.isLoading) {
      return (
        <View style={styles.skeletonGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <PokemonCardSkeleton key={i} />
          ))}
        </View>
      );
    }
    if (list.isError) {
      return (
        <ErrorState
          message="No se pudo cargar la lista de Pokémon. Revisá tu conexión."
          onRetry={() => list.refetch()}
        />
      );
    }
    if (rows.length === 0) {
      return (
        <EmptyState icon="alert-circle-outline" title="La lista está vacía." />
      );
    }

    return (
      <FlatList
        data={rows}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        onEndReachedThreshold={0.5}
        onEndReached={handleEndReached}
        ListFooterComponent={
          list.isFetchingNextPage ? (
            <ActivityIndicator style={styles.footerLoader} />
          ) : null
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderContent()}
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
  footerLoader: {
    marginVertical: 20,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
});
