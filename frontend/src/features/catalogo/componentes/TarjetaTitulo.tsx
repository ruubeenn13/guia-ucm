import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Check, Clock, Plus } from 'lucide-react';
import { APARIENCIA_TIPOS } from '../tiposVisuales';
import { formatearDuracion } from '../../../utils/tiempo';
import type { TituloConContexto } from '../modelo';

interface Props {
  titulo: TituloConContexto;
  visto: boolean;
  onAlternar: (id: number) => void;
}

/**
 * Tarjeta de un título.
 *
 * La carátula manda: ocupa casi toda la tarjeta y es también el botón de
 * «marcar vista». Al marcarlo se atenúa y aparece el check, de modo que el
 * estado se lee de un vistazo aunque se mire la rejilla entera de lejos.
 *
 * Mientras no haya carátulas de TMDB (llegan en el hito 3), el hueco lo
 * ocupa un cartel generado con el número de orden y el color del tipo, que
 * es exactamente el sitio donde luego encaja la imagen.
 */
export function TarjetaTitulo({ titulo, visto, onAlternar }: Props) {
  const apariencia = APARIENCIA_TIPOS[titulo.tipo];
  const puedeMarcarse = titulo.marcable;

  const etiquetaBoton = visto
    ? `Quitar «${titulo.titulo}» de vistas`
    : `Marcar «${titulo.titulo}» como vista`;

  return (
    <motion.article
      id={`titulo-${titulo.id}`}
      layout="position"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="group flex h-full flex-col gap-2"
    >
      <button
        type="button"
        onClick={() => puedeMarcarse && onAlternar(titulo.id)}
        disabled={!puedeMarcarse}
        aria-pressed={puedeMarcarse ? visto : undefined}
        aria-label={puedeMarcarse ? etiquetaBoton : `${titulo.titulo}, aún sin estrenar`}
        className={clsx(
          'relative block aspect-[2/3] w-full overflow-hidden rounded-[var(--radio-md)]',
          'border border-[var(--c-borde)] shadow-[var(--sombra-baja)]',
          'transition-[transform,box-shadow,filter] duration-200',
          puedeMarcarse
            ? 'hover:-translate-y-1 hover:shadow-[var(--sombra-media)]'
            : 'cursor-default opacity-80',
        )}
        style={{
          background: `linear-gradient(152deg,
            color-mix(in oklab, ${apariencia.linea} 62%, var(--c-cartel-base)) 0%,
            color-mix(in oklab, ${apariencia.linea} 24%, var(--c-cartel-base)) 52%,
            var(--c-cartel-base) 100%)`,
        }}
      >
        {/* Número de orden como elemento gráfico del cartel. */}
        <span
          aria-hidden="true"
          className="titular pointer-events-none absolute -bottom-3 -left-1 text-[5.5rem] leading-none text-white opacity-25 sm:text-[6.5rem]"
        >
          {titulo.id}
        </span>

        {/* Franja de color del tipo. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1"
          style={{ backgroundColor: apariencia.linea }}
        />

        {/* Velo y check cuando está vista. */}
        <span
          aria-hidden="true"
          className={clsx(
            'absolute inset-0 grid place-items-center transition-opacity duration-200',
            visto ? 'bg-[var(--c-cartel-base)]/80 opacity-100' : 'opacity-0',
          )}
        >
          <span className="grid size-11 place-items-center rounded-[var(--radio-full)] bg-[var(--c-exito)] text-white shadow-[var(--sombra-media)]">
            <Check size={24} strokeWidth={3} />
          </span>
        </span>
      </button>

      {/* `flex-1` + `mt-auto` en el botón: las acciones quedan alineadas
          entre todas las tarjetas de la fila aunque los títulos ocupen
          distinto número de líneas. */}
      <div className="flex flex-1 flex-col gap-1">
        <p
          className="text-[0.7rem] font-semibold tracking-[0.09em] uppercase"
          style={{ color: apariencia.texto }}
        >
          {apariencia.etiqueta}
        </p>

        <h3 className="font-texto text-[0.95rem] leading-snug font-semibold text-[var(--c-texto)]">
          {titulo.titulo}
        </h3>

        <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[0.8rem] text-[var(--c-texto-suave)]">
          <span>{titulo.anio}</span>
          {titulo.duracionMin !== undefined && (
            <>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock size={12} aria-hidden="true" />
                {formatearDuracion(titulo.duracionMin)}
              </span>
            </>
          )}
        </p>

        {puedeMarcarse ? (
          <button
            type="button"
            onClick={() => onAlternar(titulo.id)}
            aria-label={etiquetaBoton}
            className={clsx(
              'tactil mt-auto inline-flex w-full items-center justify-center gap-1.5 rounded-[var(--radio-full)]',
              'border px-3 text-sm font-semibold transition-colors duration-150',
              visto
                ? 'border-transparent bg-[var(--c-exito)] text-white'
                : 'border-[var(--c-borde)] bg-[var(--c-superficie)] text-[var(--c-texto)] hover:border-[var(--c-borde-fuerte)]',
            )}
          >
            {visto ? <Check size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
            {visto ? 'Vista' : 'Marcar vista'}
          </button>
        ) : (
          <p className="mt-auto rounded-[var(--radio-full)] border border-dashed border-[var(--c-borde)] px-3 py-2 text-center text-sm text-[var(--c-texto-tenue)]">
            Aún sin estrenar
          </p>
        )}
      </div>
    </motion.article>
  );
}
