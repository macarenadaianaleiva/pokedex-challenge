import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Ocurrió un error. Intentá de nuevo.',
  onRetry,
}: Props) {
  const { isOnline } = useNetworkStatus();

  // Con NetInfo conectado al onlineManager de React Query, un pedido
  // hecho mientras no hay red queda "pausado" en vez de fallar — así
  // que "Reintentar" no dispara ningún cambio visible hasta que vuelva
  // la conexión. En vez de un botón que parece no hacer nada, se
  // reemplaza por un mensaje explícito y se saca el botón mientras
  // estemos offline.
  const effectiveMessage = isOnline
    ? message
    : 'Estás sin conexión. Conectate para reintentar.';

  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={40} color="#9AA0A6" />
      <Text style={styles.message}>{effectiveMessage}</Text>
      {isOnline && onRetry && (
        <Pressable style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  message: {
    fontSize: 14,
    color: '#5F6368',
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#4C6EF5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
