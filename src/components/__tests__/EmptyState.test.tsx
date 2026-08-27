import { render, screen } from '@testing-library/react-native';
import { EmptyState } from '../EmptyState';

describe('<EmptyState />', () => {
  it('muestra el título recibido', () => {
    render(<EmptyState title="Sin resultados" />);
    expect(screen.getByText('Sin resultados')).toBeTruthy();
  });

  it('muestra el subtítulo solo si se pasa', () => {
    render(<EmptyState title="Título" subtitle="Detalle extra" />);
    expect(screen.getByText('Detalle extra')).toBeTruthy();
  });

  it('no rompe si no hay subtítulo', () => {
    render(<EmptyState title="Título" />);
    expect(screen.queryByText('Detalle extra')).toBeNull();
  });
});
