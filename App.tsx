import { NavigationContainer } from '@react-navigation/native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OfflineBanner } from './src/components/OfflineBanner';
import { RootNavigator } from './src/navigation/RootNavigator';
import { asyncStoragePersister, queryClient } from './src/lib/queryClient';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* maxAge: Infinity — el default (24hs) descarta TODO el cache
            persistido de una si pasó ese tiempo sin abrir la app,
            incluido el índice de búsqueda pensado para durar offline
            "para siempre" (ver usePokemonIndex). gcTime en queryClient.ts
            ya controla la vejez de cada query individual. */}
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: asyncStoragePersister, maxAge: Infinity }}
        >
          <OfflineBanner />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
          <StatusBar style="auto" />
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
