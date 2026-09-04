/**
 * Open-Meteo Weather Service
 */
import { CONFIG } from '../config.js';
import { LV_REGIONS } from '../data/timeseries.js';

async function fetchJSON(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} from ${url}`);
  }
  return response.json();
}

export async function fetchWeatherData(regions = LV_REGIONS) {
  const lats = regions.map(r => r.lat).join(',');
  const lons = regions.map(r => r.lon).join(',');
  const url = `${CONFIG.APIS.OPEN_METEO}?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m&daily=temperature_2m_min,temperature_2m_max,precipitation_sum&forecast_days=2&timezone=auto`;

  const raw = await fetchJSON(url);
  const arr = Array.isArray(raw) ? raw : [raw];

  return arr.map((w, i) => ({
    n: regions[i].n,
    uf: regions[i].uf,
    temp: w.current.temperature_2m,
    hum: w.current.relative_humidity_2m,
    tMin0: w.daily.temperature_2m_min[0],
    tMin1: w.daily.temperature_2m_min[1],
    rain0: w.daily.precipitation_sum[0] || 0,
    rain1: w.daily.precipitation_sum[1] || 0
  }));
}
