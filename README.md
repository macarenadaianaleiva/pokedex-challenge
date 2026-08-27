# Pokédex Challenge

App de Pokédex hecha con Expo/React Native para el challenge técnico de deCampoaCampo. Consume [PokeAPI](https://pokeapi.co/api/v2) con Axios.

## Cómo correrlo

```bash
npm install
npm start        # Metro / Expo Dev Tools — escanear el QR con Expo Go
npm run android  # o npm run ios / npm run web
npm test         # suite de Jest
```

## Checklist de requerimientos

| Requerimiento | Estado | Dónde |
|---|---|---|
| Listado con Infinite Scroll | ✅ | `hooks/usePokemonList.ts` (`useInfiniteQuery`) + `screens/HomeScreen.tsx` |
| Carga progresiva de imágenes | ✅ | `expo-image` con blurhash + transición, `components/PokemonCard/`, `screens/DetailScreen.tsx` |
| Detalle completo (imagen, stats, tipos, habilidades) | ✅ | `screens/DetailScreen.tsx` |
| Filtro en tiempo real por nombre | ✅ | `components/SearchBar.tsx` + índice local en `HomeScreen.tsx` |
| Favoritos: agregar / quitar / listar | ✅ | `store/favoritesStore.ts`, `screens/FavoritesScreen.tsx` |
| Favoritos legibles offline | ✅ | Zustand `persist` → AsyncStorage (no depende de React Query) |
| Persistencia de la última lista cargada | ✅ | `PersistQueryClientProvider` en `App.tsx` |
| Skeletons / loaders | ✅ | `components/PokemonCardSkeleton.tsx`, `ActivityIndicator` |
| Mensajes de error específicos (vacío / sin resultados) | ✅ | `components/EmptyState.tsx`, `components/ErrorState.tsx` |
| Testing (opcional) | ✅ | 26 tests, `npm test` |
| Expo SDK 54 | ✅ | `package.json` |
| Axios | ✅ | `api/client.ts` |
| Compound Pattern | ✅ | `components/PokemonCard/`, `components/Section.tsx` |
| React Navigation | ⚠️ v7, no v6 | ver "Decisiones" abajo |

## Stack

| Área | Librería | Por qué |
|---|---|---|
| Framework | Expo SDK 54 + TypeScript (`strict`, sin `any`) | Pedido en la consigna |
| Navegación | React Navigation **v7** | v6 no tiene soporte garantizado sobre React 19 / New Architecture (default en SDK 54); v7 es la misma API, sucesora directa |
| HTTP | Axios | Pedido en la consigna — instancia única en `api/client.ts` |
| Server state | TanStack React Query v5 | Cache, reintentos, paginación e infraestructura offline |
| Client state | Zustand + `persist` | Favoritos: es decisión del usuario, no una respuesta de red |
| Imágenes | expo-image | Placeholder + transición + cache a disco |

## Estructura

```
src/
  api/          axios client, fetchers y tipos de PokeAPI
  hooks/        usePokemonList, usePokemonDetail, usePokemonIndex, useFavoriteToggle, useDebouncedValue
  store/        favoritesStore (zustand + persist)
  lib/          queryClient + persister offline
  components/   PokemonCard/ y Section (compound), + piezas chicas
  screens/      HomeScreen, FavoritesScreen, DetailScreen
  navigation/   RootNavigator (stack) + TabNavigator (tabs)
  utils/        helpers puros (formateo, colores, ids/urls)
```

## Decisiones de arquitectura

**Sin N+1 en el listado.** PokeAPI no da imagen en `/pokemon` (solo `name`+`url`). En vez de pedir el detalle de cada card, `utils/pokemon.ts` deriva el id desde la propia URL y reconstruye el sprite sin red extra. Costo: la card no muestra el tipo (eso vive solo en el detalle).

**Buscador 100% local.** `usePokemonIndex` trae una vez el listado completo de nombres (liviano, sin sprites/stats) y el filtro corre en memoria — sin pegarle a la red por letra. Se activa recién con la primera búsqueda, no al abrir Home.

**Favoritos con snapshot propio.** `favoritesStore` no guarda solo el id — guarda `{id, name, image, types}` para poder pintar Favoritos 100% offline sin depender del cache de red. Al agregar desde la lista (donde no hay tipos, ver arriba), `useFavoriteToggle` pide el detalle una vez bajo demanda; al quitar usa `removeFavorite` (idempotente) y no `toggleFavorite`, para no arriesgar una corrupción de datos si el usuario toca dos veces rápido.

**Offline real, no solo "no crashea".** El cache de React Query se persiste en AsyncStorage con `maxAge: Infinity` (el default de la librería es 24hs y descartaría todo el cache junto, incluido el índice de búsqueda). Favoritos vive en su propio store persistido, independiente de React Query.

**Compound Pattern** en dos componentes: `PokemonCard` (`.Image`, `.Id`, `.Name`, `.FavoriteToggle`, compartiendo datos por Context) y `Section` (`.Title`, `.Body`, usado en las 4 secciones del detalle).

**404 vs. fallo genérico.** `isNotFoundError`/`retryUnlessNotFound` en `lib/queryClient.ts` distinguen "este Pokémon no existe" (no reintenta, mensaje específico) de un fallo de red real (reintenta, botón de reintentar). Solo aplica al detalle — el listado/índice pegan a un endpoint que siempre existe.

## Testing

`npm test` — 26 tests con `jest-expo` + `@testing-library/react-native`, priorizando lógica de negocio sobre integración de pantallas completas:

- `utils/__tests__/pokemon.test.ts` — funciones puras
- `store/__tests__/favoritesStore.test.ts` — favoritos, incluida la idempotencia de `removeFavorite`
- `lib/__tests__/queryClient.test.ts` — clasificación de errores y política de retry
- `components/PokemonCard/__tests__/PokemonCard.test.tsx` — favoritear desde la lista (fetch bajo demanda, manejo de error)
- `components/__tests__/EmptyState.test.tsx` — ejemplo de test de componente
