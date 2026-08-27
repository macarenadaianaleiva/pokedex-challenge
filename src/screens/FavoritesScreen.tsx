import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// TODO: implementar seccion de favoritos (store persistido + listado)
export function FavoritesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text>Favoritos (próximamente)</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
