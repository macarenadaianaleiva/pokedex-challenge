// AsyncStorage no tiene módulo nativo en el entorno de Jest (no hay
// dispositivo real). Se reemplaza por el mock en memoria oficial del
// propio paquete para que el store de favoritos (persist middleware) se
// pueda testear sin tocar disco real.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@react-native-community/netinfo', () =>
  require('@react-native-community/netinfo/jest/netinfo-mock')
);
