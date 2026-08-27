import { useEffect, useState } from 'react';

// Optimización de render, no de red (el filtro es local, ver
// usePokemonIndex): evita re-filtrar ~1300 nombres en cada tecla.
export function useDebouncedValue<T>(value: T, delayMs = 250): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}
