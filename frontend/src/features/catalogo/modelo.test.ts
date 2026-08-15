import { describe, expect, it } from 'vitest';
import {
  agrupar,
  aplanar,
  calcularEstadisticas,
  filtrar,
  FILTROS_INICIALES,
  siguienteParaVer,
} from './modelo';
import type { Catalogo, Titulo } from '../../tipos/catalogo';

function titulo(id: number, parcial: Partial<Titulo> = {}): Titulo {
  return {
    id,
    tipo: 'pelicula',
    titulo: `Título ${id}`,
    anio: '2011',
    duracionMin: 120,
    ordenEstreno: 100 - id,
    opcional: false,
    agrupado: false,
    cuentaEnTiempo: true,
    marcable: true,
    ...parcial,
  };
}

/** Catálogo mínimo con dos bloques y un título sin estrenar. */
const CATALOGO: Catalogo = {
  idioma: 'es',
  totalMarcables: 3,
  tiempoTotalMin: 360,
  tiempoOpcionalMin: 8400,
  sagas: [
    {
      numero: 1,
      nombre: 'Saga del Infinito',
      bloques: [
        {
          numero: 1,
          nombre: 'Los orígenes',
          titulos: [
            titulo(1, { titulo: 'Capitán América: El Primer Vengador' }),
            titulo(2, { titulo: 'Capitana Marvel', tipo: 'corto' }),
          ],
        },
        {
          numero: 2,
          nombre: 'El nacimiento de los héroes',
          titulos: [
            titulo(3, { titulo: 'Iron Man' }),
            titulo(4, { titulo: 'Vengadores: Doomsday', tipo: 'proxima', marcable: false }),
            titulo(5, {
              titulo: 'Saga de los Defensores',
              tipo: 'serie',
              agrupado: true,
              opcional: true,
              cuentaEnTiempo: false,
              duracionMin: 8400,
            }),
          ],
        },
      ],
    },
  ],
  opcionales: [],
};

describe('aplanar', () => {
  it('conserva la saga y el bloque de cada título', () => {
    const titulos = aplanar(CATALOGO);

    expect(titulos).toHaveLength(5);
    expect(titulos[0]?.bloqueNombre).toBe('Los orígenes');
    expect(titulos[4]?.sagaNombre).toBe('Saga del Infinito');
  });
});

describe('filtrar', () => {
  const titulos = aplanar(CATALOGO);

  it('busca sin tener en cuenta las tildes', () => {
    const resultado = filtrar(titulos, { ...FILTROS_INICIALES, busqueda: 'capitan america' }, {});

    expect(resultado).toHaveLength(1);
    expect(resultado[0]?.id).toBe(1);
  });

  it('filtra por tipo', () => {
    const resultado = filtrar(titulos, { ...FILTROS_INICIALES, tipos: ['corto'] }, {});

    expect(resultado.map((elemento) => elemento.id)).toEqual([2]);
  });

  it('deja fuera los títulos sin estrenar al pedir los pendientes', () => {
    const resultado = filtrar(titulos, { ...FILTROS_INICIALES, estado: 'pendientes' }, {});

    expect(resultado.map((elemento) => elemento.id)).not.toContain(4);
  });

  it('ordena por fecha de estreno cuando se pide ese orden', () => {
    const resultado = filtrar(titulos, { ...FILTROS_INICIALES, orden: 'estreno' }, {});

    expect(resultado.map((elemento) => elemento.ordenEstreno)).toEqual([95, 96, 97, 98, 99]);
  });
});

describe('agrupar', () => {
  it('respeta los bloques en orden cronológico', () => {
    const grupos = agrupar(filtrar(aplanar(CATALOGO), FILTROS_INICIALES, {}), 'cronologico');

    expect(grupos).toHaveLength(2);
    expect(grupos[0]?.bloqueNombre).toBe('Los orígenes');
  });

  it('devuelve un único grupo continuo en orden de estreno', () => {
    const titulos = filtrar(aplanar(CATALOGO), { ...FILTROS_INICIALES, orden: 'estreno' }, {});

    expect(agrupar(titulos, 'estreno')).toHaveLength(1);
  });
});

describe('calcularEstadisticas', () => {
  it('no cuenta los títulos sin estrenar en el denominador', () => {
    const estadisticas = calcularEstadisticas(CATALOGO, {});

    expect(estadisticas.total).toBe(3);
    expect(estadisticas.vistos).toBe(0);
    expect(estadisticas.porcentaje).toBe(0);
  });

  it('deja el tiempo de la saga opcional fuera del cálculo', () => {
    // Marcadas las dos primeras (120 min cada una) y la agrupada de 8400.
    const estadisticas = calcularEstadisticas(CATALOGO, {
      1: '2026-01-01T00:00:00Z',
      2: '2026-01-01T00:00:00Z',
      5: '2026-01-01T00:00:00Z',
    });

    expect(estadisticas.minutosVistos).toBe(240);
    expect(estadisticas.minutosRestantes).toBe(120);
    expect(estadisticas.minutosOpcionales).toBe(8400);
  });
});

describe('siguienteParaVer', () => {
  it('devuelve el primer pendiente en orden cronológico', () => {
    const siguiente = siguienteParaVer(aplanar(CATALOGO), { 1: '2026-01-01T00:00:00Z' });

    expect(siguiente?.id).toBe(2);
  });

  it('nunca propone un título sin estrenar', () => {
    const vistos = { 1: 'x', 2: 'x', 3: 'x', 5: 'x' };
    const siguiente = siguienteParaVer(aplanar(CATALOGO), vistos);

    expect(siguiente).toBeUndefined();
  });
});
