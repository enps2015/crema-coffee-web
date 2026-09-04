/**
 * IBGE Service — Malhas GeoJSON & SIDRA PAM Production Data
 */
import { CONFIG } from '../config.js';

async function fetchJSON(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} from ${url}`);
  }
  return response.json();
}

export async function fetchIbgeMalhas() {
  return fetchJSON(CONFIG.APIS.IBGE_MALHAS);
}

export async function fetchIbgePamSafra() {
  const data = await fetchJSON(CONFIG.APIS.IBGE_SIDRA_PAM);
  const rows = data.filter(
    r =>
      /quantidade produzida/i.test(r['D2N'] || '') &&
      /caf/i.test(r['D4N'] || '') &&
      /sacas/i.test(r['D3N'] || '')
  );

  const map = {};
  rows.forEach(r => {
    const uf = r['D1N'];
    map[uf] = Math.max(map[uf] || 0, parseFloat(r['V']) || 0);
  });

  const top = Object.entries(map)
    .filter(([k, v]) => v > 0 && !/Brasil|Região|Exterior/i.test(k))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  if (top.length) {
    return {
      rows: top,
      total: top.reduce((s, [, v]) => s + v, 0)
    };
  }

  throw new Error('IBGE PAM data empty or unparseable');
}
