import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { PokemonCard } from '../components/PokemonCard';
import { PokemonCardSkeleton } from '../components/PokemonCardSkeleton';
import { SearchBar } from '../components/SearchBar';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { usePokemonIndex } from '../hooks/usePokemonIndex';
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
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim().toLowerCase(), 250);
  const isSearching = debouncedSearch.length > 0;

  const list = usePokemonList();
  const index = usePokemonIndex();

  const listRows: Row[] = useMemo(
    () =>
      (list.data?.pages.flatMap((page) => page.results) ?? []).map((item) => {
        const { id, image } = getArtworkForListItem(item);
        return { id, name: item.name, image };
      }),
    [list.data]
  );

  const searchRows: Row[] = useMemo(() => {
    if (!isSearching || !index.data) return [];
    return index.data.results
      .filter((item) => item.name.includes(debouncedSearch))
      .map((item) => {
        const { id, image } = getArtworkForListItem(item);
        return { id, name: item.name, image };
      });
  }, [isSearching, index.data, debouncedSearch]);

  const rows = isSearching ? searchRows : listRows;

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
    if (!isSearching && list.hasNextPage && !list.isFetchingNextPage) {
      list.fetchNextPage();
    }
  }, [isSearching, list.hasNextPage, list.isFetchingNextPage, list.fetchNextPage]);

  const renderContent = () => {
    if (isSearching && index.isLoading) {
      return <SkeletonGrid />;
    }
    if (isSearching && index.isError) {
      return (
        <ErrorState
          message="No se pudo cargar el índice para buscar. Revisá tu conexión."
          onRetry={() => index.refetch()}
        />
      );
    }
    if (isSearching && rows.length === 0) {
      return (
        <EmptyState
          icon="search-outline"
          title={`Sin resultados para "${search.trim()}"`}
          subtitle="Probá con otro nombre."
        />
      );
    }

    if (!isSearching && list.isLoading) {
      return <SkeletonGrid />;
    }
    if (!isSearching && list.isError) {
      return (
        <ErrorState
          message="No se pudo cargar la lista de Pokémon. Revisá tu conexión."
          onRetry={() => list.refetch()}
        />
      );
    }
    if (!isSearching && rows.length === 0) {
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
          !isSearching && list.isFetchingNextPage ? (
            <ActivityIndicator style={styles.footerLoader} />
          ) : null
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SearchBar value={search} onChangeText={setSearch} />
      {renderContent()}
    </SafeAreaView>
  );
}

function SkeletonGrid() {
  return (
    <View style={styles.skeletonGrid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <PokemonCardSkeleton key={i} />
      ))}
    </View>
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
