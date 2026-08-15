import { motion } from 'framer-motion';
import { CalendarClock, Hourglass } from 'lucide-react';
import { diasDeMaraton, formatearDias, formatearHoras } from '../../../utils/tiempo';
import type { Estadisticas } from '../../catalogo/modelo';

interface Props {
  estadisticas: Estadisticas;
  horasPorDia: number;
  onCambiarHoras: (horas: number) => void;
}

const RITMOS = [1, 2, 3, 4] as const;

/**
 * Panel de progreso y tiempo, con la calculadora de maratón.
 *
 * El tiempo de la Saga de los Defensores queda fuera del cálculo a propósito:
 * son ≈140 h opcionales que, metidas en el total, convertirían cualquier
 * estimación en un número desalentador y poco realista.
 */
export function PanelEstadisticas({ estadisticas, horasPorDia, onCambiarHoras }: Props) {
  const dias = diasDeMaraton(estadisticas.minutosRestantes, horasPorDia);

  return (
    <section aria-labelledby="estadisticas-titulo" className="contenedor-guia">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* Progreso y tiempo */}
        <div className="rounded-[var(--radio-lg)] border border-[var(--c-borde)] bg-[var(--c-superficie)] p-5 sm:p-6">
          <h2 id="estadisticas-titulo" className="titular text-2xl sm:text-3xl">
            Tu progreso
          </h2>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="titular text-5xl text-[var(--c-acento)] sm:text-6xl">
              {estadisticas.porcentaje}%
            </span>
            <span className="text-sm text-[var(--c-texto-suave)]">
              {estadisticas.vistos} de {estadisticas.total} títulos
            </span>
          </div>

          <div
            role="progressbar"
            aria-valuenow={estadisticas.porcentaje}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progreso de la guía"
            className="mt-3 h-2.5 w-full overflow-hidden rounded-[var(--radio-full)] bg-[var(--c-superficie-alt)]"
          >
            <motion.div
              className="h-full rounded-[var(--radio-full)] bg-[var(--c-acento)]"
              initial={{ width: 0 }}
              animate={{ width: `${estadisticas.porcentaje}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Dato
              etiqueta="Duración total"
              valor={`≈ ${formatearHoras(estadisticas.minutosTotales)}`}
            />
            <Dato etiqueta="Ya visto" valor={formatearHoras(estadisticas.minutosVistos)} />
            <Dato etiqueta="Te queda" valor={formatearHoras(estadisticas.minutosRestantes)} />
          </dl>

          {estadisticas.minutosOpcionales > 0 && (
            <p className="mt-4 flex items-start gap-2 text-sm text-[var(--c-texto-tenue)]">
              <Hourglass size={15} aria-hidden="true" className="mt-0.5 shrink-0" />
              La Saga de los Defensores es opcional y suma ≈{' '}
              {formatearHoras(estadisticas.minutosOpcionales)} aparte, fuera de este cálculo.
            </p>
          )}
        </div>

        {/* Calculadora de maratón */}
        <div className="flex flex-col rounded-[var(--radio-lg)] border border-[var(--c-borde)] bg-[var(--c-superficie-alt)] p-5 sm:p-6">
          <h3 className="titular flex items-center gap-2 text-2xl">
            <CalendarClock size={22} aria-hidden="true" className="text-[var(--c-acento)]" />
            Maratón
          </h3>

          <fieldset className="mt-4">
            <legend className="text-sm text-[var(--c-texto-suave)]">¿Cuánto ves al día?</legend>
            <div className="mt-2 flex gap-2">
              {RITMOS.map((horas) => (
                <button
                  key={horas}
                  type="button"
                  onClick={() => onCambiarHoras(horas)}
                  aria-pressed={horasPorDia === horas}
                  className={
                    horasPorDia === horas
                      ? 'tactil flex-1 rounded-[var(--radio-md)] border border-transparent bg-[var(--c-texto)] text-sm font-semibold text-[var(--c-texto-invertido)]'
                      : 'tactil flex-1 rounded-[var(--radio-md)] border border-[var(--c-borde)] bg-[var(--c-superficie)] text-sm font-semibold text-[var(--c-texto-suave)] hover:text-[var(--c-texto)]'
                  }
                >
                  {horas} h
                </button>
              ))}
            </div>
          </fieldset>

          <p aria-live="polite" className="mt-5 text-[var(--c-texto-suave)]">
            A {horasPorDia} h al día terminas en
            <span className="titular mt-1 block text-4xl text-[var(--c-texto)] sm:text-5xl">
              {formatearDias(dias)}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div>
      <dt className="text-xs tracking-[0.1em] text-[var(--c-texto-tenue)] uppercase">{etiqueta}</dt>
      <dd className="mt-1 text-lg font-semibold text-[var(--c-texto)]">{valor}</dd>
    </div>
  );
}
