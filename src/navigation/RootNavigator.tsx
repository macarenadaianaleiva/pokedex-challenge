import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DetailScreen } from '../screens/DetailScreen';
import { TabNavigator } from './TabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        // 'minimal': solo la flechita en el back button de iOS, sin
        // texto (por defecto mostraba "Tabs", el nombre de la ruta).
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
}
