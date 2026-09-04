/**
 * Brazil Coffee Geography, Leaflet Map, GeoJSON & Botanical Metrics Module
 */
import { $ } from '../utils/dom.js';
import { fmtBR } from '../utils/formatters.js';
import { REGIONS, UF_PROD, UF_FILL, UF_NAMES, METRICS } from '../data/regions.js';
import { fetchIbgeMalhas } from '../services/ibge.service.js';

export function updatePanel(region) {
  const panelContent = $('#rpContent');
  if (!panelContent) return;

  const typeConfig = region.type === 'ara'
    ? ['Arábica', 'b-ara']
    : ['Conilon / Robusta', 'b-con'];
  const ufKey = region.st.split('/')[0];
  const prodVal = UF_PROD[ufKey];

  panelContent.innerHTML = `
    <p class="rp-tag">Região produtora · Brasil</p>
    <h3>${region.n}</h3>
    <div class="rp-badges">
      <span class="badge ${typeConfig[1]}"><i data-lucide="bean"></i>${typeConfig[0]}</span>
      <span class="badge"><i data-lucide="mountain"></i>${region.alt} de altitude</span>
      <span class="badge"><i data-lucide="calendar"></i>Colheita ${region.colh}</span>
    </div>
    <p>${region.why}</p>
    <div class="rp-stats">
      <div>
        <b>${prodVal ? '~' + fmtBR(prodVal, prodVal % 1 ? 1 : 0) + ' mi' : 'em expansão'}</b>
        <span>sacas/ano · ${region.st} (aprox. Conab)</span>
      </div>
      <div>
        <b>${region.type === 'ara' ? '~74%' : '~26%'}</b>
        <span>do café nacional é ${typeConfig[0]}</span>
      </div>
    </div>
    <div class="rp-notes">${region.notes.map(n => `<span>${n}</span>`).join('')}</div>
  `;

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function popupHTML(region) {
  const tp = region.type === 'ara' ? 'Arábica' : 'Conilon / Robusta';
  return `
    <div class="leaf-pop">
      <span class="lp-tag">${tp} · ${region.st} · ${region.alt}</span>
      <h4>${region.n}</h4>
      <div class="lp-notes">${region.notes.map(n => `<span>${n}</span>`).join('')}</div>
      <p>${region.why.replace(/<[^>]+>/g, '')}</p>
    </div>
  `;
}

export function initMapModule() {
  const mapEl = $('#leafMap');
  const statusEl = $('#mapStatus');
  if (!mapEl) return;

  // 1. Initialize Leaflet if available
  if (window.L) {
    const leafMap = window.L.map('leafMap', { scrollWheelZoom: false }).setView([-16.5, -49.5], 4);

    window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · Malha: <a href="https://servicodados.ibge.gov.br">IBGE</a>'
    }).addTo(leafMap);

    // Load IBGE GeoJSON Mesh
    fetchIbgeMalhas()
      .then(gj => {
        window.L.geoJSON(gj, {
          style: f => ({
            color: '#B57A33',
            weight: 1.2,
            opacity: 0.9,
            fillColor: '#D9A05B',
            fillOpacity: (UF_FILL[f.properties && f.properties.codarea] || 0) * 0.35
          }),
          onEachFeature: (f, layer) => {
            const cod = f.properties && f.properties.codarea;
            if (!cod) return;
            layer.on('click', () => {
              const r = REGIONS.find(x => x.uf === cod);
              if (r) {
                leafMap.flyTo([r.lat, r.lon], 6, { duration: 0.8 });
                updatePanel(r);
              }
            });
          }
        }).addTo(leafMap);

        if (statusEl) {
          statusEl.textContent = 'Tiles OpenStreetMap + malha oficial dos estados (API IBGE)';
        }
      })
      .catch(err => {
        console.warn('[MapModule] IBGE Mesh load failed:', err);
        if (statusEl) {
          statusEl.textContent = 'Tiles OSM ativos · malha IBGE indisponível agora';
        }
      });

    // Add region markers
    REGIONS.forEach(r => {
      const icon = window.L.divIcon({
        className: '',
        html: `<div class="crema-pin${r.type === 'con' ? ' con' : ''}"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -22]
      });

      const mk = window.L.marker([r.lat, r.lon], { icon }).addTo(leafMap).bindPopup(popupHTML(r), { maxWidth: 250 });
      mk.on('click', () => updatePanel(r));
    });

    setTimeout(() => leafMap.invalidateSize(), 900);
  } else {
    // Fallback UI
    mapEl.innerHTML = `
      <div class="rg-fallback">
        <p class="src-note" style="padding:4px 10px">Mapa interativo indisponível (CDN do Leaflet não carregou). Selecione uma região:</p>
        ${REGIONS.map(r => `<button type="button" data-region-id="${r.id}">${r.n} · ${r.st}</button>`).join('')}
      </div>
    `;
    mapEl.querySelectorAll('button[data-region-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const r = REGIONS.find(x => x.id === btn.dataset.regionId);
        if (r) updatePanel(r);
      });
    });
    if (statusEl) {
      statusEl.textContent = 'Modo fallback · Leaflet indisponível';
    }
  }

  // Initial panel render with Sul de Minas
  updatePanel(REGIONS[0]);

  // 2. Render UF Production Ranking
  const ufRankEl = $('#ufRank');
  if (ufRankEl) {
    ufRankEl.innerHTML = Object.entries(UF_PROD)
      .sort((a, b) => b[1] - a[1])
      .map(([st, v], i) => {
        const nm = UF_NAMES[st] || st;
        return `
          <div class="rank-row">
            <b>${nm}</b>
            <div class="t"><i style="--w:${(v / 30) * 100}%;--d:${i * 0.07}s"></i></div>
            <em>~${fmtBR(v, v % 1 ? 1 : 0)} mi</em>
          </div>
        `;
      }).join('');
  }

  // 3. Render Arabica vs Robusta Botanical Metrics
  const vsBodyEl = $('#vsBody');
  if (vsBodyEl) {
    vsBodyEl.innerHTML = METRICS.map((m, i) => `
      <div class="metric">
        <p class="metric-name">${m.n}</p>
        <div class="bar-row bar-A">
          <span class="mono" style="font-size:11px;color:var(--crema)">ARA</span>
          <div class="bar-track">
            <div class="bar-fill" style="--w:${(m.A[0] / m.max) * 100}%;--d:${i * 0.06}s"></div>
          </div>
          <em>${m.A[1]}</em>
        </div>
        <div class="bar-row bar-B">
          <span class="mono" style="font-size:11px;color:#8A9B6E">ROB</span>
          <div class="bar-track">
            <div class="bar-fill" style="--w:${(m.B[0] / m.max) * 100}%;--d:${i * 0.06 + 0.04}s"></div>
          </div>
          <em>${m.B[1]}</em>
        </div>
      </div>
    `).join('');
  }
}
