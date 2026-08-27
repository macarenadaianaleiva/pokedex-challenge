import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

interface Props {
  isFavorite: boolean;
  pending?: boolean;
  onPress: () => void;
  size?: number;
}

export function FavoriteHeartButton({
  isFavorite,
  pending,
  onPress,
  size = 22,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={pending}
      hitSlop={10}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel={
        isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
      }
    >
      {pending ? (
        <ActivityIndicator size="small" color="#E63950" />
      ) : (
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={size}
          color={isFavorite ? '#E63950' : '#9AA0A6'}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
});
