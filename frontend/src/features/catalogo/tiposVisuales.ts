import type { TipoTitulo } from '../../tipos/catalogo';

/** Cómo se presenta cada tipo de contenido: su nombre y su color. */
export interface AparienciaTipo {
  etiqueta: string;
  /** Variable CSS del color fuerte, para bordes y puntos. */
  linea: string;
  /** Variable CSS del color de texto, con contraste AA sobre superficie. */
  texto: string;
}

export const APARIENCIA_TIPOS: Record<TipoTitulo, AparienciaTipo> = {
  pelicula: {
    etiqueta: 'Película',
    linea: 'var(--tipo-pelicula)',
    texto: 'var(--tipo-pelicula-texto)',
  },
  serie: { etiqueta: 'Serie', linea: 'var(--tipo-serie)', texto: 'var(--tipo-serie-texto)' },
  corto: { etiqueta: 'Corto', linea: 'var(--tipo-corto)', texto: 'var(--tipo-corto-texto)' },
  especial: {
    etiqueta: 'Especial',
    linea: 'var(--tipo-especial)',
    texto: 'var(--tipo-especial-texto)',
  },
  animacion: {
    etiqueta: 'Animación',
    linea: 'var(--tipo-animacion)',
    texto: 'var(--tipo-animacion-texto)',
  },
  proxima: {
    etiqueta: 'Próximamente',
    linea: 'var(--tipo-proxima)',
    texto: 'var(--tipo-proxima-texto)',
  },
};
