import clsx from 'clsx';
import type { ReactNode } from 'react';

interface Props {
  activo?: boolean;
  /** Color de acento del chip, normalmente el del tipo de contenido. */
  color?: string;
  onClick?: () => void;
  'aria-pressed'?: boolean;
  children: ReactNode;
}

/**
 * Píldora seleccionable de los filtros.
 *
 * Cuando recibe `onClick` se comporta como un botón de dos estados y expone
 * `aria-pressed`; sin él es solo una etiqueta.
 */
export function Chip({ activo = false, color, onClick, children, ...resto }: Props) {
  const clases = clsx(
    'tactil inline-flex items-center gap-1.5 rounded-[var(--radio-full)] border px-3.5 py-1.5',
    'text-sm font-medium transition-colors duration-150',
    activo
      ? 'border-transparent bg-[var(--c-texto)] text-[var(--c-texto-invertido)]'
      : 'border-[var(--c-borde)] bg-[var(--c-superficie)] text-[var(--c-texto-suave)] hover:border-[var(--c-borde-fuerte)] hover:text-[var(--c-texto)]',
  );

  const contenido = (
    <>
      {color !== undefined && (
        <span
          aria-hidden="true"
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      {children}
    </>
  );

  if (!onClick) {
    return <span className={clases}>{contenido}</span>;
  }

  return (
    <button type="button" className={clases} onClick={onClick} {...resto}>
      {contenido}
    </button>
  );
}
