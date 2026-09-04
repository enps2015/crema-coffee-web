/**
 * Terminal Live — Weather, Climate Risk, FX & Agricultural PAM Pipeline Module
 */
import { $ } from '../utils/dom.js';
import { fmtBR } from '../utils/formatters.js';
import { CONFIG } from '../config.js';
import { IBGE_FALLBACK } from '../data/timeseries.js';
import { saveTerminalCache, loadTerminalCache, isCacheValid } from '../services/cache.service.js';
import { fetchWeatherData } from '../services/weather.service.js';
import { fetchFxData, fetchPtax } from '../services/fx.service.js';
import { fetchIbgePamSafra } from '../services/ibge.service.js';

export function calculateRiskScore(c) {
  const tMin = Math.min(c.tMin0, c.tMin1 ?? c.tMin0);
  const rain = (c.rain0 || 0) + (c.rain1 || 0);
  const frost = tMin <= 0 ? 100 : tMin <= 2 ? 85 : tMin <= 5 ? 55 : tMin <= 8 ? 25 : 0;
  const dry = rain < 1
    ? (c.hum < 40 && c.temp >= 28 ? 90 : c.hum < 55 && c.temp >= 25 ? 65 : 40)
    : (rain < 5 ? 15 : 0);
  const heat = c.temp >= 35 ? 85 : c.temp >= 32 ? 55 : c.temp >= 30 ? 25 : 0;

  return {
    score: Math.round(Math.max(frost, dry, heat)),
    why: frost >= 50 ? 'geada' : dry >= 50 ? 'seca' : heat >= 50 ? 'calor' : 'estável'
  };
}

const riskLabel = s => (s >= 75 ? 'Alerta' : s >= 50 ? 'Atenção' : s >= 25 ? 'Monitorar' : 'Estável');
const riskClass = s => (s >= 75 ? 'r3' : s >= 50 ? 'r2' : s >= 25 ? 'r1' : 'r0');
const riskIcon = why => (why === 'geada' ? 'thermometer-snowflake' : why === 'seca' ? 'sun' : why === 'calor' ? 'flame' : 'sun');

function updateStamp(isLive) {
  const stampEl = $('#lvStamp');
  if (stampEl) {
    stampEl.textContent =
      (isLive ? 'dados ao vivo · atualizado ' : 'fontes parciais (modo cache) · ') +
      new Date().toLocaleTimeString('pt-BR');
  }
}

function renderSpark(series) {
  const sparkSvg = $('#lvSpark');
  if (!sparkSvg || !series || series.length < 2) return;

  const W = 300, H = 84, P = 6;
  const vs = series.map(s => s.v);
  const min = Math.min(...vs);
  const max = Math.max(...vs);

  const x = i => P + (i / (series.length - 1)) * (W - 2 * P);
  const y = v => P + (1 - (v - min) / (max - min || 1)) * (H - 2 * P - 10);
  const path = series.map((s, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(s.v).toFixed(1)).join(' ');

  sparkSvg.innerHTML = `
    <path d="${path} L ${x(series.length - 1)} ${H - 4} L ${x(0)} ${H - 4} Z" fill="rgba(217,160,91,.12)"/>
    <path d="${path}" fill="none" stroke="#D9A05B" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="${x(series.length - 1)}" cy="${y(vs[vs.length - 1])}" r="4" fill="#F3EBDD"/>
    <text x="${P}" y="${H - 1}" fill="rgba(233,223,206,.45)" font-size="9" font-family="IBM Plex Mono">mín R$ ${fmtBR(min, 2)}</text>
    <text x="${W - P}" y="${H - 1}" text-anchor="end" fill="rgba(233,223,206,.45)" font-size="9" font-family="IBM Plex Mono">máx R$ ${fmtBR(max, 2)}</text>
  `;

  const noteEl = $('#lvSparkNote');
  if (noteEl) {
    noteEl.textContent = `${series.length} pregões · hoje: R$ ${fmtBR(vs[vs.length - 1], 4)}`;
  }
}

function renderIbge(ibgeData) {
  const rows = ibgeData ? ibgeData.rows : IBGE_FALLBACK;
  const max = Math.max(...rows.map(r => r[1]));

  const lvIbge = $('#lvIbge');
  if (lvIbge) {
    lvIbge.innerHTML = rows
      .map(
        ([n, v]) => `
      <div class="lv-ibge-row">
        <b>${n}</b>
        <div class="t"><i style="width:${(v / max) * 100}%"></i></div>
        <em>${fmtBR(v / 1000, 1)} mi</em>
      </div>
    `
      )
      .join('');
  }

  const statusEl = $('#lvIbgeStatus');
  if (statusEl) {
    statusEl.textContent = ibgeData
      ? `Fonte: IBGE/PAM · soma das 6 maiores ≈ ${fmtBR(ibgeData.total / 1000, 1)} mi sacas (último ano disponível)`
      : 'API do IBGE indisponível agora — exibindo valores de referência (Conab, aprox.)';
  }
}

function renderLive(data) {
  if (!data) return;

  // 1. Render FX
  if (data.fx) {
    $('#lvFx').textContent = 'R$ ' + fmtBR(data.fx.rate, 4).replace('.', ',');
    const el = $('#lvFxD');
    if (el) {
      const up = data.fx.delta >= 0;
      el.className = 'lv-delta ' + (up ? 'up' : 'down');
      el.innerHTML = `<i data-lucide="arrow-${up ? 'up' : 'down'}-right"></i>${up ? '+' : ''}${fmtBR(data.fx.delta, 2)}% · 1 semana`;
    }
  }

  // 2. Render PTAX
  if (data.ptax) {
    $('#lvPtax').textContent = 'R$ ' + fmtBR(data.ptax, 4).replace('.', ',');
  }

  // 3. Render Weather Regions & Risk
  if (data.regions) {
    const risks = data.regions.map(calculateRiskScore);
    const gridEl = $('#lvGrid');
    if (gridEl) {
      gridEl.innerHTML = data.regions
        .map((r, i) => {
          const rs = risks[i];
          return `
          <article class="lv-tile ${riskClass(rs.score)}" data-tip-title="${r.n} (${r.uf})" data-tip="Condições agora: ${Math.round(r.temp)} °C, umidade ${Math.round(r.hum)}%, chuva prevista 48 h ${fmtBR((r.rain0 || 0) + (r.rain1 || 0), 1)} mm, mínima prevista ${Math.round(r.tMin0)} °C. Índice CREMA° ${rs.score}/100 — ${riskLabel(rs.score)}. Fator dominante: ${rs.why}. O índice mede estresse climático (seca, geada, calor) sobre as lavouras: valores altos sugerem risco de safra menor e pressão de alta nos preços.">
            <header>
              <span class="lv-uf">${r.uf}</span>
              <i data-lucide="${riskIcon(rs.why)}"></i>
            </header>
            <b class="lv-temp">${Math.round(r.temp)}°</b>
            <span class="lv-name">${r.n}</span>
            <div class="lv-meta">
              <span><i data-lucide="droplets"></i>${Math.round(r.hum)}%</span>
              <span><i data-lucide="cloud-rain"></i>${fmtBR((r.rain0 || 0) + (r.rain1 || 0), 1)} mm</span>
              <span><i data-lucide="moon"></i>mín ${Math.round(r.tMin0)}°</span>
            </div>
            <div class="lv-risk">
              <div class="lv-risk-bar"><i style="width:${rs.score}%"></i></div>
              <span>${rs.score} · ${riskLabel(rs.score)}</span>
            </div>
          </article>
        `;
        })
        .join('');
    }

    const alerts = risks.filter(r => r.score >= 50).length;
    $('#lvAlerts').textContent = alerts + ' / ' + data.regions.length;
    $('#lvAlertKpi').classList.toggle('alert', alerts > 0);
    $('#lvAlertsSub').textContent = alerts
      ? (alerts > 2 ? 'Terreno quente para os preços' : 'Atenção: regiões sob pressão climática')
      : 'Nenhuma região com índice ≥ 50';

    const minT = Math.min(...data.regions.map(r => r.tMin0));
    $('#lvMin').textContent = Math.round(minT) + '°';
    $('#lvMinKpi').classList.toggle('alert', minT < 3);
  }

  if (window.lucide) window.lucide.createIcons();
}

let isBusy = false;

export async function refreshLive(manual = false) {
  if (isBusy) return;
  isBusy = true;

  const refreshBtn = $('#lvRefresh');
  if (manual && refreshBtn) {
    refreshBtn.classList.add('busy');
  }

  // Load from local storage cache first for instant UX
  const cached = loadTerminalCache();
  if (cached && isCacheValid(cached)) {
    renderLive(cached.d);
  }

  const out = { ...(cached ? cached.d : {}) };

  const [wxRes, fxRes, ptaxRes, ibgeRes] = await Promise.allSettled([
    fetchWeatherData(),
    fetchFxData(),
    fetchPtax(),
    fetchIbgePamSafra()
  ]);

  let isAllLive = false;

  if (wxRes.status === 'fulfilled') {
    out.regions = wxRes.value;
    isAllLive = true;
  }
  if (fxRes.status === 'fulfilled') {
    out.fx = fxRes.value;
    isAllLive = true;
    renderSpark(fxRes.value.series);
  } else if (out.fx) {
    renderSpark(out.fx.series);
  } else {
    $('#lvFxD').textContent = 'fonte indisponível agora';
    $('#lvSparkNote').textContent = 'Câmbio indisponível no momento — clique em "Atualizar agora".';
  }

  if (ptaxRes.status === 'fulfilled') {
    out.ptax = ptaxRes.value;
    isAllLive = true;
  }

  saveTerminalCache(out);
  renderLive(out);

  if (ibgeRes.status === 'fulfilled') {
    renderIbge(ibgeRes.value);
  } else {
    renderIbge(null);
  }

  updateStamp(isAllLive);

  if (manual && refreshBtn) {
    refreshBtn.classList.remove('busy');
  }
  isBusy = false;
}

export function initLiveModule() {
  const refreshBtn = $('#lvRefresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => refreshLive(true));
  }

  setInterval(() => refreshLive(false), CONFIG.TIMERS.POLLING_INTERVAL_MS);
  refreshLive(false);
}
