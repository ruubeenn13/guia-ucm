/**
 * Tipos del catálogo, calcados de los DTO del backend.
 *
 * La API omite los campos nulos para no engordar la respuesta, así que aquí
 * son opcionales en vez de `T | null`.
 */

/** Idiomas que sirve la API. */
export type Idioma = 'es' | 'en';

/** Tipo de contenido. Determina el color con el que se pinta el título. */
export type TipoTitulo = 'pelicula' | 'serie' | 'corto' | 'especial' | 'animacion' | 'proxima';

export const TIPOS_TITULO: readonly TipoTitulo[] = [
  'pelicula',
  'serie',
  'corto',
  'especial',
  'animacion',
  'proxima',
] as const;

export interface Titulo {
  /** Número de orden cronológico. Es el identificador del título. */
  id: number;
  tipo: TipoTitulo;
  titulo: string;
  /** Año o rango de años de estreno, ya formateado por el backend. */
  anio: string;
  /** Duración aproximada en minutos. Ausente si aún no se ha estrenado. */
  duracionMin?: number;
  ordenEstreno: number;
  temporada?: number;
  opcional: boolean;
  /** La fila representa un conjunto de series, no un título único. */
  agrupado: boolean;
  cuentaEnTiempo: boolean;
  /** Ya estrenado: se puede marcar como visto. */
  marcable: boolean;
  nota?: string;
}

export interface Bloque {
  numero: number;
  nombre: string;
  titulos: Titulo[];
}

export interface Saga {
  numero: number;
  nombre: string;
  bloques: Bloque[];
}

export interface SeccionOpcional {
  clave: string;
  nombre: string;
  items: string[];
}

export interface Catalogo {
  idioma: string;
  /** Denominador del progreso: los títulos ya estrenados. */
  totalMarcables: number;
  /** Minutos de todo lo que cuenta en las estadísticas de tiempo. */
  tiempoTotalMin: number;
  /** Minutos que se muestran aparte (la Saga de los Defensores). */
  tiempoOpcionalMin: number;
  sagas: Saga[];
  opcionales: SeccionOpcional[];
}
