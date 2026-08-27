import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ErrorState } from '../components/ErrorState';
import { FavoriteHeartButton } from '../components/FavoriteHeartButton';
import { Section } from '../components/Section';
import { StatBar } from '../components/StatBar';
import { TypeBadge } from '../components/TypeBadge';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { isNotFoundError } from '../lib/queryClient';
import type { RootStackParamList } from '../navigation/types';
import { useFavoritesStore } from '../store/favoritesStore';
import {
  ARTWORK_BLURHASH,
  capitalize,
  formatHeight,
  formatPokedexId,
  formatWeight,
  getBestArtwork,
  getTypeColor,
} from '../utils/pokemon';

type DetailRoute = RouteProp<RootStackParamList, 'Detail'>;

export function DetailScreen() {
  const { params } = useRoute<DetailRoute>();
  const { data, isLoading, isError, error, refetch } = usePokemonDetail(
    params.name
  );
  // 404 real ("este Pokémon no existe") vs. cualquier otro fallo (sin
  // conexión, timeout, 500 de PokeAPI): mensajes distintos, y solo el
  // segundo caso ofrece reintentar.
  const isNotFound = isNotFoundError(error);

  const isFavorite = useFavoritesStore((s) =>
    data ? s.isFavorite(data.id) : false
  );
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#4C6EF5" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState
          message={
            isNotFound
              ? 'Este Pokémon no existe.'
              : 'No se pudo cargar este Pokémon. Si estás sin conexión, probá abrirlo cuando ya lo hayas visto una vez online.'
          }
          onRetry={isNotFound ? undefined : () => refetch()}
        />
      </SafeAreaView>
    );
  }

  const accentColor = getTypeColor(data.types[0]?.type.name ?? 'normal');

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.hero, { backgroundColor: `${accentColor}22` }]}>
          <View style={styles.favoriteFloating}>
            <FavoriteHeartButton
              isFavorite={isFavorite}
              size={26}
              onPress={() =>
                toggleFavorite({
                  id: data.id,
                  name: data.name,
                  image: getBestArtwork(data),
                  types: data.types.map((t) => t.type.name),
                })
              }
            />
          </View>
          <Image
            source={{ uri: getBestArtwork(data) }}
            style={styles.heroImage}
            contentFit="contain"
            placeholder={{ blurhash: ARTWORK_BLURHASH }}
            transition={300}
            cachePolicy="memory-disk"
          />
        </View>

        <Text style={styles.pokedexId}>{formatPokedexId(data.id)}</Text>
        <Text style={styles.name}>{capitalize(data.name)}</Text>

        <Section>
          <Section.Title>Tipos</Section.Title>
          <Section.Body>
            <View style={styles.badgeRow}>
              {data.types.map((t) => (
                <TypeBadge key={t.type.name} type={t.type.name} />
              ))}
            </View>
          </Section.Body>
        </Section>

        <Section>
          <Section.Title>Info física</Section.Title>
          <Section.Body>
            <View style={styles.infoRow}>
              <InfoPill label="Altura" value={formatHeight(data.height)} />
              <InfoPill label="Peso" value={formatWeight(data.weight)} />
              <InfoPill
                label="Exp. base"
                value={String(data.base_experience ?? '—')}
              />
            </View>
          </Section.Body>
        </Section>

        <Section>
          <Section.Title>Habilidades</Section.Title>
          <Section.Body>
            <View style={styles.badgeRow}>
              {data.abilities.map((a) => (
                <View key={a.ability.name} style={styles.abilityChip}>
                  <Text style={styles.abilityText}>
                    {capitalize(a.ability.name.replace('-', ' '))}
                    {a.is_hidden ? ' (oculta)' : ''}
                  </Text>
                </View>
              ))}
            </View>
          </Section.Body>
        </Section>

        <Section>
          <Section.Title>Estadísticas</Section.Title>
          <Section.Body>
            {data.stats.map((s) => (
              <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} />
            ))}
          </Section.Body>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoPill}>
      <Text style={styles.infoValue}>{value}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 24,
    position: 'relative',
  },
  favoriteFloating: {
    position: 'absolute',
    top: 8,
    right: 16,
    zIndex: 1,
  },
  heroImage: {
    width: 180,
    height: 180,
  },
  pokedexId: {
    marginTop: 16,
    marginHorizontal: 20,
    fontSize: 13,
    fontWeight: '700',
    color: '#9AA0A6',
  },
  name: {
    marginHorizontal: 20,
    fontSize: 26,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoPill: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F4F5F7',
    borderRadius: 12,
    paddingVertical: 10,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  infoLabel: {
    fontSize: 12,
    color: '#9AA0A6',
    marginTop: 2,
  },
  abilityChip: {
    backgroundColor: '#F4F5F7',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  abilityText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
  },
});
