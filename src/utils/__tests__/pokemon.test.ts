import {
  capitalize,
  formatHeight,
  formatPokedexId,
  formatWeight,
  getArtworkForListItem,
  getArtworkUrl,
  getIdFromUrl,
  getTypeColor,
} from '../pokemon';

describe('getIdFromUrl', () => {
  it('extrae el id numérico de una url de PokeAPI', () => {
    expect(getIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
  });

  it('devuelve 0 si la url no matchea el patrón esperado', () => {
    expect(getIdFromUrl('https://pokeapi.co/api/v2/pokemon-species/25/')).toBe(
      0
    );
  });
});

describe('getArtworkForListItem', () => {
  it('deriva id e imagen sin pedir el detalle', () => {
    const result = getArtworkForListItem({
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/25/',
    });
    expect(result.id).toBe(25);
    expect(result.image).toBe(getArtworkUrl(25));
  });
});

describe('formatPokedexId', () => {
  it('rellena con ceros a la izquierda hasta 3 dígitos', () => {
    expect(formatPokedexId(1)).toBe('#001');
    expect(formatPokedexId(25)).toBe('#025');
    expect(formatPokedexId(150)).toBe('#150');
  });
});

describe('formatWeight / formatHeight', () => {
  it('convierte hectogramos a kg y decímetros a metros', () => {
    expect(formatWeight(69)).toBe('6.9 kg'); // pikachu
    expect(formatHeight(4)).toBe('0.4 m');
  });
});

describe('capitalize', () => {
  it('pone en mayúscula solo la primera letra', () => {
    expect(capitalize('pikachu')).toBe('Pikachu');
  });
});

describe('getTypeColor', () => {
  it('devuelve un color conocido para un tipo válido', () => {
    expect(getTypeColor('fire')).toBe('#EE8130');
  });

  it('devuelve un color por defecto para un tipo desconocido', () => {
    expect(getTypeColor('unknown-type')).toBe('#777777');
  });
});
