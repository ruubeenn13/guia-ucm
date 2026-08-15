import { TarjetaAgrupada } from './TarjetaAgrupada';
import { TarjetaTitulo } from './TarjetaTitulo';
import type { Grupo, Orden } from '../modelo';

interface Props {
  grupo: Grupo;
  orden: Orden;
  vistos: Readonly<Record<number, string>>;
  onAlternar: (id: number) => void;
}

/**
 * Un bloque temático con su encabezado y su rejilla de tarjetas.
 *
 * La rejilla es fluida (`auto-fill` + `minmax`): la densidad se adapta sola
 * desde 320 px hasta un monitor grande, sin puntos de ruptura a mano.
 */
export function GrupoTitulos({ grupo, orden, vistos, onAlternar }: Props) {
  const idSeccion = `bloque-${grupo.clave}`;

  return (
    <section aria-labelledby={`${idSeccion}-titulo`} className="scroll-mt-28">
      {orden === 'cronologico' && (
        <header id={idSeccion} className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="titular text-[var(--c-acento)] text-lg">
            {grupo.bloqueNumero.toString().padStart(2, '0')}
          </span>
          <h2 id={`${idSeccion}-titulo`} className="titular text-2xl sm:text-3xl">
            {grupo.bloqueNombre}
          </h2>
          <span className="text-sm text-[var(--c-texto-tenue)]">{grupo.sagaNombre}</span>
        </header>
      )}

      {orden === 'estreno' && (
        <h2 id={`${idSeccion}-titulo`} className="solo-lectores">
          Títulos por fecha de estreno
        </h2>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] gap-4 sm:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] sm:gap-5">
        {grupo.titulos.map((titulo) =>
          titulo.agrupado ? (
            <TarjetaAgrupada
              key={titulo.id}
              titulo={titulo}
              visto={Boolean(vistos[titulo.id])}
              onAlternar={onAlternar}
            />
          ) : (
            <TarjetaTitulo
              key={titulo.id}
              titulo={titulo}
              visto={Boolean(vistos[titulo.id])}
              onAlternar={onAlternar}
            />
          ),
        )}
      </div>
    </section>
  );
}
