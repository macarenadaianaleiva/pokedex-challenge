import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

// Shimmer con la misma altura de la card real: evita el salto de layout
// cuando llegan los datos.
export function PokemonCardSkeleton() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.image, { opacity }]} />
      <Animated.View style={[styles.line, styles.lineSmall, { opacity }]} />
      <Animated.View style={[styles.line, styles.lineLarge, { opacity }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#F4F5F7',
    borderRadius: 16,
    padding: 12,
    margin: 6,
    minHeight: 170,
  },
  image: {
    width: '100%',
    height: 90,
    borderRadius: 8,
    backgroundColor: '#DADCE0',
  },
  line: {
    height: 10,
    borderRadius: 4,
    backgroundColor: '#DADCE0',
    marginTop: 10,
  },
  lineSmall: { width: '40%' },
  lineLarge: { width: '70%' },
});
