import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Tipografías autoalojadas (licencia OFL): nada se pide a servidores de
// terceros, ni siquiera una fuente.
import '@fontsource/bebas-neue/400.css';
import '@fontsource-variable/inter';

import './index.css';
import { App } from './app/App';

const raiz = document.getElementById('raiz');
if (!raiz) throw new Error('No se ha encontrado el nodo raíz de la aplicación.');

createRoot(raiz).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
