import { Image, type ImageStyle } from 'expo-image';
import { useMemo } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useFavoriteToggle } from '../../hooks/useFavoriteToggle';
import { ARTWORK_BLURHASH, capitalize, formatPokedexId } from '../../utils/pokemon';
import { FavoriteHeartButton } from '../FavoriteHeartButton';
import { PokemonCardContext, usePokemonCardContext } from './PokemonCardContext';

// Compound Pattern: Root comparte id/name/image por Context, y los
// subcomponentes son piezas sueltas que el consumidor arma como quiera.

interface PokemonCardProps {
  id: number;
  name: string;
  image: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

function Root({ id, name, image, onPress, style, children }: PokemonCardProps) {
  const value = useMemo(() => ({ id, name, image }), [id, name, image]);
  return (
    <PokemonCardContext.Provider value={value}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
      >
        {children}
      </Pressable>
    </PokemonCardContext.Provider>
  );
}

function CardImage({ style }: { style?: StyleProp<ImageStyle> }) {
  const { image, name } = usePokemonCardContext();
  return (
    <Image
      source={{ uri: image }}
      style={[styles.image, style]}
      contentFit="contain"
      // Carga progresiva: placeholder borroso + transición al llegar la imagen real.
      placeholder={{ blurhash: ARTWORK_BLURHASH }}
      placeholderContentFit="contain"
      transition={300}
      cachePolicy="memory-disk"
      accessibilityLabel={name}
    />
  );
}

function CardId() {
  const { id } = usePokemonCardContext();
  return <Text style={styles.id}>{formatPokedexId(id)}</Text>;
}

function CardName({ style }: { style?: StyleProp<ViewStyle> }) {
  const { name } = usePokemonCardContext();
  return <Text style={[styles.name, style]}>{capitalize(name)}</Text>;
}

function FavoriteToggle({ style }: { style?: StyleProp<ViewStyle> }) {
  const { id, name, image } = usePokemonCardContext();
  const { isFavorite, pending, toggle } = useFavoriteToggle({ id, name, image });

  return (
    <View style={style}>
      <FavoriteHeartButton isFavorite={isFavorite} pending={pending} onPress={toggle} />
    </View>
  );
}

export const PokemonCard = Object.assign(Root, {
  Image: CardImage,
  Id: CardId,
  Name: CardName,
  FavoriteToggle,
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#F4F5F7',
    borderRadius: 16,
    padding: 12,
    margin: 6,
    minHeight: 170,
  },
  pressed: {
    opacity: 0.7,
  },
  image: {
    width: '100%',
    height: 90,
    alignSelf: 'center',
  },
  id: {
    fontSize: 12,
    color: '#9AA0A6',
    fontWeight: '600',
    marginTop: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 2,
  },
});
