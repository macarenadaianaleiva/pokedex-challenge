import { act, renderHook } from '@testing-library/react-native';
import NetInfo from '@react-native-community/netinfo';
import { useNetworkStatus } from '../useNetworkStatus';

const mockedAddEventListener = NetInfo.addEventListener as jest.Mock;

beforeEach(() => {
  mockedAddEventListener.mockClear();
});

function emit(state: { isConnected: boolean | null; isInternetReachable: boolean | null }) {
  const listener = mockedAddEventListener.mock.calls[0][0];
  act(() => listener(state));
}

describe('useNetworkStatus', () => {
  it('arranca online por defecto', () => {
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.isOnline).toBe(true);
  });

  it('pasa a false cuando NetInfo confirma que no hay conexión', () => {
    const { result } = renderHook(() => useNetworkStatus());
    emit({ isConnected: false, isInternetReachable: false });
    expect(result.current.isOnline).toBe(false);
  });

  it('vuelve a true cuando la conexión se recupera', () => {
    const { result } = renderHook(() => useNetworkStatus());
    emit({ isConnected: false, isInternetReachable: false });
    emit({ isConnected: true, isInternetReachable: true });
    expect(result.current.isOnline).toBe(true);
  });

  it('no marca offline si isInternetReachable todavía no se confirmó (null)', () => {
    const { result } = renderHook(() => useNetworkStatus());
    emit({ isConnected: true, isInternetReachable: null });
    expect(result.current.isOnline).toBe(true);
  });
});
