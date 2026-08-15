/** Utilidades de texto compartidas por toda la aplicación. */

/** Marcas diacríticas sueltas que deja `normalize('NFD')` al separar tilde y letra. */
const DIACRITICOS = /\p{Diacritic}/gu;

/**
 * Deja un texto en minúsculas y sin tildes ni diacríticos.
 *
 * Es lo que permite que buscar «capitan america» encuentre «Capitán
 * América»: nadie debería tener que acertar con los acentos.
 *
 * @param texto texto de entrada
 * @returns el mismo texto normalizado para comparar
 */
export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(DIACRITICOS, '').toLowerCase().trim();
}

/**
 * Comprueba si un texto contiene una búsqueda, ignorando tildes y
 * mayúsculas.
 *
 * @param texto    texto donde buscar
 * @param busqueda lo que se busca
 */
export function contiene(texto: string, busqueda: string): boolean {
  if (busqueda.trim() === '') return true;
  return normalizar(texto).includes(normalizar(busqueda));
}
