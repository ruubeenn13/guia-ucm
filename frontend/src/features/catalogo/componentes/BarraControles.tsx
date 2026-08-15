import { Search, X } from 'lucide-react';
import clsx from 'clsx';
import { Chip } from '../../../components/ui/Chip';
import { APARIENCIA_TIPOS } from '../tiposVisuales';
import { TIPOS_TITULO, type TipoTitulo } from '../../../tipos/catalogo';
import type { EstadoFiltro, Estadisticas, Filtros, Orden } from '../modelo';

interface Props {
  filtros: Filtros;
  onCambiar: (cambio: Partial<Filtros>) => void;
  estadisticas: Estadisticas;
  resultados: number;
}

const ESTADOS: ReadonlyArray<{ valor: EstadoFiltro; etiqueta: string }> = [
  { valor: 'todas', etiqueta: 'Todas' },
  { valor: 'vistas', etiqueta: 'Vistas' },
  { valor: 'pendientes', etiqueta: 'Pendientes' },
];

const ORDENES: ReadonlyArray<{ valor: Orden; etiqueta: string }> = [
  { valor: 'cronologico', etiqueta: 'Cronológico' },
  { valor: 'estreno', etiqueta: 'Estreno' },
];

/**
 * Barra fija con buscador, filtros, conmutador de orden y progreso.
 *
 * Se queda pegada arriba al hacer scroll para que marcar y filtrar no
 * obliguen a subir. En móvil los chips de tipo se desplazan en horizontal en
 * lugar de romper la barra en varias líneas.
 */
export function BarraControles({ filtros, onCambiar, estadisticas, resultados }: Props) {
  const alternarTipo = (tipo: TipoTitulo): void => {
    const activos = filtros.tipos.includes(tipo)
      ? filtros.tipos.filter((otro) => otro !== tipo)
      : [...filtros.tipos, tipo];
    onCambiar({ tipos: activos });
  };

  return (
    <div className="vidrio sticky top-0 z-30 border-x-0 border-t-0">
      <div className="contenedor-guia flex flex-col gap-3 py-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Buscador */}
          <div className="relative min-w-0 flex-1 basis-56">
            <Search
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[var(--c-texto-tenue)]"
            />
            <input
              type="search"
              value={filtros.busqueda}
              onChange={(evento) => onCambiar({ busqueda: evento.target.value })}
              placeholder="Buscar un título…"
              aria-label="Buscar un título"
              className="tactil w-full rounded-[var(--radio-full)] border border-[var(--c-borde)] bg-[var(--c-superficie)] py-2 pr-10 pl-10 text-sm text-[var(--c-texto)] placeholder:text-[var(--c-texto-tenue)]"
            />
            {filtros.busqueda !== '' && (
              <button
                type="button"
                onClick={() => onCambiar({ busqueda: '' })}
                aria-label="Borrar la búsqueda"
                className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-[var(--radio-full)] text-[var(--c-texto-tenue)] hover:text-[var(--c-texto)]"
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Conmutador de orden */}
          <div
            role="group"
            aria-label="Orden de la guía"
            className="flex shrink-0 rounded-[var(--radio-full)] border border-[var(--c-borde)] bg-[var(--c-superficie)] p-1"
          >
            {ORDENES.map((opcion) => (
              <button
                key={opcion.valor}
                type="button"
                onClick={() => onCambiar({ orden: opcion.valor })}
                aria-pressed={filtros.orden === opcion.valor}
                className={clsx(
                  'rounded-[var(--radio-full)] px-3.5 py-1.5 text-sm font-medium transition-colors',
                  filtros.orden === opcion.valor
                    ? 'bg-[var(--c-texto)] text-[var(--c-texto-invertido)]'
                    : 'text-[var(--c-texto-suave)] hover:text-[var(--c-texto)]',
                )}
              >
                {opcion.etiqueta}
              </button>
            ))}
          </div>

          {/* Progreso */}
          <p className="ml-auto shrink-0 text-sm font-semibold whitespace-nowrap text-[var(--c-texto)]">
            {estadisticas.vistos}/{estadisticas.total}
            <span className="text-[var(--c-texto-tenue)]"> · </span>
            <span className="text-[var(--c-acento)]">{estadisticas.porcentaje}%</span>
          </p>
        </div>

        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1">
          {ESTADOS.map((opcion) => (
            <Chip
              key={opcion.valor}
              activo={filtros.estado === opcion.valor}
              aria-pressed={filtros.estado === opcion.valor}
              onClick={() => onCambiar({ estado: opcion.valor })}
            >
              {opcion.etiqueta}
            </Chip>
          ))}

          <span aria-hidden="true" className="h-6 w-px shrink-0 bg-[var(--c-borde)]" />

          {TIPOS_TITULO.map((tipo) => (
            <Chip
              key={tipo}
              activo={filtros.tipos.includes(tipo)}
              aria-pressed={filtros.tipos.includes(tipo)}
              color={APARIENCIA_TIPOS[tipo].linea}
              onClick={() => alternarTipo(tipo)}
            >
              {APARIENCIA_TIPOS[tipo].etiqueta}
            </Chip>
          ))}
        </div>

        {/* Recuento vivo, anunciado por los lectores de pantalla. */}
        <p aria-live="polite" className="solo-lectores">
          {resultados} títulos coinciden con los filtros.
        </p>
      </div>
    </div>
  );
}
