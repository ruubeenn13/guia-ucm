import { Chip } from '../../../components/ui/Chip';
import type { SeccionOpcional } from '../../../tipos/catalogo';

interface Props {
  secciones: SeccionOpcional[];
}

/**
 * Contenido opcional del final de la guía.
 *
 * Va sin check y sin tiempo a propósito: no forma parte del recorrido y
 * marcarlo desvirtuaría el progreso. Son sugerencias para quien quiera
 * seguir tirando del hilo.
 */
export function SeccionesOpcionales({ secciones }: Props) {
  if (secciones.length === 0) return null;

  return (
    <section aria-labelledby="opcionales-titulo" className="contenedor-guia">
      <h2 id="opcionales-titulo" className="titular text-3xl sm:text-4xl">
        Secciones opcionales
      </h2>
      <p className="mt-2 max-w-2xl text-[var(--c-texto-suave)]">
        Fuera de la guía principal, pero en la misma familia. No cuentan para el progreso ni para el
        tiempo.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {secciones.map((seccion) => (
          <article
            key={seccion.clave}
            className="rounded-[var(--radio-lg)] border border-[var(--c-borde)] bg-[var(--c-superficie)] p-5"
          >
            <h3 className="titular text-xl">{seccion.nombre}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {seccion.items.map((item) => (
                <li key={item}>
                  <Chip>{item}</Chip>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
