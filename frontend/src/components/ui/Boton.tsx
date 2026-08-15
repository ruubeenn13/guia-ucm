import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type VarianteBoton = 'primario' | 'secundario' | 'fantasma';
export type TamanoBoton = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBoton;
  tamano?: TamanoBoton;
  children: ReactNode;
}

const VARIANTES: Record<VarianteBoton, string> = {
  primario:
    'bg-[var(--c-acento)] text-[var(--c-acento-contraste)] border-transparent hover:bg-[var(--c-acento-fuerte)] shadow-[var(--sombra-baja)]',
  secundario:
    'bg-[var(--c-superficie)] text-[var(--c-texto)] border-[var(--c-borde)] hover:border-[var(--c-borde-fuerte)] hover:bg-[var(--c-superficie-alt)]',
  fantasma:
    'bg-transparent text-[var(--c-texto-suave)] border-transparent hover:bg-[var(--c-superficie-alt)] hover:text-[var(--c-texto)]',
};

const TAMANOS: Record<TamanoBoton, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

/**
 * Botón base de la interfaz.
 *
 * Todas las variantes cumplen el área táctil mínima de 44 px en los tamaños
 * `md` y `lg`, que son los que se usan en cualquier acción principal.
 */
export function Boton({
  variante = 'secundario',
  tamano = 'md',
  className,
  type = 'button',
  children,
  ...resto
}: Props) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex items-center justify-center rounded-[var(--radio-full)] border font-medium',
        'transition-[background-color,border-color,color,transform] duration-150',
        'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
        VARIANTES[variante],
        TAMANOS[tamano],
        className,
      )}
      {...resto}
    >
      {children}
    </button>
  );
}
