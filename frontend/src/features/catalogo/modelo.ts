import { contiene } from '../../utils/texto';
import type { Catalogo, TipoTitulo, Titulo } from '../../tipos/catalogo';

/** Un título junto con la saga y el bloque a los que pertenece. */
export interface TituloConContexto extends Titulo {
  sagaNumero: number;
  sagaNombre: string;
  bloqueNumero: number;
  bloqueNombre: string;
}

/** Cómo se ordena la guía. */
export type Orden = 'cronologico' | 'estreno';

/** Filtro por estado de visionado. */
export type EstadoFiltro = 'todas' | 'vistas' | 'pendientes';

export interface Filtros {
  busqueda: string;
  /** Lista vacía = todos los tipos. */
  tipos: TipoTitulo[];
  estado: EstadoFiltro;
  orden: Orden;
}

export const FILTROS_INICIALES: Filtros = {
  busqueda: '',
  tipos: [],
  estado: 'todas',
  orden: 'cronologico',
};

/** Grupo de títulos con su encabezado, tal y como se pinta en pantalla. */
export interface Grupo {
  clave: string;
  sagaNombre: string;
  bloqueNumero: number;
  bloqueNombre: string;
  titulos: TituloConContexto[];
}

export interface Estadisticas {
  /** Títulos ya estrenados: el denominador del progreso. */
  total: number;
  vistos: number;
  porcentaje: number;
  minutosTotales: number;
  minutosVistos: number;
  minutosRestantes: number;
  /** Minutos que se muestran aparte y no entran en el cálculo. */
  minutosOpcionales: number;
}

/**
 * Convierte el catálogo anidado en una lista plana, conservando de qué saga y
 * bloque viene cada título.
 */
export function aplanar(catalogo: Catalogo): TituloConContexto[] {
  return catalogo.sagas.flatMap((saga) =>
    saga.bloques.flatMap((bloque) =>
      bloque.titulos.map((titulo) => ({
        ...titulo,
        sagaNumero: saga.numero,
        sagaNombre: saga.nombre,
        bloqueNumero: bloque.numero,
        bloqueNombre: bloque.nombre,
      })),
    ),
  );
}

/**
 * Aplica búsqueda, tipos y estado, y ordena según el conmutador.
 *
 * @param titulos lista plana del catálogo
 * @param filtros filtros activos
 * @param vistos  identificadores marcados como vistos
 */
export function filtrar(
  titulos: TituloConContexto[],
  filtros: Filtros,
  vistos: Readonly<Record<number, string>>,
): TituloConContexto[] {
  const filtrados = titulos.filter((titulo) => {
    if (!contiene(titulo.titulo, filtros.busqueda)) return false;
    if (filtros.tipos.length > 0 && !filtros.tipos.includes(titulo.tipo)) return false;

    if (filtros.estado === 'vistas') return Boolean(vistos[titulo.id]);
    if (filtros.estado === 'pendientes') return titulo.marcable && !vistos[titulo.id];
    return true;
  });

  return filtros.orden === 'estreno'
    ? [...filtrados].sort((a, b) => a.ordenEstreno - b.ordenEstreno)
    : [...filtrados].sort((a, b) => a.id - b.id);
}

/**
 * Agrupa los títulos para pintarlos.
 *
 * En orden cronológico se respetan los bloques temáticos. En orden de estreno
 * los bloques no significan nada, así que sale un único grupo continuo.
 */
export function agrupar(titulos: TituloConContexto[], orden: Orden): Grupo[] {
  if (orden === 'estreno') {
    if (titulos.length === 0) return [];
    return [
      {
        clave: 'estreno',
        sagaNombre: '',
        bloqueNumero: 0,
        bloqueNombre: '',
        titulos,
      },
    ];
  }

  const grupos: Grupo[] = [];
  for (const titulo of titulos) {
    const clave = `${titulo.sagaNumero}-${titulo.bloqueNumero}`;
    const ultimo = grupos.at(-1);
    if (ultimo?.clave === clave) {
      ultimo.titulos.push(titulo);
    } else {
      grupos.push({
        clave,
        sagaNombre: titulo.sagaNombre,
        bloqueNumero: titulo.bloqueNumero,
        bloqueNombre: titulo.bloqueNombre,
        titulos: [titulo],
      });
    }
  }
  return grupos;
}

/**
 * Calcula el progreso y el tiempo.
 *
 * Solo cuentan los títulos ya estrenados. La Saga de los Defensores se marca
 * como vista igual que el resto, pero su tiempo va aparte porque son ≈140 h
 * que desvirtuarían cualquier estimación de maratón.
 */
export function calcularEstadisticas(
  catalogo: Catalogo,
  vistos: Readonly<Record<number, string>>,
): Estadisticas {
  const titulos = aplanar(catalogo).filter((titulo) => titulo.marcable);

  const marcados = titulos.filter((titulo) => Boolean(vistos[titulo.id]));
  const minutosVistos = marcados
    .filter((titulo) => titulo.cuentaEnTiempo)
    .reduce((suma, titulo) => suma + (titulo.duracionMin ?? 0), 0);

  const total = catalogo.totalMarcables;
  const minutosTotales = catalogo.tiempoTotalMin;

  return {
    total,
    vistos: marcados.length,
    porcentaje: total === 0 ? 0 : Math.round((marcados.length / total) * 100),
    minutosTotales,
    minutosVistos,
    minutosRestantes: Math.max(0, minutosTotales - minutosVistos),
    minutosOpcionales: catalogo.tiempoOpcionalMin,
  };
}

/**
 * Primer título pendiente en orden cronológico.
 *
 * @returns el siguiente título por ver, o `undefined` si ya está todo visto
 */
export function siguienteParaVer(
  titulos: TituloConContexto[],
  vistos: Readonly<Record<number, string>>,
): TituloConContexto | undefined {
  return [...titulos]
    .sort((a, b) => a.id - b.id)
    .find((titulo) => titulo.marcable && !vistos[titulo.id]);
}
