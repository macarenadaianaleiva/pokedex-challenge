import { isNotFoundError, retryUnlessNotFound } from '../queryClient';

// isAxiosError solo chequea `isAxiosError: true`; no hace falta un AxiosError real.
function axiosErrorWithStatus(status: number) {
  return { isAxiosError: true, response: { status } };
}

describe('isNotFoundError', () => {
  it('reconoce un 404 de axios', () => {
    expect(isNotFoundError(axiosErrorWithStatus(404))).toBe(true);
  });

  it('no confunde otros status HTTP con "no existe"', () => {
    expect(isNotFoundError(axiosErrorWithStatus(500))).toBe(false);
    expect(isNotFoundError(axiosErrorWithStatus(401))).toBe(false);
  });

  it('no confunde un error genérico (no-axios) con "no existe"', () => {
    expect(isNotFoundError(new Error('Network Error'))).toBe(false);
  });
});

describe('retryUnlessNotFound', () => {
  it('NO reintenta un 404 ("no existe"), sin importar cuántas veces ya falló', () => {
    expect(retryUnlessNotFound(0, axiosErrorWithStatus(404))).toBe(false);
    expect(retryUnlessNotFound(1, axiosErrorWithStatus(404))).toBe(false);
  });

  it('SÍ reintenta otros errores HTTP (ej. 500) hasta el límite', () => {
    expect(retryUnlessNotFound(0, axiosErrorWithStatus(500))).toBe(true);
    expect(retryUnlessNotFound(1, axiosErrorWithStatus(500))).toBe(true);
    expect(retryUnlessNotFound(2, axiosErrorWithStatus(500))).toBe(false);
  });

  it('SÍ reintenta un fallo genérico (sin conexión, timeout) hasta el límite', () => {
    const networkError = new Error('Network Error');
    expect(retryUnlessNotFound(0, networkError)).toBe(true);
    expect(retryUnlessNotFound(1, networkError)).toBe(true);
    expect(retryUnlessNotFound(2, networkError)).toBe(false);
  });
});
