import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Tema } from '../../hooks/useTema';

interface Props {
  tema: Tema;
  onConmutar: () => void;
}

/** Conmutador ☀️/🌙 de la cabecera. */
export function ConmutadorTema({ tema, onConmutar }: Props) {
  const esOscuro = tema === 'oscuro';

  return (
    <button
      type="button"
      onClick={onConmutar}
      aria-label={esOscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      title={esOscuro ? 'Tema claro' : 'Tema oscuro'}
      className="tactil relative grid size-11 place-items-center rounded-[var(--radio-full)] border border-[var(--c-borde)] bg-[var(--c-superficie)] text-[var(--c-texto-suave)] transition-colors hover:border-[var(--c-borde-fuerte)] hover:text-[var(--c-texto)]"
    >
      <motion.span
        key={tema}
        initial={{ rotate: -70, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="grid place-items-center"
      >
        {esOscuro ? <Moon size={19} aria-hidden="true" /> : <Sun size={19} aria-hidden="true" />}
      </motion.span>
    </button>
  );
}
