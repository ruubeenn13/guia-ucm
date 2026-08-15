import { useCallback, useMemo, useState } from 'react';
import { SearchX } from 'lucide-react';
import { toast } from 'sonner';
import { Boton } from '../../components/ui/Boton';
import { EsqueletoGuia } from '../../components/ui/Esqueleto';
import { EstadoError } from '../../components/ui/EstadoError';
import { BarraControles } from './componentes/BarraControles';
import { GrupoTitulos } from './componentes/GrupoTitulos';
import { Hero } from './componentes/Hero';
import { Leyenda } from './componentes/Leyenda';
import { SeccionesOpcionales } from './componentes/SeccionesOpcionales';
import { SiguienteParaVer } from './componentes/SiguienteParaVer';
import { PanelEstadisticas } from '../progreso/componentes/PanelEstadisticas';
import { useProgreso } from '../progreso/estado';
import { useCatalogo } from './useCatalogo';
import {
  agrupar,
  aplanar,
  calcularEstadisticas,
  filtrar,
  FILTROS_INICIALES,
  siguienteParaVer,
  type Filtros,
} from './modelo';

/**
 * Página principal: la guía entera.
 *
 * Toda la derivación (filtrado, agrupación, estadísticas) sale de funciones
 * puras de `modelo.ts`, así que aquí solo queda el estado de la interfaz y
 * cómo se encadenan las secciones.
 */
export function PaginaGuia() {
  const consulta = useCatalogo('es');
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIALES);

  const vistos = useProgreso((estado) => estado.vistos);
  const horasPorDia = useProgreso((estado) => estado.horasPorDia);
  const alternar = useProgreso((estado) => estado.alternar);
  const establecerHorasPorDia = useProgreso((estado) => estado.establecerHorasPorDia);

  const catalogo = consulta.data;

  const titulos = useMemo(() => (catalogo ? aplanar(catalogo) : []), [catalogo]);
  const filtrados = useMemo(() => filtrar(titulos, filtros, vistos), [titulos, filtros, vistos]);
  const grupos = useMemo(() => agrupar(filtrados, filtros.orden), [filtrados, filtros.orden]);
  const estadisticas = useMemo(
    () =>
      catalogo
        ? calcularEstadisticas(catalogo, vistos)
        : {
            total: 0,
            vistos: 0,
            porcentaje: 0,
            minutosTotales: 0,
            minutosVistos: 0,
            minutosRestantes: 0,
            minutosOpcionales: 0,
          },
    [catalogo, vistos],
  );
  const siguiente = useMemo(() => siguienteParaVer(titulos, vistos), [titulos, vistos]);

  const cambiarFiltros = useCallback((cambio: Partial<Filtros>) => {
    setFiltros((actuales) => ({ ...actuales, ...cambio }));
  }, []);

  const irATitulo = useCallback((id: number) => {
    document.getElementById(`titulo-${id}`)?.scrollIntoView({ block: 'center' });
  }, []);

  const alternarConAviso = useCallback(
    (id: number) => {
      const titulo = titulos.find((candidato) => candidato.id === id);
      alternar(id);
      if (titulo) {
        toast(vistos[id] ? `«${titulo.titulo}» ya no está marcada` : `«${titulo.titulo}» vista`);
      }
    },
    [alternar, titulos, vistos],
  );

  if (consulta.isPending) {
    return <EsqueletoGuia />;
  }

  if (consulta.isError || !catalogo) {
    return (
      <EstadoError
        mensaje={consulta.error?.message ?? 'No hemos podido contactar con el servidor.'}
        onReintentar={() => void consulta.refetch()}
      />
    );
  }

  return (
    <>
      <Hero
        estadisticas={estadisticas}
        onIrASiguiente={() => (siguiente ? irATitulo(siguiente.id) : irATitulo(1))}
      />

      <div className="flex flex-col gap-10 pb-4">
        <SiguienteParaVer siguiente={siguiente} onMarcar={alternarConAviso} onIrA={irATitulo} />

        <PanelEstadisticas
          estadisticas={estadisticas}
          horasPorDia={horasPorDia}
          onCambiarHoras={establecerHorasPorDia}
        />
      </div>

      <BarraControles
        filtros={filtros}
        onCambiar={cambiarFiltros}
        estadisticas={estadisticas}
        resultados={filtrados.length}
      />

      <main id="guia" className="contenedor-guia flex flex-col gap-14 py-10">
        {grupos.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <SearchX size={34} aria-hidden="true" className="text-[var(--c-texto-tenue)]" />
            <h2 className="titular text-3xl">Ningún título coincide</h2>
            <p className="max-w-prose text-[var(--c-texto-suave)]">
              Prueba a quitar algún filtro o a buscar con otras palabras.
            </p>
            <Boton variante="secundario" onClick={() => setFiltros(FILTROS_INICIALES)}>
              Quitar los filtros
            </Boton>
          </div>
        ) : (
          grupos.map((grupo) => (
            <GrupoTitulos
              key={grupo.clave}
              grupo={grupo}
              orden={filtros.orden}
              vistos={vistos}
              onAlternar={alternarConAviso}
            />
          ))
        )}
      </main>

      <div className="flex flex-col gap-14 pb-8">
        <SeccionesOpcionales secciones={catalogo.opcionales} />
        <Leyenda />
      </div>
    </>
  );
}
