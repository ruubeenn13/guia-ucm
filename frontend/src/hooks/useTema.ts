import { useCallback, useEffect, useState } from 'react';

export type Tema = 'claro' | 'oscuro';

const CLAVE = 'guia-ucm:tema';

/** Lee la preferencia guardada; si no hay ninguna, la del sistema operativo. */
function temaInicial(): Tema {
  const guardado = localStorage.getItem(CLAVE);
  if (guardado === 'claro' || guardado === 'oscuro') return guardado;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro';
}

/** Aplica el tema al documento y avisa al navegador para que pinte a juego
 *  la barra de direcciones en móvil y los controles nativos. */
function aplicar(tema: Tema): void {
  const raiz = document.documentElement;
  raiz.dataset['tema'] = tema;
  raiz.style.colorScheme = tema === 'oscuro' ? 'dark' : 'light';

  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = tema === 'oscuro' ? '#0b0a0f' : '#f6f4f1';
}

/**
 * Tema claro/oscuro conmutable y persistido.
 *
 * El valor inicial sale de `prefers-color-scheme`, pero en cuanto la persona
 * elige uno manda su elección, incluso si luego cambia el tema del sistema.
 */
export function useTema(): { tema: Tema; conmutar: () => void } {
  const [tema, setTema] = useState<Tema>(temaInicial);

  useEffect(() => {
    aplicar(tema);
  }, [tema]);

  // Mientras no haya elección explícita, seguimos al sistema.
  useEffect(() => {
    const consulta = window.matchMedia('(prefers-color-scheme: dark)');
    const alCambiar = (evento: MediaQueryListEvent): void => {
      if (localStorage.getItem(CLAVE) === null) {
        setTema(evento.matches ? 'oscuro' : 'claro');
      }
    };
    consulta.addEventListener('change', alCambiar);
    return () => consulta.removeEventListener('change', alCambiar);
  }, []);

  const conmutar = useCallback(() => {
    setTema((actual) => {
      const siguiente: Tema = actual === 'oscuro' ? 'claro' : 'oscuro';
      localStorage.setItem(CLAVE, siguiente);
      return siguiente;
    });
  }, []);

  return { tema, conmutar };
}
