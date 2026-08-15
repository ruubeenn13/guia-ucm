import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Versión del formato guardado. Subirla obliga a migrar lo que ya hubiera. */
const VERSION = 1;
const CLAVE = 'guia-ucm:progreso';

export interface ProgresoExportado {
  version: number;
  exportadoEn: string;
  vistos: Record<number, string>;
}

interface EstadoProgreso {
  /** Identificador del título → fecha en la que se marcó, en ISO 8601. */
  vistos: Record<number, string>;
  /** Horas al día que se usan en la calculadora de maratón. */
  horasPorDia: number;

  alternar: (id: number) => void;
  marcarVarios: (ids: number[]) => void;
  desmarcarVarios: (ids: number[]) => void;
  establecerHorasPorDia: (horas: number) => void;
  reiniciar: () => void;
  importar: (datos: ProgresoExportado) => void;
}

/**
 * Progreso del modo invitado.
 *
 * Vive en `localStorage`, sin cuenta ni servidor. Cuando exista el inicio de
 * sesión, este mismo estado es lo que se manda a `POST /api/v1/progreso/sync`
 * para fundirlo con lo que ya haya en la cuenta.
 */
export const useProgreso = create<EstadoProgreso>()(
  persist(
    (set) => ({
      vistos: {},
      horasPorDia: 2,

      alternar: (id) =>
        set((estado) => {
          const vistos = { ...estado.vistos };
          if (vistos[id]) {
            delete vistos[id];
          } else {
            vistos[id] = new Date().toISOString();
          }
          return { vistos };
        }),

      marcarVarios: (ids) =>
        set((estado) => {
          const vistos = { ...estado.vistos };
          const ahora = new Date().toISOString();
          for (const id of ids) {
            vistos[id] ??= ahora;
          }
          return { vistos };
        }),

      desmarcarVarios: (ids) =>
        set((estado) => {
          const vistos = { ...estado.vistos };
          for (const id of ids) delete vistos[id];
          return { vistos };
        }),

      establecerHorasPorDia: (horas) => set({ horasPorDia: horas }),

      reiniciar: () => set({ vistos: {} }),

      importar: (datos) =>
        set((estado) => ({
          // Unión: importar nunca borra lo que ya estaba marcado.
          vistos: { ...estado.vistos, ...datos.vistos },
        })),
    }),
    { name: CLAVE, version: VERSION },
  ),
);

/**
 * Vuelca el progreso a un objeto listo para descargar como JSON.
 *
 * Sirve para cambiar de dispositivo sin crear cuenta.
 */
export function exportarProgreso(): ProgresoExportado {
  return {
    version: VERSION,
    exportadoEn: new Date().toISOString(),
    vistos: useProgreso.getState().vistos,
  };
}

/**
 * Valida un JSON de progreso venido de fuera.
 *
 * @param datos contenido del archivo, ya parseado
 * @returns el progreso si el formato es correcto, `null` si no lo es
 */
export function validarProgresoImportado(datos: unknown): ProgresoExportado | null {
  if (typeof datos !== 'object' || datos === null) return null;
  const candidato = datos as Partial<ProgresoExportado>;
  if (typeof candidato.vistos !== 'object' || candidato.vistos === null) return null;

  const vistos: Record<number, string> = {};
  for (const [clave, valor] of Object.entries(candidato.vistos)) {
    const id = Number(clave);
    if (Number.isInteger(id) && id > 0 && typeof valor === 'string') {
      vistos[id] = valor;
    }
  }

  return {
    version: typeof candidato.version === 'number' ? candidato.version : VERSION,
    exportadoEn: typeof candidato.exportadoEn === 'string' ? candidato.exportadoEn : '',
    vistos,
  };
}
