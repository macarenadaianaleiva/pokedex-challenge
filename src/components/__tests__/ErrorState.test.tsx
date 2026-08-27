import { act, fireEvent, render, screen } from '@testing-library/react-native';
import NetInfo from '@react-native-community/netinfo';
import { ErrorState } from '../ErrorState';

const mockedAddEventListener = NetInfo.addEventListener as jest.Mock;

beforeEach(() => {
  mockedAddEventListener.mockClear();
});

function goOffline() {
  const listener = mockedAddEventListener.mock.calls[0][0];
  act(() => listener({ isConnected: false, isInternetReachable: false }));
}

describe('<ErrorState />', () => {
  it('con conexión, muestra el mensaje recibido y el botón de reintentar', () => {
    const onRetry = jest.fn();
    render(<ErrorState message="No se pudo cargar la lista." onRetry={onRetry} />);

    expect(screen.getByText('No se pudo cargar la lista.')).toBeTruthy();
    fireEvent.press(screen.getByText('Reintentar'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('sin conexión, saca el botón de reintentar y avisa que hace falta red', () => {
    render(<ErrorState message="No se pudo cargar la lista." onRetry={jest.fn()} />);
    goOffline();

    expect(
      screen.getByText('Estás sin conexión. Conectate para reintentar.')
    ).toBeTruthy();
    expect(screen.queryByText('Reintentar')).toBeNull();
  });

  it('sin conexión y sin onRetry (ej. 404), tampoco muestra el botón', () => {
    render(<ErrorState message="No existe." />);
    goOffline();

    expect(screen.queryByText('Reintentar')).toBeNull();
  });
});
