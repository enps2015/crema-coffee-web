/**
 * Locale & Data Formatters (pt-BR)
 */

/**
 * Format number with Brazilian locale decimals
 * @param {number} n 
 * @param {number} [decimals=0] 
 */
export function fmtBR(n, decimals = 0) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Format seconds into human readable s, min, or h string
 * @param {number} seconds 
 */
export function fmtTime(seconds) {
  if (seconds < 60) return `${fmtBR(seconds)} s`;
  if (seconds < 3600) return `${fmtBR(seconds / 60, 1)} min`;
  return `${fmtBR(seconds / 3600, seconds < 7200 ? 1 : 0)} h`;
}
