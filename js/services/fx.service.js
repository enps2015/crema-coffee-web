/**
 * Foreign Exchange (FX) Service — BCB & Frankfurter Fallback
 */
import { CONFIG } from '../config.js';

async function fetchJSON(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} from ${url}`);
  }
  return response.json();
}

function processFxSeries(series) {
  const rate = series[series.length - 1].v;
  const base = series.length >= 6 ? series[series.length - 6].v : series[0].v;
  return {
    rate,
    delta: ((rate / base) - 1) * 100,
    series
  };
}

export async function fetchFxData() {
  // 1. Try Central Bank of Brazil SGS API
  try {
    const data = await fetchJSON(CONFIG.APIS.BCB_SGS_DOLAR);
    const series = data.map(r => ({
      d: r.data,
      v: parseFloat(String(r.valor).replace(',', '.'))
    }));
    if (series.length >= 2) {
      return processFxSeries(series);
    }
  } catch (e) {
    console.warn('[FxService] BCB API failed, attempting Frankfurter fallback:', e);
  }

  // 2. Fallback to Frankfurter mirrors
  const end = new Date();
  const start = new Date(Date.now() - 35 * 864e5);
  const iso = d => d.toISOString().slice(0, 10);

  for (const host of CONFIG.APIS.FRANKFURTER_HOSTS) {
    try {
      const url = `${host}/${iso(start)}..${iso(end)}?base=USD&symbols=BRL`;
      const hist = await fetchJSON(url);
      const series = Object.entries(hist.rates)
        .map(([dt, v]) => ({ d: dt, v: v.BRL }))
        .sort((a, b) => (a.d < b.d ? -1 : 1));

      if (series.length >= 2) {
        return processFxSeries(series);
      }
    } catch (e) {
      console.warn(`[FxService] Host ${host} failed:`, e);
    }
  }

  throw new Error('All FX sources unavailable');
}

export async function fetchPtax() {
  const data = await fetchJSON(CONFIG.APIS.BCB_SGS_PTAX);
  if (!data || !data.length) throw new Error('PTAX data empty');
  return parseFloat(String(data[data.length - 1].valor).replace(',', '.'));
}
