import { ConmutadorTema } from '../components/ui/ConmutadorTema';
import type { Tema } from '../hooks/useTema';

interface Props {
  tema: Tema;
  onConmutarTema: () => void;
}

/** Cabecera de la web: marca y conmutador de tema. */
export function Cabecera({ tema, onConmutarTema }: Props) {
  return (
    <header className="contenedor-guia flex items-center justify-between gap-4 py-4">
      <a
        href="#guia"
        className="titular text-2xl tracking-wide text-[var(--c-texto)] sm:text-3xl"
        aria-label="Guía UCM, ir a la guía"
      >
        Guía<span className="text-[var(--c-acento)]">UCM</span>
      </a>

      <ConmutadorTema tema={tema} onConmutar={onConmutarTema} />
    </header>
  );
}
