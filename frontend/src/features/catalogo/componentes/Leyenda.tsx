import { APARIENCIA_TIPOS } from '../tiposVisuales';
import { TIPOS_TITULO } from '../../../tipos/catalogo';

/** Notas al pie de la guía. Su texto es parte del contenido, no decoración. */
const NOTAS: readonly string[] = [
  'El año entre paréntesis es el de estreno. El orden de la lista es el cronológico dentro de la historia.',
  'Iron Man 2, El Increíble Hulk y Thor transcurren la misma semana.',
  'Loki y What If...? ocurren fuera del tiempo: se colocan donde mejor se entienden.',
  'Las duraciones de series son aproximadas.',
  'Fechas de estreno futuras sujetas a cambios. Guía actualizada a agosto de 2026.',
];

/** Leyenda de colores por tipo de contenido y notas de la guía. */
export function Leyenda() {
  return (
    <section aria-labelledby="leyenda-titulo" className="contenedor-guia">
      <div className="rounded-[var(--radio-lg)] border border-[var(--c-borde)] bg-[var(--c-superficie)] p-5 sm:p-6">
        <h2 id="leyenda-titulo" className="titular text-2xl">
          Leyenda
        </h2>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {TIPOS_TITULO.map((tipo) => (
            <li key={tipo} className="flex items-center gap-2 text-sm text-[var(--c-texto-suave)]">
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full"
                style={{ backgroundColor: APARIENCIA_TIPOS[tipo].linea }}
              />
              {APARIENCIA_TIPOS[tipo].etiqueta}
            </li>
          ))}
        </ul>

        <ul className="mt-5 flex flex-col gap-2 border-t border-[var(--c-borde)] pt-4 text-sm text-[var(--c-texto-suave)]">
          {NOTAS.map((nota) => (
            <li key={nota} className="flex gap-2">
              <span aria-hidden="true" className="text-[var(--c-texto-tenue)]">
                ·
              </span>
              {nota}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
