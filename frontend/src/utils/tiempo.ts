/** Formato y cálculo de duraciones. */

/**
 * Convierte minutos a un texto corto tipo «2 h 21 min».
 *
 * @param minutos duración en minutos
 * @returns el texto formateado, o «—» si no hay duración
 */
export function formatearDuracion(minutos: number | undefined): string {
  if (minutos === undefined || minutos <= 0) return '—';
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  if (horas === 0) return `${resto} min`;
  if (resto === 0) return `${horas} h`;
  return `${horas} h ${resto} min`;
}

/**
 * Convierte minutos a un texto largo pensado para totales, tipo «142 h».
 *
 * @param minutos duración en minutos
 */
export function formatearHoras(minutos: number): string {
  const horas = Math.round(minutos / 60);
  return `${horas.toLocaleString('es-ES')} h`;
}

/**
 * Calcula cuántos días de maratón quedan a un ritmo dado.
 *
 * @param minutosRestantes minutos que faltan por ver
 * @param horasPorDia      horas diarias de visionado
 * @returns días necesarios, redondeando hacia arriba; 0 si no queda nada
 */
export function diasDeMaraton(minutosRestantes: number, horasPorDia: number): number {
  if (minutosRestantes <= 0 || horasPorDia <= 0) return 0;
  return Math.ceil(minutosRestantes / (horasPorDia * 60));
}

/**
 * Expresa un número de días como «12 días» o «1 mes y 3 días».
 *
 * @param dias número de días
 */
export function formatearDias(dias: number): string {
  if (dias <= 0) return 'nada, ya lo has visto todo';
  if (dias === 1) return '1 día';
  if (dias < 31) return `${dias} días`;

  const meses = Math.floor(dias / 30);
  const resto = dias % 30;
  const textoMeses = meses === 1 ? '1 mes' : `${meses} meses`;
  if (resto === 0) return textoMeses;
  return `${textoMeses} y ${resto === 1 ? '1 día' : `${resto} días`}`;
}
