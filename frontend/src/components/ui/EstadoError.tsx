import { RotateCcw, TriangleAlert } from 'lucide-react';
import { Boton } from './Boton';

interface Props {
  titulo?: string;
  mensaje: string;
  onReintentar?: () => void;
}

/**
 * Mensaje amable cuando algo falla, con botón de reintento.
 *
 * Nunca se deja una pantalla rota o en blanco: si la API no responde, esto es
 * lo que ve la persona.
 */
export function EstadoError({
  titulo = 'No hemos podido cargar la guía',
  mensaje,
  onReintentar,
}: Props) {
  return (
    <div
      role="alert"
      className="contenedor-guia flex flex-col items-center gap-4 py-20 text-center"
    >
      <span className="grid size-14 place-items-center rounded-[var(--radio-full)] bg-[var(--c-acento-suave)] text-[var(--c-acento)]">
        <TriangleAlert size={26} aria-hidden="true" />
      </span>
      <h2 className="titular text-3xl">{titulo}</h2>
      <p className="max-w-prose text-[var(--c-texto-suave)]">{mensaje}</p>
      {onReintentar && (
        <Boton variante="primario" tamano="lg" onClick={onReintentar}>
          <RotateCcw size={18} aria-hidden="true" />
          Reintentar
        </Boton>
      )}
    </div>
  );
}
