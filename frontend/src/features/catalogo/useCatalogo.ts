import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { obtenerCatalogo } from '../../services/api';
import { ErrorApi } from '../../services/api';
import type { Catalogo, Idioma } from '../../tipos/catalogo';

/**
 * Descarga el catálogo y lo mantiene en caché.
 *
 * El catálogo solo cambia cuando se despliega una migración nueva, así que no
 * tiene sentido revalidarlo al volver a la pestaña: se marca como fresco
 * durante una hora.
 *
 * @param idioma idioma de los textos
 */
export function useCatalogo(idioma: Idioma): UseQueryResult<Catalogo, ErrorApi> {
  return useQuery<Catalogo, ErrorApi>({
    queryKey: ['catalogo', idioma],
    queryFn: () => obtenerCatalogo(idioma),
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (intentos, error) => {
      // Un 4xx no se arregla repitiendo la misma petición.
      if (error.estado >= 400 && error.estado < 500) return false;
      return intentos < 2;
    },
  });
}
