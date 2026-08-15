import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { Cabecera } from './Cabecera';
import { PieDeLaWeb } from './PieDeLaWeb';
import { PaginaGuia } from '../features/catalogo/PaginaGuia';
import { useTema } from '../hooks/useTema';

/**
 * Cliente de datos.
 *
 * Se crea fuera del componente: recrearlo en cada render tiraría la caché
 * entera en cuanto React vuelva a montar el árbol.
 */
const clienteConsultas = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

/** Raíz de la aplicación: proveedores, cabecera, contenido y pie. */
export function App() {
  const { tema, conmutar } = useTema();

  return (
    <QueryClientProvider client={clienteConsultas}>
      <a
        href="#guia"
        className="solo-lectores focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-[var(--radio-md)] focus-visible:bg-[var(--c-superficie)] focus-visible:px-4 focus-visible:py-2"
      >
        Saltar al contenido
      </a>

      <Cabecera tema={tema} onConmutarTema={conmutar} />
      <PaginaGuia />
      <PieDeLaWeb />

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'var(--c-superficie)',
            color: 'var(--c-texto)',
            border: '1px solid var(--c-borde)',
          },
        }}
      />
    </QueryClientProvider>
  );
}
