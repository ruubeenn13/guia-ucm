import { motion } from 'framer-motion';
import { ArrowDown, Play } from 'lucide-react';
import { Boton } from '../../../components/ui/Boton';
import { formatearHoras } from '../../../utils/tiempo';
import type { Estadisticas } from '../modelo';

interface Props {
  estadisticas: Estadisticas;
  onIrASiguiente: () => void;
}

/**
 * Portada de la web.
 *
 * Aquí es donde se decide si alguien se queda. El fondo está preparado para
 * recibir los *backdrops* de TMDB en el hito 3: la capa de imagen entra
 * debajo de estos degradados, que ya están calculados para dejar el texto
 * legible encima con contraste AA en ambos temas.
 */
export function Hero({ estadisticas, onIrASiguiente }: Props) {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Capas de profundidad: aquí abajo irá el backdrop de TMDB. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(75rem 45rem at 15% -20%,
                color-mix(in oklab, var(--c-acento) 26%, transparent), transparent 70%),
              radial-gradient(55rem 40rem at 92% 8%,
                color-mix(in oklab, var(--tipo-serie) 22%, transparent), transparent 72%)`,
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[var(--c-fondo)]" />
      </div>

      <div className="contenedor-guia flex flex-col gap-8 py-16 sm:py-24 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <p className="text-xs font-semibold tracking-[0.28em] text-[var(--c-acento)] uppercase">
            Orden cronológico · {estadisticas.total} títulos
          </p>

          <h1 className="titular mt-3 text-[clamp(3rem,11vw,8rem)]">
            El universo
            <br />
            <span className="text-[var(--c-acento)]">en orden</span>
          </h1>

          <p className="mt-5 max-w-2xl text-[clamp(1rem,1.6vw,1.2rem)] leading-relaxed text-[var(--c-texto-suave)]">
            Todas las películas, series, cortos y especiales de Marvel colocados como ocurren en la
            historia, no como se estrenaron. Marca lo que ya has visto y la guía lleva la cuenta por
            ti — sin cuenta, sin registro y sin perder el sitio.
          </p>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="vidrio flex w-fit max-w-full flex-wrap gap-x-8 gap-y-4 rounded-[var(--radio-lg)] px-5 py-4 sm:px-7 sm:py-5"
        >
          <Dato etiqueta="Tu progreso" valor={`${estadisticas.vistos}/${estadisticas.total}`} />
          <Dato etiqueta="Completado" valor={`${estadisticas.porcentaje}%`} />
          <Dato
            etiqueta="Duración total"
            valor={`≈ ${formatearHoras(estadisticas.minutosTotales)}`}
          />
        </motion.dl>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap gap-3"
        >
          <Boton variante="primario" tamano="lg" onClick={onIrASiguiente}>
            <Play size={18} aria-hidden="true" />
            {estadisticas.vistos === 0 ? 'Empezar por el principio' : 'Ir a mi siguiente'}
          </Boton>
          <Boton
            variante="secundario"
            tamano="lg"
            onClick={() => document.getElementById('guia')?.scrollIntoView({ block: 'start' })}
          >
            <ArrowDown size={18} aria-hidden="true" />
            Ver la guía completa
          </Boton>
        </motion.div>
      </div>
    </section>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div>
      <dt className="text-xs tracking-[0.12em] text-[var(--c-texto-tenue)] uppercase">
        {etiqueta}
      </dt>
      <dd className="titular mt-1 text-3xl sm:text-4xl">{valor}</dd>
    </div>
  );
}
