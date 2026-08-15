import type { Catalogo, Idioma } from '../tipos/catalogo';

/**
 * Cliente de la API.
 *
 * Siempre rutas relativas: en desarrollo las resuelve el proxy de Vite y en
 * producción Nginx. Así no hay ninguna URL de servidor escrita en el código
 * ni variables de entorno que recordar al desplegar.
 */
const BASE = '/api/v1';

/** Error de la API con el código de estado, para poder decidir si reintentar. */
export class ErrorApi extends Error {
  /** Código HTTP, o 0 cuando la petición ni siquiera llegó a salir. */
  readonly estado: number;

  constructor(estado: number, mensaje: string) {
    super(mensaje);
    this.name = 'ErrorApi';
    this.estado = estado;
  }
}

/** Cuerpo de error en formato RFC 9457 que devuelve el backend. */
interface ProblemDetail {
  title?: string;
  detail?: string;
}

async function pedir<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  let respuesta: Response;
  try {
    respuesta = await fetch(`${BASE}${ruta}`, {
      ...opciones,
      headers: { Accept: 'application/json', ...opciones.headers },
    });
  } catch {
    // Sin red o servidor caído: no hay estado HTTP que mirar.
    throw new ErrorApi(0, 'No hemos podido conectar. Comprueba tu conexión.');
  }

  if (!respuesta.ok) {
    let mensaje = 'Algo ha fallado. Inténtalo de nuevo en unos minutos.';
    try {
      const problema = (await respuesta.json()) as ProblemDetail;
      if (problema.detail) mensaje = problema.detail;
    } catch {
      // El cuerpo no era JSON: nos quedamos con el mensaje genérico.
    }
    throw new ErrorApi(respuesta.status, mensaje);
  }

  return (await respuesta.json()) as T;
}

/**
 * Descarga el catálogo completo.
 *
 * @param idioma idioma en el que se quieren los textos
 */
export function obtenerCatalogo(idioma: Idioma): Promise<Catalogo> {
  return pedir<Catalogo>(`/titulos?idioma=${idioma}`);
}
