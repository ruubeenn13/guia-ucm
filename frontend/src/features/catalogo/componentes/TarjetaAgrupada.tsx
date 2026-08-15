import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Check, Clock, Plus } from 'lucide-react';
import { APARIENCIA_TIPOS } from '../tiposVisuales';
import { formatearHoras } from '../../../utils/tiempo';
import type { TituloConContexto } from '../modelo';

interface Props {
  titulo: TituloConContexto;
  visto: boolean;
  onAlternar: (id: number) => void;
}

/**
 * Fila ancha para las entradas que agrupan varias series, como la Saga de los
 * Defensores.
 *
 * No tienen carátula propia ni sentido dentro de la rejilla de tarjetas: son
 * un bloque aparte, con su nota explicativa y su tiempo indicado por
 * separado, porque quedan fuera de las estadísticas.
 */
export function TarjetaAgrupada({ titulo, visto, onAlternar }: Props) {
  const apariencia = APARIENCIA_TIPOS[titulo.tipo];

  return (
    <motion.article
      id={`titulo-${titulo.id}`}
      layout="position"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="col-span-full"
    >
      <div
        className="flex flex-col gap-4 rounded-[var(--radio-lg)] border border-dashed border-[var(--c-borde-fuerte)] bg-[var(--c-superficie)] p-5 sm:p-6 lg:flex-row lg:items-center lg:gap-6"
        style={{ borderLeft: `4px solid ${apariencia.linea}` }}
      >
        <div className="min-w-0 flex-1">
          <p
            className="text-[0.7rem] font-semibold tracking-[0.09em] uppercase"
            style={{ color: apariencia.texto }}
          >
            Opcional · {apariencia.etiqueta}
          </p>

          <h3 className="titular mt-1 text-2xl sm:text-3xl">{titulo.titulo}</h3>

          <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-[var(--c-texto-suave)]">
            <span>{titulo.anio}</span>
            {titulo.duracionMin !== undefined && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={13} aria-hidden="true" />≈ {formatearHoras(titulo.duracionMin)}{' '}
                  aparte
                </span>
              </>
            )}
          </p>

          {titulo.nota && (
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--c-texto-suave)]">
              {titulo.nota}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onAlternar(titulo.id)}
          aria-pressed={visto}
          aria-label={
            visto ? `Quitar «${titulo.titulo}» de vistas` : `Marcar «${titulo.titulo}» como vista`
          }
          className={clsx(
            'tactil inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--radio-full)]',
            'border px-5 text-sm font-semibold transition-colors duration-150',
            visto
              ? 'border-transparent bg-[var(--c-exito)] text-white'
              : 'border-[var(--c-borde)] bg-[var(--c-superficie-alt)] text-[var(--c-texto)] hover:border-[var(--c-borde-fuerte)]',
          )}
        >
          {visto ? <Check size={17} aria-hidden="true" /> : <Plus size={17} aria-hidden="true" />}
          {visto ? 'Vista' : 'Marcar vista'}
        </button>
      </div>
    </motion.article>
  );
}
