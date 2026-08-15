import clsx from 'clsx';

interface Props {
  className?: string;
}

/**
 * Bloque gris con brillo que ocupa el sitio de un contenido mientras llega.
 *
 * Nunca se muestra una pantalla en blanco: la maquetación se dibuja entera
 * desde el primer momento y solo se rellena después.
 */
export function Esqueleto({ className }: Props) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        'relative overflow-hidden rounded-[var(--radio-md)] bg-[var(--c-superficie-alt)]',
        'after:absolute after:inset-0 after:-translate-x-full after:animate-[brillo_1.6s_infinite]',
        'after:bg-gradient-to-r after:from-transparent after:via-[var(--c-borde)] after:to-transparent',
        className,
      )}
    />
  );
}

/** Rejilla de tarjetas fantasma mientras se descarga el catálogo. */
export function EsqueletoGuia() {
  return (
    <div className="contenedor-guia py-10">
      <Esqueleto className="mb-8 h-9 w-64" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-4 sm:gap-5">
        {Array.from({ length: 12 }, (_, indice) => (
          <div key={indice} className="flex flex-col gap-2">
            <Esqueleto className="aspect-[2/3] w-full" />
            <Esqueleto className="h-4 w-4/5" />
            <Esqueleto className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
