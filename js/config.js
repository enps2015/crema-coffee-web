/**
 * CREMA° — Configuration & Constants
 */
export const CONFIG = {
  APIS: {
    IBGE_MALHAS: 'https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application/vnd.geo+json&qualidade=minima&intrarregiao=uf',
    IBGE_SIDRA_PAM: 'https://apisidra.ibge.gov.br/values/t/1613/n3/all/v/all/p/last%201',
    OPEN_METEO: 'https://api.open-meteo.com/v1/forecast',
    BCB_SGS_DOLAR: 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.10813/dados/ultimos/20?formato=json',
    BCB_SGS_PTAX: 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/2?formato=json',
    FRANKFURTER_HOSTS: [
      'https://api.frankfurter.dev/v1',
      'https://api.frankfurter.app'
    ],
    OSM_TILES: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
  },
  CACHE: {
    TERMINAL_KEY: 'crema_live_v1',
    TERMINAL_TTL_MS: 3600000 // 1 hour
  },
  TIMERS: {
    POLLING_INTERVAL_MS: 15 * 60 * 1000 // 15 min
  },
  HERO: {
    CUPS_PER_SECOND: 26.04
  }
};
