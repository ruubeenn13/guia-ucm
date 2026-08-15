import { motion } from 'framer-motion';
import { Check, PartyPopper } from 'lucide-react';
import { Boton } from '../../../components/ui/Boton';
import { APARIENCIA_TIPOS } from '../tiposVisuales';
import { formatearDuracion } from '../../../utils/tiempo';
import type { TituloConContexto } from '../modelo';

interface Props {
  siguiente: TituloConContexto | undefined;
  onMarcar: (id: number) => void;
  onIrA: (id: number) => void;
}

/**
 * Banner con el primer título pendiente en orden cronológico.
 *
 * Responde a la única pregunta que trae aquí a la mayoría de la gente: «¿y
 * ahora qué veo?». Cuando ya no queda nada pendiente, felicita.
 */
export function SiguienteParaVer({ siguiente, onMarcar, onIrA }: Props) {
  if (!siguiente) {
    return (
      <div className="contenedor-guia">
        <div className="flex flex-wrap items-center gap-4 rounded-[var(--radio-lg)] border border-[var(--c-borde)] bg-[var(--c-superficie)] p-5 sm:p-6">
          <span className="grid size-12 shrink-0 place-items-center rounded-[var(--radio-full)] bg-[var(--c-exito)] text-white">
            <PartyPopper size={22} aria-hidden="true" />
          </span>
          <div>
            <h2 className="titular text-2xl">Lo has visto todo</h2>
            <p className="text-sm text-[var(--c-texto-suave)]">
              No queda ningún título estrenado por ver. Ahora toca esperar a los próximos estrenos.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const apariencia = APARIENCIA_TIPOS[siguiente.tipo];

  return (
    <div className="contenedor-guia">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 rounded-[var(--radio-lg)] border border-[var(--c-borde)] bg-[var(--c-superficie)] p-5 shadow-[var(--sombra-media)] sm:p-6 lg:flex-row lg:items-center lg:gap-6"
        style={{ borderLeft: `4px solid ${apariencia.linea}` }}
      >
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--c-acento)] uppercase">
            Siguiente para ver
          </p>
          <h2 className="titular mt-1 text-3xl sm:text-4xl">{siguiente.titulo}</h2>
          <p className="mt-1 text-sm text-[var(--c-texto-suave)]">
            <span style={{ color: apariencia.texto }}>{apariencia.etiqueta}</span>
            <span aria-hidden="true"> · </span>
            {siguiente.anio}
            {siguiente.duracionMin !== undefined && (
              <>
                <span aria-hidden="true"> · </span>
                {formatearDuracion(siguiente.duracionMin)}
              </>
            )}
            <span aria-hidden="true"> · </span>
            {siguiente.bloqueNombre}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Boton variante="primario" tamano="lg" onClick={() => onMarcar(siguiente.id)}>
            <Check size={18} aria-hidden="true" />
            Marcar vista
          </Boton>
          <Boton variante="secundario" tamano="lg" onClick={() => onIrA(siguiente.id)}>
            Ver en la guía
          </Boton>
        </div>
      </motion.div>
    </div>
  );
}
